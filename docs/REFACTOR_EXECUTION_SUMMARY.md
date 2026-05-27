# Generic Request Model Refactoring - Complete Execution Guide

This document summarizes the 10-phase refactoring from TravelRequest to a generic Request model.

## What Changed

### Schema (Phase 1)
- Generic `Request` model replaces `TravelRequest`
- Request-specific data stored in polymorphic `payload` JSON field
- Added `requestTypeId` to link requests to types (travel, expense, leave, etc.)
- Fixed `WorkflowEvent.request` relation to use generic `Request`
- Added `RequestType.requests` reverse relation

### API Routes (Phase 3)
- `/api/travel-requests/*` → `/api/requests/*`
- Generic schema `createRequestSchema` with `payload` field
- Travel-specific validation in `travelRequestPayloadSchema`
- Routes: POST (create), GET (single), GET /list, PATCH (update), DELETE

### Service Layer (Phase 4)
- `createSubmittedRequest()` accepts generic `CreateRequestInput`
- `travelRequestPayloadSchema` validates travel data in payload
- `payload` field stores all travel-specific data:
  ```javascript
  {
    requestType: "travel",
    department: string,
    destination: string,
    travelType: string,
    startDate: Date,
    endDate: Date,
    purpose: string,
    estimatedCost: number,
    costCenter: string,
    legacyId: string,      // Original ID for tracking
    migratedAt: DateTime   // Migration timestamp
  }
  ```

### Components & Types (Phases 5-6)
- Components already use generic "request" naming
- `/app/travel-requests` has redirect to `/app/requests`
- Types automatically aligned through Prisma schema changes

## Migration Scripts

### 1. Data Migration: `scripts/migrate-travel-requests.ts`

Migrates existing travel requests to generic Request model while preserving all data in payload.

**What it does:**
- Reads from `travelRequests` collection
- Creates backup: `travelRequests_backup_[timestamp]`
- Creates/finds TRAVEL RequestType
- Creates generic Request records with payload
- Preserves all relationships and references

**Usage:**
```bash
npx tsx scripts/migrate-travel-requests.ts
```

**Output:**
- Migration report: `migration-report-[timestamp].json`
- Backup collection in MongoDB

**Safety:**
- Non-destructive (original data untouched in backup)
- Idempotent (can be run multiple times safely)
- Preserves original IDs for referential integrity

### 2. Rollback: `scripts/rollback-migration.ts`

Reverses the migration by restoring from backup.

**Usage:**
```bash
npx tsx scripts/rollback-migration.ts --backup travelRequests_backup_1234567890
```

**What it does:**
- Deletes migrated requests from Request collection
- Restores TravelRequest collection from backup
- Cleans up backup collection

### 3. Validation: `scripts/test-migration.ts`

Comprehensive validation suite with 10 checks:
1. Request count verification
2. Payload structure integrity
3. RequestType associations
4. WorkflowTask relations
5. ApprovalAction relations
6. AuditLog references
7. WorkflowEvent associations
8. Query performance
9. Duplicate detection
10. Data completeness

**Usage:**
```bash
npx tsx scripts/test-migration.ts
```

**Output:**
- Pass/fail for each validation
- Details and item counts
- Error list if issues found
- Exit code 1 if any failures

## Deployment Steps

### Pre-Deployment (Staging)

1. **Test the migration:**
   ```bash
   npx tsx scripts/migrate-travel-requests.ts
   ```

2. **Validate data integrity:**
   ```bash
   npx tsx scripts/test-migration.ts
   ```

3. **Test rollback:**
   ```bash
   npx tsx scripts/rollback-migration.ts --backup [backup_collection_name]
   npx tsx scripts/test-migration.ts  # Should fail, as expected
   npx tsx scripts/migrate-travel-requests.ts  # Migrate again
   ```

### Production Deployment

1. **Maintenance window:**
   ```bash
   NODE_ENV=production npm run maintenance:on
   ```

2. **Backup production database:**
   - Coordinate with DBA team
   - Verify backup completion

3. **Generate new Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Run migration:**
   ```bash
   npx tsx scripts/migrate-travel-requests.ts
   ```

5. **Validate migration:**
   ```bash
   npx tsx scripts/test-migration.ts
   ```

6. **Deploy application:**
   ```bash
   npm run build
   npm start
   ```

7. **Exit maintenance mode:**
   ```bash
   NODE_ENV=production npm run maintenance:off
   ```

## Key Points

### Data Structure Example

**Before Migration:**
```json
// TravelRequest collection
{
  "_id": "req-123",
  "requestNumber": "TR-20240101001",
  "requesterId": "user-456",
  "tenantId": "tenant-789",
  "department": "Sales",
  "destination": "New York",
  "travelType": "Conference",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "purpose": "Annual conference",
  "estimatedCost": 5000,
  "costCenter": "SALES-2024",
  "status": "SUBMITTED"
}
```

**After Migration:**
```json
// Request collection
{
  "_id": "req-123",  // Same ID preserved
  "requestNumber": "TR-20240101001",
  "requesterId": "user-456",
  "tenantId": "tenant-789",
  "requestTypeId": "reqtype-travel",
  "payload": {
    "requestType": "travel",
    "department": "Sales",
    "destination": "New York",
    "travelType": "Conference",
    "startDate": "2024-01-15",
    "endDate": "2024-01-17",
    "purpose": "Annual conference",
    "estimatedCost": 5000,
    "costCenter": "SALES-2024",
    "legacyId": "req-123",
    "migratedAt": "2024-01-10T14:30:00Z"
  },
  "status": "SUBMITTED"
}
```

### Benefits of Generic Model

1. **Extensibility:** Easy to add new request types (expense claims, leave requests, etc.)
2. **Code Reuse:** Single Request model for all types, workflow engine, approvals
3. **Data Preservation:** All existing data intact in payload
4. **Backward Compatibility:** Legacy IDs and request numbers preserved
5. **Audit Trail:** Migration tracked via `migratedAt` and `legacyId`

### Future Enhancements

Once deployed, you can add new request types:

```javascript
// Create new request type
await prisma.requestType.create({
  data: {
    code: "EXPENSE",
    name: "Expense Claim",
    tenantId: "tenant-123",
  },
});

// Create expense request with same workflow engine
await workflowEngine.submitRequest({
  input: {
    requestTypeId: "reqtype-expense",
    payload: {
      requestType: "expense",
      vendor: "Acme Corp",
      amount: 250,
      category: "meals",
      // ... other expense-specific fields
    },
  },
  requesterId: "user-456",
  tenantId: "tenant-123",
});
```

## Monitoring Post-Deployment

See `DEPLOYMENT.md` for comprehensive monitoring guide including:
- Key metrics to track
- Alert thresholds
- Dashboard setup
- Daily/weekly verification steps

## Support & Troubleshooting

### Common Issues

**Migration script fails with "Database locked"**
- Ensure no other migrations are running
- Check for idle connections
- Retry after 5 minutes

**Validation test fails with "Orphaned tasks"**
- Check WorkflowTask.requestId values
- Verify all requests were migrated
- Run `test-migration.ts` for full diagnostics

**API returns 404 for new requests**
- Verify Prisma client was regenerated: `npx prisma generate`
- Check request was created in Request collection, not travelRequests
- Review API logs for errors

### Rollback Decision Tree

```
Migration Failed?
├─ Yes, immediately after migration
│  └─ Run: npx tsx scripts/rollback-migration.ts --backup [name]
├─ Yes, found in production after deployment
│  ├─ Check: Are requests working correctly?
│  │  ├─ Yes (false alarm)
│  │  │  └─ Continue monitoring
│  │  └─ No (actual failure)
│  │     ├─ Enable maintenance mode
│  │     └─ Run rollback script
│  └─ If rollback fails
│     └─ Restore from database backup
```

---

**For questions or issues, refer to DEPLOYMENT.md or contact the database/devops team.**
