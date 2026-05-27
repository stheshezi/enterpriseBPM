# Prisma Schema - Generic Request Model Implementation

## Execute this in phases:

### PHASE 1: Add to prisma/schema.prisma

Add this AFTER the current RequestType model (before deleting TravelRequest):

```prisma
# NEW: Generic Request Model
model Request {
  id                       String   @id @default(uuid()) @map("_id")
  requestNumber            String   @unique
  requestTypeId            String   # "TRAVEL", "PROCUREMENT", "HR", etc.
  requesterId              String
  tenantId                 String
  departmentId             String?
  requiredAuthorityLevelId String?
  status                   RequestStatus @default(DRAFT)
  currentStep              String?
  title                    String?   # Dynamic title based on type
  summary                  String?   # Quick summary
  payload                  Json      # Type-specific fields stored here
  version                  Int       @default(0)
  createdAt                DateTime  @default(now())
  updatedAt                DateTime  @updatedAt

  # Relations
  requester                User      @relation("UserCreatedRequests", fields: [requesterId], references: [id])
  tenant                   Tenant    @relation("TenantRequests", fields: [tenantId], references: [id])
  department               Department? @relation(fields: [departmentId], references: [id])
  requiredAuthorityLevel   AuthorityLevel? @relation(fields: [requiredAuthorityLevelId], references: [id])
  
  # Workflow Relations
  tasks                    WorkflowTask[] @relation("RequestTasks")
  auditLogs                AuditLog[] @relation("RequestAuditLogs")
  approvalActions          ApprovalAction[] @relation("RequestApprovals")
  workflowAssignments      WorkflowAssignment[] @relation("RequestAssignments")
  workflowEvents           WorkflowEvent[] @relation("RequestEvents")
  approvalSnapshots        ApprovalSnapshot[] @relation("RequestSnapshots")

  @@index([tenantId, status, createdAt])
  @@index([requesterId, tenantId])
  @@index([requestTypeId, tenantId])
}
```

### PHASE 2: Update Enums

Replace the existing `RequestStatus` enum with:

```prisma
enum RequestStatus {
  DRAFT              # Initial creation
  SUBMITTED          # User submitted for approval
  IN_REVIEW          # Under review by approver
  APPROVED           # Approved - ready for execution
  REJECTED           # Rejected - back to requester
  CANCELLED          # User cancelled
  COMPLETED          # Request completed/executed
}
```

### PHASE 3: Update User Model

Change:
```prisma
# OLD
model User {
  travelRequests    TravelRequest[] @relation("RequestCreator")
  ...
}

# NEW
model User {
  createdRequests   Request[] @relation("UserCreatedRequests")
  ...
}
```

### PHASE 4: Update Tenant Model

Change:
```prisma
# OLD
model Tenant {
  travelRequests    TravelRequest[]
  ...
}

# NEW
model Tenant {
  requests          Request[] @relation("TenantRequests")
  ...
}
```

### PHASE 5: Update WorkflowTask Model

Change ALL occurrences:
```prisma
# OLD
model WorkflowTask {
  travelRequestId   String?
  request           TravelRequest? @relation(fields: [travelRequestId], references: [id])
  ...
}

# NEW
model WorkflowTask {
  requestId         String?
  request           Request? @relation("RequestTasks", fields: [requestId], references: [id])
  ...
}
```

### PHASE 6: Update AuditLog Model

Change:
```prisma
# OLD
model AuditLog {
  travelRequestId   String?
  request           TravelRequest? @relation(fields: [travelRequestId], references: [id])
  ...
}

# NEW
model AuditLog {
  requestId         String?
  request           Request? @relation("RequestAuditLogs", fields: [requestId], references: [id])
  ...
}
```

### PHASE 7: Update ApprovalAction Model

Change:
```prisma
# OLD
model ApprovalAction {
  travelRequestId   String?
  request           TravelRequest? @relation(fields: [travelRequestId], references: [id])
  ...
}

# NEW
model ApprovalAction {
  requestId         String
  request           Request @relation("RequestApprovals", fields: [requestId], references: [id])
  ...
}
```

### PHASE 8: Update WorkflowAssignment Model

Change:
```prisma
# OLD
model WorkflowAssignment {
  requestId         String
  request           TravelRequest @relation(fields: [requestId], references: [id])
  ...
}

# NEW
model WorkflowAssignment {
  requestId         String
  request           Request @relation("RequestAssignments", fields: [requestId], references: [id])
  ...
}
```

### PHASE 9: Update WorkflowEvent Model

Change:
```prisma
# OLD
model WorkflowEvent {
  travelRequestId   String?
  request           TravelRequest? @relation(fields: [travelRequestId], references: [id])
  ...
}

# NEW
model WorkflowEvent {
  requestId         String?
  request           Request? @relation("RequestEvents", fields: [requestId], references: [id])
  ...
}
```

### PHASE 10: Update ApprovalSnapshot Model

Change:
```prisma
# OLD
model ApprovalSnapshot {
  travelRequestId   String
  request           TravelRequest @relation(fields: [travelRequestId], references: [id])
  ...
}

# NEW
model ApprovalSnapshot {
  requestId         String
  request           Request @relation("RequestSnapshots", fields: [requestId], references: [id])
  ...
}
```

### PHASE 11: Remove TravelRequest Model

Delete the entire `TravelRequest` model definition.

### PHASE 12: Update Department Model (if needed)

Add relation to generic Request:
```prisma
model Department {
  requests          Request[]
  # ... existing fields
}
```

---

## Execution Steps

1. **Create Migration Branch**
   ```bash
   git checkout -b refactor/generic-request-model
   ```

2. **Update prisma/schema.prisma** with all changes above

3. **Generate Migration**
   ```bash
   npx prisma migrate dev --name refactor_travel_to_generic_request
   ```

4. **Verify Migration Generated Correctly**
   ```bash
   # Check the migration file in prisma/migrations/
   cat prisma/migrations/[timestamp]_refactor_travel_to_generic_request/migration.sql
   ```

5. **Test on Local Database**
   ```bash
   # Reset local DB (CAUTION: destroys data)
   npx prisma migrate reset

   # Or deploy migration only (safer)
   npx prisma migrate deploy
   ```

6. **Update Prisma Client**
   ```bash
   npx prisma generate
   ```

---

## Troubleshooting

### If migration fails with foreign key constraints:
```bash
# Check for orphaned records
db.workflowTasks.find({ travelRequestId: null }).count()

# Manually migrate if needed
npx prisma db execute --stdin < migration-script.sql
```

### If Prisma client generation fails:
```bash
# Clear cache
rm -rf node_modules/.prisma
npx prisma generate
```

### Rollback if needed:
```bash
# Revert to previous state
npx prisma migrate resolve --rolled-back "[timestamp]_refactor_travel_to_generic_request"
```

---

