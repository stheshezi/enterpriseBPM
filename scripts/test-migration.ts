/**
 * Migration Testing & Validation Script
 *
 * This script validates the migration for staging/pre-production testing:
 * 1. Validates data integrity post-migration
 * 2. Checks workflow dependencies
 * 3. Verifies reference integrity
 * 4. Tests querying performance
 *
 * Usage:
 *   npx tsx scripts/test-migration.ts --env staging
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ValidationResult {
  name: string;
  passed: boolean;
  details: string;
  itemsChecked?: number;
  errors?: string[];
}

async function runValidations(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  // 1. Check Request count
  console.log("🔍 Validating Request Model...");
  try {
    const requestCount = await prisma.request.count();
    results.push({
      name: "Request count",
      passed: requestCount > 0,
      details: `Found ${requestCount} requests`,
      itemsChecked: requestCount,
    });
  } catch (error) {
    results.push({
      name: "Request count",
      passed: false,
      details: String(error),
    });
  }

  // 2. Check payload integrity
  console.log("📦 Validating Payload Structure...");
  try {
    const requestsWithPayload = await prisma.request.findMany({
      where: {
        payload: { not: { equals: {} } },
      },
      take: 5,
    });

    const allValid = requestsWithPayload.every(
      (req: any) =>
        req.payload &&
        typeof req.payload === "object" &&
        req.payload.requestType === "travel"
    );

    results.push({
      name: "Payload structure",
      passed: allValid,
      details: `Validated ${requestsWithPayload.length} payloads`,
      itemsChecked: requestsWithPayload.length,
    });
  } catch (error) {
    results.push({
      name: "Payload structure",
      passed: false,
      details: String(error),
    });
  }

  // 3. Check RequestType associations
  console.log("🔗 Validating RequestType Relations...");
  try {
    const travelType = await prisma.requestType.findFirst({
      where: { code: "TRAVEL" },
    });

    if (!travelType) {
      results.push({
        name: "RequestType association",
        passed: false,
        details: "Travel request type not found",
      });
    } else {
      const requestsWithType = await prisma.request.count({
        where: { requestTypeId: travelType.id },
      });

      results.push({
        name: "RequestType association",
        passed: requestsWithType > 0,
        details: `Found ${requestsWithType} requests linked to travel type`,
        itemsChecked: requestsWithType,
      });
    }
  } catch (error) {
    results.push({
      name: "RequestType association",
      passed: false,
      details: String(error),
    });
  }

  // 4. Check WorkflowTask associations
  console.log("📋 Validating WorkflowTask Relations...");
  try {
    const taskCount = await prisma.workflowTask.count();
    const orphanedTasks = await prisma.workflowTask.findMany({
      where: {
        request: null,
      },
      take: 1,
    });

    results.push({
      name: "WorkflowTask associations",
      passed: orphanedTasks.length === 0,
      details: `${taskCount} tasks found, ${orphanedTasks.length} orphaned`,
      itemsChecked: taskCount,
      errors: orphanedTasks.length > 0 ? ["Found orphaned tasks"] : undefined,
    });
  } catch (error) {
    results.push({
      name: "WorkflowTask associations",
      passed: false,
      details: String(error),
    });
  }

  // 5. Check ApprovalAction associations
  console.log("✅ Validating ApprovalAction Relations...");
  try {
    const actionCount = await prisma.approvalAction.count();
    const invalidActions = await prisma.approvalAction.findMany({
      where: {
        request: null,
      },
      take: 1,
    });

    results.push({
      name: "ApprovalAction associations",
      passed: invalidActions.length === 0,
      details: `${actionCount} actions found, ${invalidActions.length} invalid`,
      itemsChecked: actionCount,
    });
  } catch (error) {
    results.push({
      name: "ApprovalAction associations",
      passed: false,
      details: String(error),
    });
  }

  // 6. Check AuditLog references
  console.log("📜 Validating AuditLog References...");
  try {
    const auditCount = await prisma.auditLog.count({
      where: {
        entityType: "Request",
      },
    });

    results.push({
      name: "AuditLog entity type updates",
      passed: auditCount > 0,
      details: `${auditCount} audit logs with 'Request' entity type`,
      itemsChecked: auditCount,
    });
  } catch (error) {
    results.push({
      name: "AuditLog entity type updates",
      passed: false,
      details: String(error),
    });
  }

  // 7. Check WorkflowEvent associations
  console.log("⚡ Validating WorkflowEvent Relations...");
  try {
    const eventCount = await prisma.workflowEvent.count();
    const missingRequests = await prisma.workflowEvent.findMany({
      where: {
        requestId: { not: null },
        request: null,
      },
      take: 1,
    });

    results.push({
      name: "WorkflowEvent associations",
      passed: missingRequests.length === 0,
      details: `${eventCount} events found, ${missingRequests.length} missing requests`,
      itemsChecked: eventCount,
    });
  } catch (error) {
    results.push({
      name: "WorkflowEvent associations",
      passed: false,
      details: String(error),
    });
  }

  // 8. Performance test - Query complexity
  console.log("⚡ Testing Query Performance...");
  try {
    const startTime = Date.now();
    const request = await prisma.request.findFirst({
      include: {
        requester: true,
        requestType: true,
        tasks: {
          include: {
            assignee: true,
          },
        },
        approvalActions: {
          orderBy: { actionTimestamp: "desc" },
          take: 10,
        },
        workflowEvents: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    const queryTime = Date.now() - startTime;

    results.push({
      name: "Query performance",
      passed: queryTime < 1000,
      details: `Complex query completed in ${queryTime}ms`,
    });
  } catch (error) {
    results.push({
      name: "Query performance",
      passed: false,
      details: String(error),
    });
  }

  // 9. Check for duplicate data
  console.log("🔎 Checking for Duplicate Requests...");
  try {
    const duplicates = await prisma.request.groupBy({
      by: ["requestNumber"],
      _count: true,
      having: {
        requestNumber: { _count: { gt: 1 } },
      },
    });

    results.push({
      name: "Duplicate detection",
      passed: duplicates.length === 0,
      details: `Found ${duplicates.length} duplicate request numbers`,
      errors:
        duplicates.length > 0
          ? duplicates.map((d: any) => `${d.requestNumber}: ${d._count} times`)
          : undefined,
    });
  } catch (error) {
    results.push({
      name: "Duplicate detection",
      passed: false,
      details: String(error),
    });
  }

  // 10. Data completeness check
  console.log("📊 Validating Data Completeness...");
  try {
    const incompleteRequests = await prisma.request.count({
      where: {
        OR: [
          { requestNumber: null },
          { requesterId: null },
          { tenantId: null },
          { status: null },
        ],
      },
    });

    results.push({
      name: "Data completeness",
      passed: incompleteRequests === 0,
      details: `${incompleteRequests} requests with missing critical fields`,
      errors:
        incompleteRequests > 0
          ? ["Found requests with missing required fields"]
          : undefined,
    });
  } catch (error) {
    results.push({
      name: "Data completeness",
      passed: false,
      details: String(error),
    });
  }

  return results;
}

async function main() {
  console.log("🧪 Running Migration Validation Tests");
  console.log("====================================\n");

  try {
    const results = await runValidations();

    console.log("\n====================================");
    console.log("📋 Validation Results");
    console.log("====================================\n");

    let passedCount = 0;
    const errors: string[] = [];

    results.forEach((result) => {
      const status = result.passed ? "✅ PASS" : "❌ FAIL";
      console.log(`${status} | ${result.name}`);
      console.log(`        ${result.details}`);
      if (result.itemsChecked !== undefined) {
        console.log(`        Items checked: ${result.itemsChecked}`);
      }
      if (result.errors) {
        result.errors.forEach((err) => {
          console.log(`        ⚠️  ${err}`);
          errors.push(`[${result.name}] ${err}`);
        });
      }
      console.log();

      if (result.passed) passedCount++;
    });

    console.log("====================================");
    console.log(`Results: ${passedCount}/${results.length} passed`);
    console.log("====================================\n");

    if (errors.length > 0) {
      console.log("⚠️  Issues found:");
      errors.forEach((err) => console.log(`  - ${err}`));
      process.exit(1);
    } else {
      console.log("✅ All validations passed! Migration is ready for production.\n");
    }
  } catch (error) {
    console.error("❌ Validation failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
