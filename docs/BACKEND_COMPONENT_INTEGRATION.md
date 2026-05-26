# Backend-to-Components Integration Guide

For the **Enterprise BPM Platform backend**, here's how to use components correctly.

---

## 🏗️ Your Current Backend Structure

```
modules/
├── requests/         ← Travel request business logic
├── approvals/        ← Approval workflows
├── tasks/            ← Task management
├── audit-logs/       ← Event logging
├── notifications/    ← Alerts and messages
├── reports/          ← Business intelligence
├── workflow-engine/  ← Core BPM engine
├── users/            ← User management
├── roles/            ← Role-based access
└── tenants/          ← Multi-tenancy
```

---

## 📋 Integration Pattern

### 1. Request Creation Flow

**Page** → **Module** → **Component**

```typescript
// app/travel-requests/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout";
import { RequestForm, RequestFormValues } from "@/components/requests";
import { createTravelRequest } from "@/modules/requests/actions";

export default function NewRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();

  async function handleSubmit(values: RequestFormValues) {
    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      // Module handles business logic
      const request = await createTravelRequest({
        ...values,
        estimatedCost: parseFloat(values.estimatedCost),
      });

      // Success → redirect
      router.push(`/travel-requests/${request.id}`);
    } catch (error) {
      // Component handles errors
      setSubmitError(error instanceof Error ? error.message : "Failed to create request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader title="Create Travel Request" />
      <RequestForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        // Field errors would come from validation
        errors={submitError ? { general: submitError } : {}}
      />
    </PageContainer>
  );
}
```

---

### 2. Request List with Filtering

**Page** → **Module** → **Component**

```typescript
// app/travel-requests/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PageContainer, PageHeader } from "@/components/layout";
import { RequestTable, RequestTableRow } from "@/components/requests";
import { getTravelRequests } from "@/modules/requests/actions";

export default function RequestsPage() {
  const [rows, setRows] = useState<RequestTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const load = async () => {
      try {
        // Module fetches with business rules
        const requests = await getTravelRequests();

        // Map to component format
        setRows(requests.map(r => ({
          id: r.id,
          requestNumber: r.requestNumber,
          requester: r.requester.firstName + " " + r.requester.lastName,
          department: r.department,
          destination: r.destination,
          status: r.status as BpmStatus,
          currentStep: r.currentStep,
          estimatedCost: "$" + r.estimatedCost.toFixed(2),
          createdDate: new Date(r.createdAt).toLocaleDateString(),
        })));
      } catch (err) {
        setError("Failed to load requests");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageContainer>
      <PageHeader title="Travel Requests" />
      <RequestTable
        rows={rows}
        isLoading={isLoading}
        error={error}
        rowActions={(row) => (
          <a href={`/travel-requests/${row.id}`}>View</a>
        )}
      />
    </PageContainer>
  );
}
```

---

### 3. Approval Workflow Integration

**Page** → **Module** → **Component**

```typescript
// app/approvals/[requestId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PageContainer, PageHeader } from "@/components/layout";
import { WorkflowTimeline, WorkflowStepProps } from "@/components/workflow";
import { ApprovalDecisionPanel } from "@/components/approvals";
import { getTravelRequest } from "@/modules/requests/actions";
import { approveRequest, rejectRequest } from "@/modules/approvals/actions";

export default function ApprovalPage({ params }: { params: { requestId: string } }) {
  const [request, setRequest] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeciding, setIsDeciding] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTravelRequest(params.requestId);
        setRequest(data);
      } catch (err) {
        setError("Failed to load request");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params.requestId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!request) return <div>Request not found</div>;

  // Map workflow tasks to component format
  const workflowSteps: WorkflowStepProps[] = request.tasks.map(task => ({
    title: task.stepName,
    status: task.status,
    actorName: task.assignee?.firstName || "Unassigned",
    timestamp: task.completedAt ? new Date(task.completedAt).toLocaleString() : undefined,
  }));

  async function handleApprove(comment?: string) {
    setIsDeciding(true);
    try {
      await approveRequest(request.id, { comment });
      setRequest({ ...request, status: "APPROVED" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setIsDeciding(false);
    }
  }

  async function handleReject(comment: string) {
    setIsDeciding(true);
    try {
      await rejectRequest(request.id, { comment });
      setRequest({ ...request, status: "REJECTED" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setIsDeciding(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader title={`Approve ${request.requestNumber}`} />
      
      <WorkflowTimeline steps={workflowSteps} />

      <ApprovalDecisionPanel
        summary={`${request.requestNumber}: ${request.purpose}`}
        slaWarning={request.slaStatus === "overdue" ? "This approval is overdue" : undefined}
        disabled={isDeciding}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </PageContainer>
  );
}
```

---

### 4. Dashboard Integration

**Page** → **Module** → **Component**

```typescript
// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout";
import { KpiCard } from "@/components/dashboard";
import { StatusSummaryCard } from "@/components/dashboard";
import { PendingTasksCard } from "@/components/dashboard";
import { getRequestStats, getPendingTasks } from "@/modules/requests/actions";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Module aggregates data across BPM
        const data = await getRequestStats();
        const pendingTasks = await getPendingTasks();

        setStats(data);
        setTasks(pendingTasks);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageContainer>
      <div className="dashboard-grid">
        {/* KPI Cards */}
        <KpiCard
          title="Total Requests"
          value={stats?.totalRequests || 0}
          icon="📋"
          isLoading={isLoading}
        />
        <KpiCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          icon="⏳"
          isLoading={isLoading}
        />
        <KpiCard
          title="Completed This Month"
          value={stats?.completedThisMonth || 0}
          icon="✅"
          isLoading={isLoading}
        />

        {/* Status Summary */}
        <StatusSummaryCard
          items={[
            { status: "Draft", count: stats?.draft || 0 },
            { status: "Pending", count: stats?.pending || 0 },
            { status: "Approved", count: stats?.approved || 0 },
            { status: "Rejected", count: stats?.rejected || 0 },
          ]}
          isLoading={isLoading}
        />

        {/* Pending Tasks */}
        <PendingTasksCard
          tasks={tasks.map(t => ({
            id: t.id,
            title: t.stepName,
            requestNumber: t.request.requestNumber,
            dueDate: new Date(t.dueAt).toLocaleDateString(),
            slaStatus: t.dueAt > new Date() ? "on-time" : "overdue",
          }))}
          isLoading={isLoading}
        />
      </div>
    </PageContainer>
  );
}
```

---

## 🔑 Module-to-Component Data Mapping

### Travel Requests Module

```typescript
// modules/requests/types.ts
export interface TravelRequest {
  id: string;
  requestNumber: string;
  requesterId: string;
  requester: User;
  department: string;
  destination: string;
  travelType: string;
  startDate: Date;
  endDate: Date;
  purpose: string;
  estimatedCost: number;
  costCenter: string;
  status: RequestStatus;
  currentStep?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ↓ Map to component props
// components/requests/request-card.tsx
export interface RequestCardProps {
  requestNumber: string;
  purpose: string;
  status: BpmStatus;
  requester: string;
  destination: string;
  dateRange: string;
  estimatedCost: string;
  currentStep?: string;
}
```

---

## 📊 Backend Service Integration

### Pattern: Module → Component Props

```typescript
// modules/approvals/types.ts
export interface ApprovalTask {
  id: string;
  requestId: string;
  assigneeId: string;
  assignee?: User;
  stepName: string;
  status: TaskStatus;
  dueAt?: Date;
  completedAt?: Date;
}

// ↓ Component receives formatted data
// components/workflow/workflow-step.tsx
export interface WorkflowStepProps {
  title: string;
  status: "completed" | "current" | "pending" | "rejected" | "cancelled" | "overdue";
  actorName?: string;
  timestamp?: string;
  description?: string;
}

// ↓ Page does the mapping
const steps: WorkflowStepProps[] = tasks.map(t => ({
  title: t.stepName,
  status: t.status,
  actorName: t.assignee?.firstName,
  timestamp: t.completedAt?.toISOString(),
}));
```

---

## 🔒 Tenant Isolation in Components

Your components are tenant-neutral (good!), but isolation happens at module level:

```typescript
// ✅ Module ensures tenant isolation
export async function getTravelRequests() {
  const session = await auth();
  const userTenant = await getUserTenant(session.user.id);

  // Only fetch requests for this tenant
  return prisma.travelRequest.findMany({
    where: { tenantId: userTenant.id },
  });
}

// ✅ Component receives pre-filtered data
export default function RequestsPage() {
  const requests = await getTravelRequests(); // Already tenant-filtered
  return <RequestTable rows={requests} />;
}
```

---

## 🚀 Approval Workflow Steps

```typescript
// modules/workflow-engine/engine.ts
export async function executeWorkflow(requestId: string) {
  const request = await getTravelRequest(requestId);

  // 1. Submit step
  await assignTask("MANAGER_APPROVAL", request.requesterId);
  request.status = "MANAGER_APPROVAL";

  // 2. Manager approves → auto-assign finance
  const managerTask = await getApprovalTask(request.id, "MANAGER_APPROVAL");
  if (managerTask.status === "COMPLETED") {
    await assignTask("FINANCE_APPROVAL", request.requesterId);
    request.status = "FINANCE_APPROVAL";
  }

  // 3. Finance approves → complete
  const financeTask = await getApprovalTask(request.id, "FINANCE_APPROVAL");
  if (financeTask.status === "COMPLETED") {
    request.status = "APPROVED";
    request.completedAt = new Date();
  }

  return request;
}

// ↓ Component displays this workflow
<WorkflowTimeline
  steps={[
    { title: "Submit", status: "completed", ... },
    { title: "Manager Approval", status: "current", ... },
    { title: "Finance Approval", status: "pending", ... },
  ]}
/>
```

---

## ✅ Integration Checklist

Before using components in your pages:

- [ ] Module returns strongly-typed data
- [ ] Page maps module data to component props
- [ ] Component receives everything it needs via props
- [ ] No database calls in component
- [ ] Error handling at module/page level
- [ ] Loading state managed at page level
- [ ] Tenant isolation at module level
- [ ] Permission checks at module level
- [ ] Component is stateless (props-driven)
- [ ] Tests mock component props, not database

---

## 🎯 Example: Complete Approval Flow

```typescript
// Step 1: Module fetches request (with tenant isolation)
const request = await getTravelRequest(id); // Returns TravelRequest

// Step 2: Page maps to component data
const summary = `${request.requestNumber}: ${request.purpose}`;
const slaWarning = request.dueAt < new Date() ? "Overdue" : undefined;
const steps = request.tasks.map(t => ({
  title: t.stepName,
  status: t.status,
  actorName: t.assignee?.firstName,
}));

// Step 3: Component renders with state
<WorkflowTimeline steps={steps} />
<ApprovalDecisionPanel
  summary={summary}
  slaWarning={slaWarning}
  onApprove={(comment) => module.approveRequest(id, comment)}
  onReject={(comment) => module.rejectRequest(id, comment)}
/>
```

---

**Your backend and components are now perfectly integrated!** ✅

