/**
 * Rollback Script: Revert Generic Requests to Travel Requests
 *
 * This script reverses the migration by:
 * 1. Deleting migrated generic requests
 * 2. Restoring from the backup collection
 *
 * Usage:
 *   npx tsx scripts/rollback-migration.ts --backup <backup_collection_name>
 *
 * Example:
 *   npx tsx scripts/rollback-migration.ts --backup travelRequests_backup_1234567890
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();

async function rollback(backupCollectionName: string) {
  try {
    console.log("🔄 Starting rollback...");
    console.log(`Backup collection: ${backupCollectionName}\n`);

    const db = (prisma as any).$client;

    // Get backup data
    const backupCollection = db.collection(backupCollectionName);
    const backupData = await backupCollection.find({}).toArray();

    if (backupData.length === 0) {
      console.log("❌ No backup data found.");
      return;
    }

    console.log(`📊 Found ${backupData.length} records in backup\n`);

    // Delete migrated requests
    console.log("🗑️  Deleting migrated requests from Request collection...");
    const backupIds = backupData.map((doc: any) => doc._id);
    const deleteResult = await db.collection("Request").deleteMany({
      _id: { $in: backupIds },
    });
    console.log(`✓ Deleted ${deleteResult.deletedCount} requests\n`);

    // Restore backup
    console.log("📥 Restoring from backup...");
    if (backupData.length > 0) {
      await db.collection("TravelRequest").insertMany(backupData);
      console.log(`✓ Restored ${backupData.length} travel requests\n`);
    }

    // Optional: delete backup
    console.log("🗑️  Deleting backup collection...");
    await backupCollection.drop();
    console.log("✓ Backup collection deleted\n");

    console.log("✅ Rollback completed successfully!");
  } catch (error) {
    console.error("❌ Rollback failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line args
const args = process.argv.slice(2);
const backupIndex = args.indexOf("--backup");

if (backupIndex === -1 || !args[backupIndex + 1]) {
  console.error("Usage: npx tsx scripts/rollback-migration.ts --backup <backup_collection_name>");
  process.exit(1);
}

const backupCollectionName = args[backupIndex + 1];
rollback(backupCollectionName).catch(console.error);
