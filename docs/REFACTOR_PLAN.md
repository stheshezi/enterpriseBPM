# Enterprise BPM Platform: TravelRequest → Request Generic Refactoring

**Status:** Planning Phase  
**Complexity:** High (Core Model Refactor)  
**Estimated Duration:** 5-7 days  
**Risk Level:** Medium (Requires careful data migration)

---

## Executive Summary

This refactoring transforms the platform from a travel-specific system into a generic request management system supporting Travel, Procurement, Finance, HR, Legal, and custom request types.

### Key Changes
- Replace `TravelRequest` model with generic `Request` model
- Move travel-specific fields to JSON `payload` column
- Simplify `RequestStatus` enum (remove role-based states)
- Update all 8 dependent models to reference `Request`
- Maintain full backward compatibility via `requestTypeId` discriminator

---

## Phase 1: Schema Updates

### Current State Analysis
```
Models referencing TravelRequest:
  ✅ User          (travelRequests relation)
  ✅ Tenant        (travelRequests relation)
  ✅ WorkflowTask  (requestId FK)
  ✅ AuditLog      (travelRequestId FK)
  ✅ ApprovalAction (requestId FK)
  ✅ WorkflowAssignment (requestId FK)
  ✅ WorkflowEvent (requestId FK)
  ✅ ApprovalSnapshot (requestId FK)
```

### New Prisma Schema Structure

**Before:** Travel-specific columns hardcoded
```prisma
model TravelRequest {
  id              String
  destination     String
  travelType      String
  startDate       DateTime
  endDate         DateTime
  estimatedCost   Float
  costCenter      String
  status          RequestStatus  // PENDING_LM, PENDING_BUMA, etc.
}
```

**After:** Generic container with JSON payload
```prisma
model Request {
  id                       String
  requestNumber            String        @unique
  requestTypeId            String        // "TRAVEL", "PROCUREMENT", etc.
  requesterId              String
  tenantId                 String
  departmentId             String?
  requiredAuthorityLevelId String?
  status                   RequestStatus // DRAFT, SUBMITTED, IN_REVIEW, etc.
  currentStep              String?
  title                    String?       // Dynamic title per request type
  summary                  String?       // Quick summary
  payload                  Json          // Type-specific data
  version                  Int           @default(0)
  createdAt                DateTime
  updatedAt                DateTime
  
  // Relations
  requester       User
  tenant          Tenant
  department      Department?
  requiredAuthorityLevel AuthorityLevel?
  tasks           WorkflowTask[]
  auditLogs       AuditLog[]
  approvalActions ApprovalAction[]
  workflowAssignments WorkflowAssignment[]
  workflowEvents  WorkflowEvent[]
  approvalSnapshots ApprovalSnapshot[]
}
```

### Enum Simplification

**Before:**
```prisma
enum RequestStatus {
  DRAFT
  SUBMITTED
  PENDING_LM                 // Role-specific
  PENDING_BUMA               // Role-specific
  PENDING_C5                 // Role-specific
  PENDING_CEO                // Role-specific
  MANAGER_APPROVAL           // Travel-specific
  FINANCE_APPROVAL           // Travel-specific
  APPROVED
  REJECTED
  CANCELLED
  COMPLETED
}
```

**After:**
```prisma
enum RequestStatus {
  DRAFT
  SUBMITTED
  IN_REVIEW                  // Generic approval state
  APPROVED
  REJECTED
  CANCELLED
  COMPLETED
}
```

---

## Phase 2: Data Transformation Strategy

### Travel Request → Request Payload Mapping

**Current TravelRequest data:**
```json
{
  "id": "uuid",
  "destination": "New York",
  "startDate": "2024-02-15",
  "endDate": "2024-02-18",
  "travelType": "Business",
  "estimatedCost": 1200,
  "costCenter": "CC100",
  "purpose": "Demo conference"
}
```

**Maps to new Request:**
```json
{
  "id": "uuid",
  "requestTypeId": "TRAVEL",
  "requestNumber": "TR-001",
  "title": "Demo conference - New York",
  "status": "APPROVED",
  "payload": {
    "destination": "New York",
    "startDate": "2024-02-15",
    "endDate": "2024-02-18",
    "travelType": "Business",
    "estimatedCost": 1200,
    "costCenter": "CC100",
    "purpose": "Demo conference"
  },
  "requesterId": "uuid",
  "tenantId": "uuid"
}
```

### Migration Script Logic

```javascript
// Pseudo-code for migration
db.travelRequests.find({}).forEach(travelReq => {
  db.requests.insertOne({
    requestNumber: travelReq.requestNumber,
    requestTypeId: "TRAVEL",
    requesterId: travelReq.requesterId,
    tenantId: travelReq.tenantId,
    status: mapStatus(travelReq.status),
    title: `${travelReq.purpose} - ${travelReq.destination}`,
    payload: {
      destination: travelReq.destination,
      startDate: travelReq.startDate,
      endDate: travelReq.endDate,
      travelType: travelReq.travelType,
      estimatedCost: travelReq.estimatedCost,
      costCenter: travelReq.costCenter,
      purpose: travelReq.purpose
    },
    createdAt: travelReq.createdAt,
    updatedAt: travelReq.updatedAt
  });
  
  // Update all foreign keys
  db.workflowTasks.updateMany(
    { travelRequestId: travelReq.id },
    { $rename: { travelRequestId: "requestId" } }
  );
  
  db.auditLogs.updateMany(
    { travelRequestId: travelReq.id },
    { $set: { requestId: mappedRequest.id } }
  );
  
  // Similar for other models
});
```

---

## Phase 3: Codebase Changes

### TypeScript Types

**Before:**
```typescript
import { TravelRequest } from '@prisma/client';

interface TravelRequestWithRelations extends TravelRequest {
  requester: User;
  tasks: WorkflowTask[];
}
```

**After:**
```typescript
import { Request } from '@prisma/client';

interface RequestWithRelations extends Request {
  requester: User;
  tasks: WorkflowTask[];
}

// Type-safe payload access
type TravelRequestPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  travelType: string;
  estimatedCost: number;
  costCenter: string;
  purpose: string;
};

function getTravelPayload(request: Request): TravelRequestPayload {
  if (request.requestTypeId !== 'TRAVEL') throw new Error('Not a travel request');
  return request.payload as TravelRequestPayload;
}
```

### API Endpoint Changes

**Before:**
```
POST   /api/travel-requests
GET    /api/travel-requests
GET    /api/travel-requests/[id]
PATCH  /api/travel-requests/[id]
```

**After (Backward Compatible):**
```
POST   /api/requests/create?type=TRAVEL
GET    /api/requests?type=TRAVEL
GET    /api/requests/[id]
PATCH  /api/requests/[id]

// Legacy endpoints (with deprecation warning)
POST   /api/travel-requests        → 301 to /api/requests?type=TRAVEL
GET    /api/travel-requests        → 301 to /api/requests?type=TRAVEL
```

### Service Layer Refactoring

**Before:**
```typescript
async function createTravelRequest(data: CreateTravelRequestDTO) {
  return prisma.travelRequest.create({
    data: {
      destination: data.destination,
      startDate: data.startDate,
      travelType: data.travelType,
      // ...
    }
  });
}
```

**After:**
```typescript
async function createRequest(
  type: 'TRAVEL' | 'PROCUREMENT' | 'HR',
  data: Record<string, any>,
  userId: string,
  tenantId: string
) {
  return prisma.request.create({
    data: {
      requestTypeId: type,
      requestNumber: generateRequestNumber(type),
      requesterId: userId,
      tenantId: tenantId,
      title: generateTitle(type, data),
      status: 'DRAFT',
      payload: data,
      tasks: {
        create: await generateInitialWorkflow(type, tenantId)
      }
    }
  });
}

// Type-safe factory
const requestFactory = {
  travel: (data: TravelRequestPayload, userId, tenantId) => 
    createRequest('TRAVEL', data, userId, tenantId),
  procurement: (data: ProcurementPayload, userId, tenantId) =>
    createRequest('PROCUREMENT', data, userId, tenantId),
};
```

---

## Phase 4: Component Renaming

### File Changes

```
components/requests/
├── request-form.tsx                 (from request-form.tsx, generic)
├── request-card.tsx                 (from request-card.tsx)
├── request-table.tsx                (from request-table.tsx)
├── request-detail.tsx               (from request-detail.tsx)
├── request-type-selector.tsx        (NEW - pick request type)
└── request-payload-renderer.tsx     (NEW - render based on type)

components/requests/travel/
├── travel-request-form.tsx          (travel-specific form)
├── travel-payload-display.tsx       (display travel fields)
└── travel-workflow.tsx              (travel workflow specific)
```

### Component Conversion

**Before:**
```tsx
interface TravelRequestFormProps {
  destination: string;
  travelType: string;
  startDate: Date;
}

export function TravelRequestForm(props: TravelRequestFormProps) { ... }
```

**After (Generic):**
```tsx
interface RequestFormProps {
  type: 'TRAVEL' | 'PROCUREMENT' | 'HR';
  schema: JsonSchema;  // Define form fields dynamically
  onSubmit: (payload: Record<string, any>) => void;
}

export function RequestForm(props: RequestFormProps) { ... }

// Type-specific wrapper
export function TravelRequestForm(props: TravelFormProps) {
  return (
    <RequestForm
      type="TRAVEL"
      schema={travelRequestSchema}
      onSubmit={props.onSubmit}
    />
  );
}
```

---

## Phase 5: API Route Consolidation

### Before
```
app/api/travel-requests/route.ts
app/api/travel-requests/[id]/route.ts
app/api/travel-requests/list/route.ts
```

### After (Generic)
```
app/api/requests/route.ts                    # POST create, GET list
app/api/requests/[id]/route.ts              # GET detail, PATCH update
app/api/requests/by-type/[type]/route.ts    # GET all of type
app/api/requests/[id]/workflow/route.ts     # GET workflow state
```

### Example: Generic Create Endpoint

```typescript
// app/api/requests/route.ts

export async function POST(req: Request) {
  const { type, data } = await req.json();
  
  // Validate request type
  const validTypes = ['TRAVEL', 'PROCUREMENT', 'HR'];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }
  
  // Type-specific validation
  const schema = requestSchemas[type];
  const validation = schema.safeParse(data);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors },
      { status: 400 }
    );
  }
  
  // Create generic request
  const request = await createRequest(
    type,
    validation.data,
    session.user.id,
    session.user.tenantId
  );
  
  return NextResponse.json(request, { status: 201 });
}
```

---

## Phase 6: Rollback Strategy

### Pre-Migration Checklist
- [ ] Backup production MongoDB database
- [ ] Create staging environment copy
- [ ] Test migration on staging (first)
- [ ] Prepare rollback migration script
- [ ] Brief team on communication plan

### Rollback Steps (if needed)
1. Stop application
2. Restore database from backup
3. Revert code to previous git tag
4. Restart application
5. Post-mortem analysis

### Monitoring During Migration
```
Metrics to track:
  - Request creation success rate
  - Workflow progression time
  - API latency (should be same or better)
  - Error rates by request type
  - Audit log completeness
```

---

## Phase 7: Timeline & Responsibility

| Phase | Task | Duration | Owner |
|-------|------|----------|-------|
| 1 | Schema design & review | 0.5 days | Architecture |
| 2 | Prisma migration generation | 0.5 days | Backend |
| 3 | Service layer refactor | 1.5 days | Backend |
| 4 | API endpoints & routes | 1 day | Backend |
| 5 | Component updates | 1.5 days | Frontend |
| 6 | Type updates & compilation | 0.5 days | Full stack |
| 7 | Testing (unit + integration) | 1.5 days | QA |
| 8 | Data migration script & testing | 1.5 days | Backend + DBA |
| 9 | Staging validation | 1 day | QA + Backend |
| 10 | Production deployment | 0.5 days | DevOps |

**Total: 9-10 days**

---

## Phase 8: Decision Matrix

| Question | Decision | Rationale |
|----------|----------|-----------|
| Use automated migration? | YES | Preserves data & audit trail |
| Keep legacy endpoints? | YES (deprecated) | Allows gradual client migration |
| Support multiple request types immediately? | NO (v1: TRAVEL only) | Reduce scope, add types incrementally |
| Version the API? | YES (/v1/requests) | Future-proof |
| Keep RequestStatus enum? | YES (simplified) | Core to workflow logic |

---

## Next Steps

**Approval Required:**
1. Schema design (review Prisma changes)
2. Data migration approach (automated vs manual)
3. Timeline (5-7 days vs phased approach)
4. Rollback plan acceptance

**If approved, initiate:**
1. Create feature branch: `refactor/generic-request-model`
2. Start Phase 1: Schema updates
3. Daily sync with team on blockers
4. Staging deployment by Day 7

---

**Questions for Team:**
- Should we support bulk migration of historical Travel requests?
- Do you want request type extensibility UI (add new types without code)?
- Should workflow definitions be tied to request types or generic?
- API versioning preference: v1/v2 or feature flags?

