/**
 * Data Migration Script: Travel Requests → Generic Requests
 *
 * This script migrates existing travel request data to the generic request model
 * while preserving all travel-specific data in the payload field.
 *
 * Usage:
 *   npx tsx scripts/migrate-travel-requests.ts
 *
 * Rollback:
 *   If something goes wrong, the script creates a backup collection
 *   and all original data remains in the backup for recovery.
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface LegacyTravelRequest {
  _id: string;
  requestNumber: string;
  requesterId: string;
  tenantId: string;
  departmentId?: string;
  status: string;
  currentStep?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  // Travel-specific fields
  department?: string;
  destination?: string;
  travelType?: string;
  startDate?: Date;
  endDate?: Date;
  purpose?: string;
  estimatedCost?: number;
  costCenter?: string;
}

interface MigrationReport {
  startTime: Date;
  endTime?: Date;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ id: string; error: string }>;
  skippedCount: number;
  skipped: string[];
  backupCollectionName: string;
}

async function main() {
  const report: MigrationReport = {
    startTime: new Date(),
    totalProcessed: 0,
    successCount: 0,
    errorCount: 0,
    errors: [],
    skippedCount: 0,
    skipped: [],
    backupCollectionName: `travelRequests_backup_${Date.now()}`,
  };

  try {
    console.log("🚀 Starting Travel Requests Migration");
    console.log("=====================================\n");

    // Get MongoDB connection for raw operations
    const db = prisma.$client as any;

    // Get all travel requests from the database
    console.log("📊 Fetching travel requests...");
    const travelRequests = await (db.collection('travelRequests')?.find({}).toArray() || []);

    if (travelRequests.length === 0) {
      console.log("ℹ️  No travel requests found to migrate.");
      report.endTime = new Date();
      await saveReport(report);
      return;
    }

    report.totalProcessed = travelRequests.length;
    console.log(`✓ Found ${travelRequests.length} travel requests\n`);

    // Create backup
    console.log("💾 Creating backup...");
    if (db.collections && travelRequests.length > 0) {
      const backupCollection = db.collection(report.backupCollectionName);
      await backupCollection.insertMany(travelRequests);
      console.log(`✓ Backup created as "${report.backupCollectionName}"\n`);
    }

    // Determine request type for travel requests
    let travelRequestType = await prisma.requestType.findFirst({
      where: { code: "TRAVEL" },
    });

    if (!travelRequestType) {
      console.log("⚠️  Travel request type not found. Creating...");
      travelRequestType = await prisma.requestType.create({
        data: {
          code: "TRAVEL",
          name: "Travel Request",
          tenantId: travelRequests[0]?.tenantId || "default",
        },
      });
      console.log(`✓ Created travel request type: ${travelRequestType.id}\n`);
    }

    // Migrate each travel request
    console.log("🔄 Migrating requests...");
    for (let i = 0; i < travelRequests.length; i++) {
      const travelReq = travelRequests[i] as LegacyTravelRequest;

      try {
        // Build payload with all travel-specific data
        const payload = {
          requestType: "travel",
          department: travelReq.department,
          destination: travelReq.destination,
          travelType: travelReq.travelType,
          startDate: travelReq.startDate,
          endDate: travelReq.endDate,
          purpose: travelReq.purpose,
          estimatedCost: travelReq.estimatedCost || 0,
          costCenter: travelReq.costCenter,
          legacyId: travelReq._id, // Track original ID
          migratedAt: new Date(),
        };

        // Create generic request with travel data in payload
        await prisma.request.create({
          data: {
            id: travelReq._id, // Preserve original ID for referential integrity
            requestNumber: travelReq.requestNumber,
            requesterId: travelReq.requesterId,
            tenantId: travelReq.tenantId,
            departmentId: travelReq.departmentId,
            requestTypeId: travelRequestType?.id,
            payload: payload as any,
            status: travelReq.status as any,
            currentStep: travelReq.currentStep,
            version: travelReq.version,
            createdAt: travelReq.createdAt,
            updatedAt: travelReq.updatedAt,
          },
        });

        report.successCount++;

        // Progress indicator
        if ((i + 1) % 10 === 0) {
          console.log(`  Processed ${i + 1}/${travelRequests.length} requests...`);
        }
      } catch (error) {
        report.errorCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        report.errors.push({
          id: travelReq._id,
          error: errorMessage,
        });

        // Check if it's a duplicate key error (request already migrated)
        if (errorMessage.includes("E11000")) {
          report.skippedCount++;
          report.skipped.push(travelReq._id);
        }

        console.error(
          `  ❌ Error migrating request ${travelReq._id}: ${errorMessage}`
        );
      }
    }

    report.endTime = new Date();
    const duration =
      (report.endTime.getTime() - report.startTime.getTime()) / 1000;

    // Print summary
    console.log("\n=====================================");
    console.log("📋 Migration Summary");
    console.log("=====================================");
    console.log(`Total processed:    ${report.totalProcessed}`);
    console.log(`✓ Successful:       ${report.successCount}`);
    console.log(`⚠️  Skipped:         ${report.skippedCount}`);
    console.log(`❌ Failed:          ${report.errorCount}`);
    console.log(`⏱️  Duration:        ${duration.toFixed(2)}s`);
    console.log(`💾 Backup:          ${report.backupCollectionName}`);

    if (report.errorCount > 0) {
      console.log("\nFailed requests:");
      report.errors.forEach((err) => {
        console.log(`  - ${err.id}: ${err.error}`);
      });
    }

    // Save report to file
    await saveReport(report);

    if (report.errorCount === 0 && report.skippedCount === 0) {
      console.log("\n✅ Migration completed successfully!");
    } else {
      console.log("\n⚠️  Migration completed with issues. See report file.");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    report.endTime = new Date();
    await saveReport(report);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function saveReport(report: MigrationReport) {
  const reportPath = path.join(
    process.cwd(),
    `migration-report-${Date.now()}.json`
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
