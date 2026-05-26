# Enterprise BPM Platform - Complete System Architecture

## 🗺️ Complete Request-to-Completion Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ENTERPRISE BPM WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: REQUESTER CREATES REQUEST                                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Page: /travel-requests/new                                             │
│  Component: RequestForm                                                 │
│  Fields: Destination, dates, cost, purpose, department, etc.           │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ Fill Form → Click Submit                                   │        │
│  │ POST /api/travel-requests                                  │        │
│  │ {department, destination, startDate, endDate, ...}        │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                          │
│  Database Changes:                                                      │
│  ├─ TravelRequest created (status: SUBMITTED)                          │
│  ├─ WorkflowTask created (stepName: MANAGER_APPROVAL)                  │
│  ├─ AuditLog created (action: REQUEST_SUBMITTED)                       │
│  └─ Notification queued for managers                                   │
│                                                                          │
│  Result:                                                                │
│  ├─ Redirect to /travel-requests                                       │
│  ├─ Show success message                                               │
│  └─ Request now visible in list                                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

                                    ↓

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: MANAGER REVIEWS & APPROVES                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Page: /tasks → /tasks/[id]                                            │
│  Component: WorkflowTimeline + ApprovalDecisionPanel                   │
│  User: Manager (permission: REQUESTS_APPROVE_MANAGER)                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ View Task → Review Details → Click "Approve"              │        │
│  │ Optional comment: "Looks good, employee is authorized"     │        │
│  │ POST /api/approvals/decide                                 │        │
│  │ {taskId, decision: "APPROVED", comment}                   │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                          │
│  Database Changes:                                                      │
│  ├─ WorkflowTask updated (status: COMPLETED)                           │
│  ├─ TravelRequest updated (status: FINANCE_APPROVAL)                   │
│  ├─ New WorkflowTask created (stepName: FINANCE_APPROVAL)              │
│  ├─ AuditLog created (action: REQUEST_APPROVED, actor: manager)        │
│  └─ Notification queued for finance approver                           │
│                                                                          │
│  Result:                                                                │
│  ├─ Redirect to /tasks                                                 │
│  ├─ Task removed from list (completed)                                 │
│  ├─ Finance approver sees new task in their list                       │
│  └─ Requester gets notification (optional)                             │
│                                                                          │
│  ┌─ Alternative: Click "Reject"                              ┐        │
│  │ POST /api/approvals/decide                                 │        │
│  │ {taskId, decision: "REJECTED", comment: "reason"}          │        │
│  │                                                             │        │
│  │ Database:                                                   │        │
│  │ ├─ WorkflowTask status: REJECTED                            │        │
│  │ ├─ TravelRequest status: REJECTED (final)                   │        │
│  │ ├─ AuditLog: REQUEST_REJECTED                               │        │
│  │ └─ Notification: Requester can resubmit                     │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

                                    ↓
                         (if APPROVED, continues...)

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: FINANCE REVIEWS & APPROVES                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Page: /approvals → /tasks/[id]                                        │
│  Component: WorkflowTimeline + ApprovalDecisionPanel                   │
│  User: Finance Approver (permission: REQUESTS_APPROVE_FINANCE)         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ Select Request from /approvals                             │        │
│  │ Click "Open Task for Approval" → /tasks/[id]              │        │
│  │ Review cost center, budget allocation                      │        │
│  │ Click "Approve"                                            │        │
│  │ Optional comment: "Cost center has budget"                 │        │
│  │ POST /api/approvals/decide                                 │        │
│  │ {taskId, decision: "APPROVED"}                             │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                          │
│  Database Changes:                                                      │
│  ├─ WorkflowTask updated (status: COMPLETED)                           │
│  ├─ TravelRequest updated (status: APPROVED)                           │
│  ├─ Current step updated to COMPLETED                                  │
│  ├─ AuditLog created (action: REQUEST_APPROVED, actor: finance)        │
│  └─ Notification queued for requester (success!)                       │
│                                                                          │
│  Result:                                                                │
│  ├─ Redirect to /approvals                                             │
│  ├─ Request removed from pending approvals list                        │
│  ├─ Requester gets final approval notification                         │
│  └─ Request now visible as APPROVED                                    │
│                                                                          │
│  ┌─ Alternative: Click "Reject"                              ┐        │
│  │ POST /api/approvals/decide                                 │        │
│  │ {taskId, decision: "REJECTED"}                             │        │
│  │                                                             │        │
│  │ Database:                                                   │        │
│  │ ├─ WorkflowTask status: REJECTED                            │        │
│  │ ├─ TravelRequest status: REJECTED (final)                   │        │
│  │ ├─ AuditLog: REQUEST_REJECTED (finance stage)               │        │
│  │ └─ Notification: Requester rejection reason                 │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

                                    ↓

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 4: REQUESTER VIEWS COMPLETE WORKFLOW                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Page: /travel-requests/[id]                                           │
│  Component: RequestDetail + WorkflowTimeline + AuditTimeline           │
│  User: Any (owner, approvers, admins)                                  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │ Workflow Timeline:                                         │        │
│  │ ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │        │
│  │ │ SUBMITTED    │→ │ MANAGER      │→ │ FINANCE APPVD │   │        │
│  │ │ Completed    │  │ Completed    │  │ Completed     │   │        │
│  │ │ ✓            │  │ ✓ By: Manager│  │ ✓ By: Finance │   │        │
│  │ └──────────────┘  └──────────────┘  └────────────────┘   │        │
│  │                                                             │        │
│  │ Request Status: APPROVED (Green)                          │        │
│  │ Cost: R5,000                                              │        │
│  │ Destination: Cape Town                                    │        │
│  │ Dates: 2024-02-15 to 2024-02-18                          │        │
│  │                                                             │        │
│  │ Audit Log (reverse chronological):                        │        │
│  │ 1. Finance approved - "Cost center budget OK"             │        │
│  │ 2. Manager approved - "Employee cleared"                  │        │
│  │ 3. Request submitted - "TR-1234567"                       │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                          │
│  Display:                                                               │
│  ├─ Full request details card                                         │
│  ├─ Visual workflow timeline (all steps completed)                     │
│  ├─ Complete audit log with actor, decision, comment                  │
│  └─ Read-only (no further actions)                                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Impact

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRISMA SCHEMA                            │
└─────────────────────────────────────────────────────────────────┘

TravelRequest {
  id: UUID (primary key)
  requestNumber: "TR-1234567" (unique)
  status: SUBMITTED | MANAGER_APPROVAL | FINANCE_APPROVAL | APPROVED | REJECTED
  currentStep: "MANAGER_APPROVAL" | "FINANCE_APPROVAL" | null
  requesterId: UUID (FK User)
  tenantId: UUID (FK Tenant)
  destination: string
  startDate: Date
  endDate: Date
  estimatedCost: decimal
  purpose: text
  createdAt: timestamp
  updatedAt: timestamp
  
  relations:
  ├─ requester: User
  ├─ tenant: Tenant
  ├─ tasks: WorkflowTask[]
  └─ auditLogs: AuditLog[]
}

WorkflowTask {
  id: UUID
  stepName: "MANAGER_APPROVAL" | "FINANCE_APPROVAL"
  status: PENDING | COMPLETED | REJECTED
  requestId: UUID (FK TravelRequest)
  assigneeId: UUID (FK User)
  tenantId: UUID
  dueAt: Date (optional)
  completedAt: Date (optional)
  createdAt: timestamp
  
  relations:
  ├─ request: TravelRequest
  ├─ assignee: User
  ├─ tenant: Tenant
  └─ auditLogs: AuditLog[]
}

AuditLog {
  id: UUID
  tenantId: UUID
  actorUserId: UUID (FK User)
  travelRequestId: UUID (FK TravelRequest)
  workflowTaskId: UUID (FK WorkflowTask)
  action: REQUEST_SUBMITTED | REQUEST_APPROVED | REQUEST_REJECTED
  oldValue: JSON string (previous state)
  newValue: JSON string (new state)
  createdAt: timestamp
  
  relations:
  ├─ tenant: Tenant
  ├─ actorUser: User
  ├─ travelRequest: TravelRequest
  └─ workflowTask: WorkflowTask
}

User {
  id: UUID
  email: string
  tenantId: UUID
  firstName: string (optional)
  lastName: string (optional)
  roles: UserRole[]
  
  created requests
  assigned tasks
  created audit logs
}

Tenant {
  id: UUID
  name: string
  domain: string
  contains:
  ├─ users
  ├─ travelRequests
  ├─ workflowTasks
  └─ auditLogs
}
```

---

## 🔌 API Request/Response Examples

### Create Request
```typescript
POST /api/travel-requests

Request Body:
{
  "department": "Operations",
  "destination": "Cape Town",
  "travelType": "Client visit",
  "startDate": "2024-02-15",
  "endDate": "2024-02-18",
  "purpose": "Meet with client team for Q1 planning",
  "estimatedCost": 5000,
  "costCenter": "CC-1001"
}

Response (201):
{
  "travelRequest": {
    "id": "abc-123",
    "requestNumber": "TR-1707123456",
    "status": "SUBMITTED",
    "currentStep": "MANAGER_APPROVAL",
    "destination": "Cape Town",
    "estimatedCost": 5000,
    "tasks": [
      {
        "id": "task-1",
        "stepName": "MANAGER_APPROVAL",
        "status": "PENDING"
      }
    ]
  }
}
```

### Approve Request
```typescript
POST /api/approvals/decide

Request Body:
{
  "taskId": "task-1",
  "decision": "APPROVED",
  "comment": "Employee is authorized for this trip"
}

Response (200):
{
  "task": {
    "id": "task-1",
    "status": "COMPLETED",
    "completedAt": "2024-01-22T10:30:00Z"
  },
  "request": {
    "id": "abc-123",
    "status": "FINANCE_APPROVAL",
    "currentStep": "FINANCE_APPROVAL"
  }
}
```

### Get Request Detail
```typescript
GET /api/travel-requests/abc-123

Response (200):
{
  "travelRequest": {
    "id": "abc-123",
    "requestNumber": "TR-1707123456",
    "status": "APPROVED",
    "destination": "Cape Town",
    "requester": {
      "email": "john@company.com",
      "firstName": "John"
    },
    "tasks": [
      {
        "stepName": "MANAGER_APPROVAL",
        "status": "COMPLETED",
        "assignee": { "firstName": "Jane" },
        "completedAt": "2024-01-22T10:30:00Z"
      },
      {
        "stepName": "FINANCE_APPROVAL",
        "status": "COMPLETED",
        "assignee": { "firstName": "Bob" },
        "completedAt": "2024-01-22T14:15:00Z"
      }
    ],
    "auditLogs": [
      {
        "action": "REQUEST_SUBMITTED",
        "actorUser": { "email": "john@company.com" },
        "createdAt": "2024-01-22T08:00:00Z"
      },
      {
        "action": "REQUEST_APPROVED",
        "newValue": "{\"step\": \"MANAGER_APPROVAL\"}",
        "actorUser": { "email": "jane@company.com" },
        "createdAt": "2024-01-22T10:30:00Z"
      },
      {
        "action": "REQUEST_APPROVED",
        "newValue": "{\"step\": \"FINANCE_APPROVAL\"}",
        "actorUser": { "email": "bob@company.com" },
        "createdAt": "2024-01-22T14:15:00Z"
      }
    ]
  }
}
```

---

## 🎯 Permission Matrix

```
┌──────────────────────────────────────────────────────────────┐
│               ROLE → PERMISSION MAPPING                       │
├──────────────────────────────────────────────────────────────┤

REQUESTER:
  ✓ Create travel requests
  ✓ View own requests
  ✓ View own request details
  ✓ Receive approval notifications

MANAGER:
  ✓ All REQUESTER permissions
  ✓ Approve requests (MANAGER_APPROVAL step)
  ✓ Reject requests
  ✓ View approval queue
  ✓ Add approval comments

FINANCE APPROVER:
  ✓ All REQUESTER permissions
  ✓ Approve requests (FINANCE_APPROVAL step)
  ✓ Reject requests
  ✓ View finance approval queue
  ✓ Add approval comments

TENANT ADMIN:
  ✓ All REQUESTER permissions
  ✓ View all tenant requests (any requester)
  ✓ Invite users
  ✓ Manage user roles
  ✓ Configure tenant settings
  ✓ View tenant reports

SUPER ADMIN:
  ✓ All permissions
  ✓ Multi-tenant visibility
  ✓ System administration
```

---

## 📈 State Transition Diagram

```
                        TravelRequest Status Flow
                        
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│        ┌────────────────────────────────────────────┐          │
│        │   REQUESTER CREATES REQUEST               │          │
│        │   Status: SUBMITTED                        │          │
│        │   Task: MANAGER_APPROVAL (PENDING)        │          │
│        └────────────┬───────────────────────────────┘          │
│                     │                                           │
│                     ↓                                           │
│        ┌────────────────────────────────────────────┐          │
│        │   MANAGER REVIEWS                         │          │
│        │   Status: MANAGER_APPROVAL                │          │
│        │   Task: MANAGER_APPROVAL (PENDING)        │          │
│        └────┬──────────────────────┬───────────────┘          │
│             │ REJECT               │ APPROVE                   │
│             │                      │                           │
│             ↓                      ↓                           │
│      ┌─────────────┐    ┌────────────────────────────┐        │
│      │  REJECTED   │    │  FINANCE_APPROVAL          │        │
│      │  (FINAL)    │    │  Status: FINANCE_APPROVAL  │        │
│      │             │    │  Task: FINANCE_APPROVAL    │        │
│      └─────────────┘    │  (PENDING)                 │        │
│                         └────┬──────────────┬────────┘        │
│                              │ REJECT       │ APPROVE         │
│                              │              │                 │
│                              ↓              ↓                 │
│                         ┌─────────────┐  ┌──────────┐        │
│                         │  REJECTED   │  │ APPROVED │        │
│                         │  (FINAL)    │  │ (FINAL)  │        │
│                         └─────────────┘  └──────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

WorkflowTask Status Flow (for each approval step)

┌─────────────────────────────────────────┐
│   PENDING                               │
│   (Assigned to approver, waiting)       │
└────────┬─────────────────┬──────────────┘
         │ APPROVE         │ REJECT
         │                 │
         ↓                 ↓
┌──────────────────┐  ┌──────────────────┐
│  COMPLETED       │  │   REJECTED       │
│  (Approved)      │  │   (Rejected)     │
└──────────────────┘  └──────────────────┘
```

---

## ✅ Complete Feature Checklist

```
CORE FEATURES
  [x] Create travel request
  [x] Submit for approval
  [x] Manager approval step
  [x] Finance approval step
  [x] Rejection handling
  [x] Approval with comments
  [x] Request status tracking

USER MANAGEMENT
  [x] Invite users
  [x] Assign roles
  [x] View user list
  [x] User permissions
  [x] Role-based access

TASK MANAGEMENT
  [x] Task assignment
  [x] Task list for user
  [x] Task detail view
  [x] Mark task complete
  [x] SLA tracking

REPORTING & ANALYTICS
  [x] Request KPIs
  [x] Status summary
  [x] SLA metrics
  [x] Date range filtering
  [x] Performance metrics

AUDIT & COMPLIANCE
  [x] Complete audit trail
  [x] Action logging
  [x] Actor tracking
  [x] Timestamp on all actions
  [x] Change tracking (old/new values)

SECURITY & GOVERNANCE
  [x] Permission checks
  [x] Tenant isolation
  [x] Role-based access control
  [x] User authentication
  [x] Multi-tenancy support
```

---

**Your Enterprise BPM Platform has complete end-to-end workflow, multi-level approvals, and comprehensive audit trail. Ready for production!** 🚀

