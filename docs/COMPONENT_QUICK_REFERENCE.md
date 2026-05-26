# Component Architecture Quick Reference

## 📦 Component Organization

### UI Layer (`/ui`)
Low-level reusable primitives. No business logic.

```typescript
import { Button, Input, Select, Textarea, Badge, Card, Modal, Tabs, Table } from "@/components/ui";
```

**Rule:** UI components must be framework-agnostic and reusable across pages.

---

### Layout Layer (`/layout`)
Application frame and navigation.

```typescript
import { AppShell, Sidebar, Topbar, PageHeader, PageContainer, Breadcrumbs } from "@/components/layout";
```

**Rule:** Layout components wrap pages and provide navigation context.

---

### Dashboard Layer (`/dashboard`)
Operational summary components.

```typescript
import { KpiCard, StatusSummaryCard, PendingTasksCard, SlaOverviewCard } from "@/components/dashboard";
```

**Rule:** Dashboard components are read-only, display-focused, and fast.

---

### Workflow Layer (`/workflow`)
Process state, decisions, and auditability.

```typescript
import { WorkflowTimeline, WorkflowStep, ApprovalPanel, AuditTimeline, StatusBadge } from "@/components/workflow";
```

**Rule:** Workflow components are the credibility layer. They must show truth.

---

### Requests Layer (`/requests`)
Request lifecycle components.

```typescript
import { RequestForm, RequestCard, RequestTable, RequestDetail } from "@/components/requests";
```

**Rule:** Request components must support create, read, list, and detail operations.

---

### Approvals Layer (`/approvals`)
Approval decision components.

```typescript
import { ApprovalDecisionPanel, ApprovalHistory, ApprovalActions } from "@/components/approvals";
```

**Rule:** Rejection must require comment. Approval actions must be explicit.

---

### Admin Layer (`/admin`)
Tenant and platform configuration.

```typescript
import { UserTable, RoleBadge, PermissionMatrix, TenantSettingsForm } from "@/components/admin";
```

**Rule:** Admin components must be secure and tenant-isolated.

---

## 🎯 Component Design Rules

### 1. Always Use Props
```typescript
// ❌ Wrong - hardcoded data
function RequestCard() {
  const request = /* database call */;
  return <div>{request.title}</div>;
}

// ✅ Right - data via props
function RequestCard({ request }: RequestCardProps) {
  return <div>{request.title}</div>;
}
```

### 2. Support All States
```typescript
// ✅ Component supports all states
<RequestCard
  isLoading={loading}
  error={error}
  requestNumber="TRV-001"
  purpose="Client visit"
  status="APPROVED"
/>
```

### 3. No Database Calls
```typescript
// ❌ Wrong - database in component
function RequestList() {
  const requests = await prisma.travelRequest.findMany();
  return requests.map(r => <RequestCard {...r} />);
}

// ✅ Right - data passed from page
function RequestList({ requests }: RequestListProps) {
  return requests.map(r => <RequestCard {...r} />);
}
```

### 4. Consistent Naming
```typescript
// ✅ Filename: kebab-case
// approval-decision-panel.tsx

// ✅ Component: PascalCase
export function ApprovalDecisionPanel() {}

// ✅ Props: {ComponentName}Props
export interface ApprovalDecisionPanelProps {}

// ✅ Import: Destructured
import { ApprovalDecisionPanel } from "@/components/approvals";
```

### 5. Proper Exports
```typescript
// ✅ Each folder has index.ts
// components/workflow/index.ts
export * from "./workflow-timeline";
export * from "./workflow-step";
export * from "./approval-panel";
export * from "./audit-timeline";
export * from "./status-badge";

// Usage: Clean imports
import { WorkflowTimeline, StatusBadge } from "@/components/workflow";
```

---

## 📊 State Props Pattern

Every complex component should support these:

```typescript
export interface ComponentProps {
  // Domain-specific props
  data: SomeType;
  onAction?: (value: string) => void;

  // State management
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export function Component({ data, onAction, isLoading, error, emptyMessage }: ComponentProps) {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data?.length) return <div>{emptyMessage}</div>;

  return <div>Content</div>;
}
```

---

## 🔄 Data Flow

### Correct Direction: Page → Module → Component

```typescript
// app/travel-requests/page.tsx
export default async function RequestsPage() {
  // 1. Page fetches data via module
  const requests = await getTravelRequests();
  const loading = isPending();
  const error = getError();

  // 2. Page passes data to component via props
  return <RequestTable requests={requests} isLoading={loading} error={error} />;
}

// components/requests/request-table.tsx
// 3. Component is data-agnostic, receives everything
function RequestTable({ requests, isLoading, error }: RequestTableProps) {
  return <Table data={requests} isLoading={isLoading} error={error} />;
}
```

### Wrong Direction: Component → Database

```typescript
// ❌ WRONG - Don't do this
function RequestTable() {
  const requests = await prisma.travelRequest.findMany();
  return <Table data={requests} />;
}

// ❌ WRONG - Don't do this either
import { db } from "@/lib/db";
function RequestTable() {
  const requests = db.query("SELECT ...");
  return <Table data={requests} />;
}
```

---

## 💾 Component Dependency Rules

### ✅ Allowed
- `ui` → `ui` (button can use icons)
- `layout` → `ui` (sidebar uses buttons)
- `dashboard` → `ui` (cards use badges)
- `workflow` → `ui` + `ui/badge` for wrapping
- `requests` → `workflow` + `ui` (forms compose workflow)
- `approvals` → `workflow` + `ui`
- `admin` → `ui`

### ❌ Not Allowed
- `ui` → anything else (primitives stay pure)
- any component → `Prisma` (no database)
- any component → `server-only` services directly
- any component → tenant isolation logic

---

## 🧪 Component Testing Pattern

```typescript
import { render, screen } from "@testing-library/react";
import { RequestCard } from "@/components/requests";

describe("RequestCard", () => {
  it("renders loading state", () => {
    render(<RequestCard isLoading requestNumber="" status="DRAFT" {...props} />);
    expect(screen.getByText("Loading request...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(<RequestCard error="Failed to load" requestNumber="" status="DRAFT" {...props} />);
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("renders content", () => {
    render(<RequestCard requestNumber="TRV-001" status="APPROVED" {...props} />);
    expect(screen.getByText("TRV-001")).toBeInTheDocument();
  });
});
```

---

## 📝 Common Props Interfaces

### Cards
```typescript
interface CardProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string;
  compact?: boolean;
  children: React.ReactNode;
}
```

### Forms
```typescript
interface FormProps {
  defaultValues?: Record<string, any>;
  errors?: Record<string, string>;
  isSubmitting?: boolean;
  disabled?: boolean;
  onSubmit: (values: Record<string, any>) => void;
}
```

### Lists
```typescript
interface ListProps<T> {
  items: T[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  onItemClick?: (item: T) => void;
}
```

### Tables
```typescript
interface TableProps<T> {
  data: T[];
  isLoading?: boolean;
  error?: string;
  columns: Column<T>[];
  rowActions?: (row: T) => ReactNode;
}
```

---

## 🎨 Status Badge Mapping

BPM statuses automatically map to visual variants:

```typescript
import { StatusBadge } from "@/components/workflow";

// Automatically renders with correct color
<StatusBadge status="DRAFT" />           // Neutral
<StatusBadge status="SUBMITTED" />       // Info
<StatusBadge status="PENDING_MANAGER_APPROVAL" /> // Warning
<StatusBadge status="APPROVED" />        // Success
<StatusBadge status="REJECTED" />        // Danger
<StatusBadge status="OVERDUE" />         // Danger
```

---

## 🚀 Using Components in Pages

```typescript
// app/travel-requests/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PageContainer, PageHeader } from "@/components/layout";
import { RequestTable } from "@/components/requests";
import { getRequests } from "@/modules/requests";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRequests();
        setRequests(data);
      } catch (err) {
        setError("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Travel Requests"
        description="Manage all travel requests"
      />
      <RequestTable
        rows={requests}
        isLoading={loading}
        error={error}
      />
    </PageContainer>
  );
}
```

---

## ❌ Anti-Patterns

### Don't hardcode data
```typescript
// ❌ Wrong
<RequestTable rows={[{ id: "1", title: "Trip to NYC" }]} />

// ✅ Right
const requests = await fetchRequests();
<RequestTable rows={requests} />
```

### Don't hide state
```typescript
// ❌ Wrong
{rows ? <Table data={rows} /> : <div>Loading...</div>}

// ✅ Right
<Table data={rows} isLoading={loading} error={error} />
```

### Don't mix concerns
```typescript
// ❌ Wrong - component handles form + API + routing
function RequestForm() {
  const handleSubmit = async (values) => {
    const res = await fetch("/api/requests", { method: "POST", body: JSON.stringify(values) });
    router.push("/requests/" + res.id);
  };
  return <form onSubmit={handleSubmit}>...</form>;
}

// ✅ Right - component only handles UI
function RequestForm({ onSubmit, errors }: RequestFormProps) {
  const handleSubmit = (values) => onSubmit(values);
  return <form onSubmit={handleSubmit}>...</form>;
}

// Page/module handles API + routing
export default function NewRequestPage() {
  const handleSubmit = async (values) => {
    const req = await createRequest(values);
    router.push(`/requests/${req.id}`);
  };
  return <RequestForm onSubmit={handleSubmit} />;
}
```

---

## ✅ Checklist Before Committing

- [ ] Component uses TypeScript interfaces for props
- [ ] Component exported via barrel import (`index.ts`)
- [ ] Component supports loading state (where complex)
- [ ] Component supports error state (where complex)
- [ ] Component supports empty state (where applicable)
- [ ] No database calls in component
- [ ] No Prisma imports in component
- [ ] No hardcoded data in component
- [ ] Proper accessibility (labels, ARIA)
- [ ] Proper naming (kebab-case file, PascalCase component)
- [ ] No direct routing in component
- [ ] Tests written or skipped with reason

---

**Your components are now production-ready!** 🚀

