# Backend Implementation Guide - Enterprise BPM Platform

**For:** Backend development team  
**Focus:** API routes, business logic, database operations  
**Status:** Ready to implement

---

## 🎯 Backend Responsibilities

Your backend team owns:

✅ API routes (`app/api/*`)
✅ Business logic (`modules/*`)
✅ Database operations (Prisma)
✅ Permission enforcement
✅ Workflow state machine
✅ Audit logging
✅ Data validation
✅ Tenant isolation
✅ Error handling

---

## 📡 API Routes to Implement

### 1. Travel Requests API

#### `POST /api/travel-requests` (EXISTING)
**Status:** Already exists, keep as-is

Create a new travel request
```typescript
// Request
{
  department: string
  destination: string
  travelType: string
  startDate: Date
  endDate: Date
  purpose: string
  estimatedCost: number
  costCenter: string
}

// Response
{
  id: string
  requestNumber: string
  status: "SUBMITTED"
  currentStep: "MANAGER_APPROVAL"
  tasks: [{ id, stepName, status }]
}
```

#### `GET /api/travel-requests/list` (TODO)
**Status:** Create new

List requests for current user
```typescript
// Query params
?status=SUBMITTED&department=Operations&dateFrom=2024-01-01

// Response
{
  requests: [
    {
      id: string
      requestNumber: string
      destination: string
      status: string
      estimatedCost: number
      createdAt: Date
      requester: { firstName, lastName, email }
    }
  ]
  total: number
  page: number
}
```

#### `GET /api/travel-requests/[id]` (TODO)
**Status:** Create new

Get single request detail
```typescript
// Response
{
  id: string
  requestNumber: string
  destination: string
  status: string
  requester: User
  tasks: [WorkflowTask]
  auditLogs: [AuditLog]
}
```

#### `PATCH /api/travel-requests/[id]` (TODO)
**Status:** Create new

Update request (only DRAFT)
```typescript
// Request
{
  department?: string
  destination?: string
  // ... other editable fields
}

// Response
{
  id: string
  updatedAt: Date
}
```

### 2. Tasks API

#### `GET /api/tasks/list` (TODO)
**Status:** Create new

List tasks assigned to current user
```typescript
// Query params
?status=PENDING&type=MANAGER_APPROVAL

// Response
{
  tasks: [
    {
      id: string
      stepName: string ("MANAGER_APPROVAL" | "FINANCE_APPROVAL")
      status: string
      dueAt: Date
      request: {
        id: string
        requestNumber: string
        destination: string
        estimatedCost: number
      }
    }
  ]
}
```

#### `GET /api/tasks/[id]` (TODO)
**Status:** Create new

Get task detail with full context
```typescript
// Response
{
  id: string
  stepName: string
  status: string
  dueAt: Date
  request: {
    id: string
    requestNumber: string
    destination: string
    purpose: string
    estimatedCost: number
    requester: User
    tasks: [WorkflowTask]
    auditLogs: [AuditLog]
  }
}
```

#### `PATCH /api/tasks/[id]` (TODO)
**Status:** Create new

Update task status
```typescript
// Request
{
  status: "COMPLETED" | "REJECTED"
  completedAt?: Date
}

// Response
{
  id: string
  status: string
}
```

### 3. Approvals API

#### `GET /api/approvals/list` (TODO)
**Status:** Create new

List pending approvals for current user
```typescript
// Query params
?type=MANAGER_APPROVAL

// Response
{
  approvalTasks: [
    {
      id: string
      stepName: string
      request: {
        id: string
        requestNumber: string
        destination: string
        estimatedCost: number
        purpose: string
      }
      dueAt: Date
    }
  ]
}
```

#### `POST /api/approvals/decide` (TODO)
**Status:** Create new

Approve or reject a request
```typescript
// Request
{
  taskId: string
  decision: "APPROVED" | "REJECTED"
  comment?: string
}

// Response
{
  task: { id, status }
  request: { id, status, currentStep }
  message: "Request approved" | "Request rejected"
}
```

### 4. Users API

#### `GET /api/users` (TODO)
**Status:** Create new

List tenant users
```typescript
// Response
{
  users: [
    {
      id: string
      email: string
      firstName?: string
      lastName?: string
      roles: [string]
      department?: string
      status: "Active" | "Inactive" | "Invited"
      lastLogin?: Date
    }
  ]
}
```

#### `POST /api/users/invite` (TODO)
**Status:** Create new

Invite new user
```typescript
// Request
{
  email: string
  roles: [string]
}

// Response
{
  user: { id, email }
  message: "Invite sent to user@example.com"
}
```

#### `PUT /api/users/preferences` (TODO)
**Status:** Create new

Save user preferences
```typescript
// Request
{
  theme: "light" | "dark" | "system"
  timezone: string
  language: string
  emailNotifications: boolean
}

// Response
{
  message: "Preferences saved"
}
```

### 5. Tenant API

#### `PUT /api/tenant/settings` (TODO)
**Status:** Create new

Update tenant settings
```typescript
// Request
{
  tenantName: string
  timezone?: string
  currency?: string
  slaDefaultHours?: number
}

// Response
{
  tenant: { id, name }
  message: "Settings updated"
}
```

### 6. Reports API

#### `GET /api/reports/summary` (TODO)
**Status:** Create new

Get operational metrics
```typescript
// Query params
?range=30days

// Response
{
  stats: {
    totalRequests: number
    pendingApprovals: number
    approvedThisMonth: number
    rejectedThisMonth: number
    overdueCount: number
    draft: number
    submitted: number
    approved: number
    rejected: number
    completed: number
    onTimeCount: number
    atRiskCount: number
    averageCompletionTime: string
    slaBreachRate: string
  }
}
```

---

## 🏗️ Module Structure (Business Logic)

Each module encapsulates business operations. Backend team creates these.

```
modules/
├── requests/
│   ├── actions.ts           ← Public API for request operations
│   ├── services.ts          ← Business logic
│   ├── validators.ts        ← Zod schemas
│   ├── workflows.ts         ← Workflow state transitions
│   └── index.ts             ← Exports
│
├── tasks/
│   ├── actions.ts
│   ├── services.ts
│   └── index.ts
│
├── approvals/
│   ├── actions.ts
│   ├── services.ts
│   ├── workflows.ts
│   └── index.ts
│
├── users/
│   ├── actions.ts
│   └── index.ts
│
└── reports/
    ├── actions.ts
    ├── analytics.ts
    └── index.ts
```

### Example: `modules/requests/actions.ts`

```typescript
// Public API for request operations

import { prisma } from '@/lib/prisma';
import { getTenantFromContext } from '@/lib/tenant';
import { validateRequestCreation } from './validators';
import { createWorkflowInstance } from './workflows';
import { logAuditEvent } from '@/lib/audit';

// Frontend calls this by submitting to POST /api/travel-requests
export async function createTravelRequest(
  data: {
    department: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    purpose: string;
    estimatedCost: number;
    costCenter: string;
  },
  context: { userId: string; tenantId: string }
) {
  // Validate input
  const validation = validateRequestCreation(data);
  if (!validation.success) {
    throw new Error(validation.error);
  }

  // Create request record
  const request = await prisma.travelRequest.create({
    data: {
      ...data,
      requestNumber: generateRequestNumber(),
      requesterId: context.userId,
      tenantId: context.tenantId,
      status: 'SUBMITTED',
      currentStep: 'MANAGER_APPROVAL',
    },
  });

  // Create workflow instance
  await createWorkflowInstance(request.id, context.tenantId);

  // Log audit event
  await logAuditEvent({
    tenantId: context.tenantId,
    actorUserId: context.userId,
    entityType: 'TravelRequest',
    action: 'REQUEST_SUBMITTED',
    newValue: { requestNumber: request.requestNumber },
  });

  return request;
}

// List requests for user
export async function getTravelRequests(context: {
  userId: string;
  tenantId: string;
  role: string;
}) {
  // Different users see different requests
  if (context.role === 'TENANT_ADMIN') {
    // Admin sees all
    return prisma.travelRequest.findMany({
      where: { tenantId: context.tenantId },
      include: { requester: true, tasks: true },
    });
  } else {
    // Regular users see own + requests they're approving
    return prisma.travelRequest.findMany({
      where: {
        tenantId: context.tenantId,
        OR: [
          { requesterId: context.userId },
          { tasks: { some: { assigneeId: context.userId } } },
        ],
      },
      include: { requester: true, tasks: true },
    });
  }
}
```

---

## 🔄 Workflow Implementation

Create workflow state machine in `modules/approvals/workflows.ts`:

```typescript
// Workflow state transitions

export async function approveRequest(
  taskId: string,
  context: { userId: string; tenantId: string }
) {
  // Get current task
  const task = await prisma.workflowTask.findUnique({
    where: { id: taskId },
    include: { request: true },
  });

  if (!task) throw new Error('Task not found');

  // Update task
  await prisma.workflowTask.update({
    where: { id: taskId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      assigneeId: context.userId,
    },
  });

  // Determine next step
  let nextStatus: string;
  let nextStep: string | null;

  if (task.stepName === 'MANAGER_APPROVAL') {
    nextStatus = 'FINANCE_APPROVAL';
    nextStep = 'FINANCE_APPROVAL';

    // Create finance approval task
    await prisma.workflowTask.create({
      data: {
        tenantId: context.tenantId,
        requestId: task.requestId,
        stepName: 'FINANCE_APPROVAL',
        status: 'PENDING',
      },
    });
  } else if (task.stepName === 'FINANCE_APPROVAL') {
    nextStatus = 'APPROVED';
    nextStep = null; // Workflow complete
  } else {
    throw new Error('Unknown workflow step');
  }

  // Update request
  const updatedRequest = await prisma.travelRequest.update({
    where: { id: task.requestId },
    data: {
      status: nextStatus,
      currentStep: nextStep,
    },
  });

  // Log audit event
  await logAuditEvent({
    tenantId: context.tenantId,
    actorUserId: context.userId,
    travelRequestId: task.requestId,
    workflowTaskId: taskId,
    action: 'REQUEST_APPROVED',
    oldValue: task.stepName,
    newValue: nextStep,
  });

  return updatedRequest;
}

export async function rejectRequest(
  taskId: string,
  comment: string,
  context: { userId: string; tenantId: string }
) {
  // Similar pattern - update task and request
  // Set status to REJECTED (final)
  // Log action
  // Don't create next task (workflow ends)
}
```

---

## ✅ API Implementation Pattern

Each API route follows this pattern. Backend team creates all of these:

```typescript
// app/api/[endpoint]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PERMISSIONS } from '@/config/permissions';
import { actionFunction } from '@/modules/[domain]';

export async function GET(request: Request) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Authorize (check permission)
    if (!session.user.permissions.includes(PERMISSIONS.XXXXX)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // 3. Get request data
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    // 4. Call business logic (in modules/)
    const result = await actionFunction({
      userId: session.user.id,
      tenantId: session.user.tenantId,
      filter,
    });

    // 5. Return response
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Similar pattern
    // 1. Auth
    // 2. Authorize
    // 3. Parse body
    // 4. Validate with Zod
    // 5. Call business logic
    // 6. Return response
  } catch (error) {
    // Error handling
  }
}
```

---

## 📋 Implementation Checklist

### Phase 1: Core APIs

- [ ] `POST /api/travel-requests` (verify existing)
- [ ] `GET /api/travel-requests/list`
- [ ] `GET /api/travel-requests/[id]`
- [ ] `PATCH /api/travel-requests/[id]`
- [ ] `GET /api/tasks/list`
- [ ] `GET /api/tasks/[id]`
- [ ] `PATCH /api/tasks/[id]`
- [ ] `GET /api/approvals/list`
- [ ] `POST /api/approvals/decide`

### Phase 1: Admin APIs

- [ ] `GET /api/users`
- [ ] `POST /api/users/invite`
- [ ] `PUT /api/users/preferences`
- [ ] `PUT /api/tenant/settings`

### Phase 1: Reports API

- [ ] `GET /api/reports/summary`

### Business Logic Modules

- [ ] `modules/requests/actions.ts` (create, list, get, edit)
- [ ] `modules/requests/validators.ts` (Zod schemas)
- [ ] `modules/requests/workflows.ts` (state machine)
- [ ] `modules/tasks/actions.ts`
- [ ] `modules/approvals/actions.ts`
- [ ] `modules/approvals/workflows.ts`
- [ ] `modules/users/actions.ts`
- [ ] `modules/reports/actions.ts`

### Security & Validation

- [ ] All endpoints validate authentication
- [ ] All endpoints validate permissions
- [ ] All endpoints validate input with Zod
- [ ] All operations log audit events
- [ ] All queries filter by tenantId
- [ ] All errors return clear messages

---

## 🧪 Testing Guide

### Unit Tests (Business Logic)

```typescript
// __tests__/modules/requests/workflows.test.ts

describe('Workflow: Approve Request', () => {
  it('should transition from MANAGER_APPROVAL to FINANCE_APPROVAL', async () => {
    // Setup
    const request = await createTestRequest();
    const task = await createTestTask(request.id, 'MANAGER_APPROVAL');

    // Execute
    const updated = await approveRequest(task.id, {
      userId: managerId,
      tenantId: tenantId,
    });

    // Assert
    expect(updated.status).toBe('FINANCE_APPROVAL');
    expect(updated.currentStep).toBe('FINANCE_APPROVAL');

    // Verify new task created
    const financeTask = await getWorkflowTask(request.id, 'FINANCE_APPROVAL');
    expect(financeTask).toBeDefined();
  });

  it('should create audit log when approving', async () => {
    // ... similar structure
  });
});
```

### Integration Tests (API Routes)

```typescript
// __tests__/api/approvals/decide.test.ts

describe('POST /api/approvals/decide', () => {
  it('should approve request with valid input', async () => {
    const response = await fetch('/api/approvals/decide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: validTaskId,
        decision: 'APPROVED',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.request.status).toBe('FINANCE_APPROVAL');
  });

  it('should reject if user lacks permission', async () => {
    const response = await fetch('/api/approvals/decide', {
      method: 'POST',
      body: JSON.stringify({ taskId, decision: 'APPROVED' }),
    });

    expect(response.status).toBe(403);
  });
});
```

---

## 🚀 Deployment Checklist

Before deployment, backend team verifies:

- [ ] All APIs tested locally
- [ ] All permission checks working
- [ ] All audit logs creating
- [ ] All database migrations run
- [ ] All error messages clear
- [ ] All responses JSON formatted
- [ ] No console errors/warnings
- [ ] Database backups configured
- [ ] Rate limiting configured
- [ ] CORS configured correctly

---

## 📞 Communication with Frontend

### When backend is blocked

**Tell frontend:** "I need the exact UI state you want to handle"

**Example:** "When approval succeeds, do you want to redirect automatically or show a success message?"

### When backend is done

**Tell frontend:** "API is ready at [endpoint] with [auth requirements]"

**Example:**
```
GET /api/approvals/list
Permission: REQUESTS_APPROVE_MANAGER
Query params: ?type=MANAGER_APPROVAL&status=PENDING
Response: { approvalTasks: [...] }
```

### Error Handling Contract

**Backend sends:**
```json
{
  "error": "User does not have REQUESTS_APPROVE_MANAGER permission",
  "status": 403
}
```

**Frontend shows:**
"You don't have permission to approve requests."

---

## 🎓 Best Practices

1. **Always validate server-side** - Never trust frontend
2. **Always create audit logs** - Track everything
3. **Always filter by tenantId** - Enforce isolation
4. **Always catch errors** - Return clear messages
5. **Always use transaction** - For multi-step operations
6. **Always use Zod** - Schema validation
7. **Always test** - Unit + integration
8. **Always document** - Tell frontend what you built

---

**Backend team: You own the logic, security, and data. Frontend team trusts you to get it right.** ✅

