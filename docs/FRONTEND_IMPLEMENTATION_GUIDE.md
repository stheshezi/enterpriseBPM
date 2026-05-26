# Frontend Implementation Guide - Enterprise BPM Platform

**For:** Frontend development team  
**Focus:** Pages, forms, components, user interactions  
**Status:** Ready to implement

---

## 🎯 Frontend Responsibilities

Your frontend team owns:

✅ Page routes (`app/(dashboard)/*`)
✅ Form rendering and handling
✅ Component composition
✅ User interactions
✅ Navigation
✅ UI state management
✅ Error/loading states
✅ Responsive design
✅ Accessibility

**Don't own:**
❌ Permission enforcement (backend does)
❌ Business logic (backend does)
❌ Database operations (backend does)
❌ Workflow state machine (backend does)

---

## 📍 Page Routes to Implement

### Dashboard Group: `app/(dashboard)/`

This is the authenticated boundary. All routes here require authentication.

```
(dashboard)/
├── layout.tsx                      ← App-wide authenticated layout
├── page.tsx                        ← Dashboard home page
│
├── requests/
│   ├── page.tsx                    ← List all requests
│   ├── new/page.tsx                ← Create request form
│   ├── [requestId]/
│   │   ├── page.tsx                ← View request detail
│   │   ├── edit/page.tsx           ← Edit request form
│   │   └── audit/page.tsx          ← Audit trail view
│
├── tasks/
│   ├── page.tsx                    ← List my tasks
│   └── [taskId]/page.tsx           ← Task detail + approval
│
├── approvals/
│   ├── page.tsx                    ← Approval queue
│   └── [approvalId]/page.tsx       ← Approval detail
│
├── reports/
│   ├── page.tsx                    ← Main dashboard
│   ├── requests/page.tsx           ← Request analytics
│   ├── sla/page.tsx                ← SLA tracking
│   └── audit/page.tsx              ← Audit visibility
│
├── admin/
│   ├── page.tsx                    ← Admin dashboard
│   ├── users/
│   │   ├── page.tsx                ← User list
│   │   ├── new/page.tsx            ← Invite user
│   │   └── [userId]/
│   │       ├── page.tsx            ← User detail
│   │       └── edit/page.tsx       ← Edit user
│   ├── roles/page.tsx              ← Role definitions
│   ├── workflows/page.tsx          ← Workflow config
│   └── audit-logs/page.tsx         ← Audit logs
│
├── settings/
│   ├── page.tsx                    ← Settings hub
│   ├── tenant/page.tsx             ← Tenant config
│   ├── notifications/page.tsx      ← Notification prefs
│   └── security/page.tsx           ← Security settings
│
└── profile/
    ├── page.tsx                    ← User profile
    └── preferences/page.tsx        ← User preferences
```

---

## 🏗️ Page Implementation Pattern

Every page should follow this pattern. Here's the template:

```typescript
// app/(dashboard)/requests/page.tsx

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PageContainer, PageHeader } from '@/components/layout';
import { RequestTable } from '@/components/requests';
import { Button } from '@/components/ui';
import Link from 'next/link';

// 1. This is a SERVER component (runs on server)
// 2. Can access session directly
// 3. Can make API calls directly

export default async function RequestsPage() {
  // STEP 1: Validate authentication
  const session = await getServerSession();
  if (!session?.user) {
    redirect('/auth/login');
  }

  // STEP 2: Check permission (optional, but recommended for UX)
  if (!session.user.permissions?.includes('REQUESTS_VIEW')) {
    redirect('/unauthorized');
  }

  // STEP 3: Fetch data from backend API
  let requests = [];
  let error = null;

  try {
    const response = await fetch(
      'http://localhost:3000/api/travel-requests/list',
      {
        headers: {
          'Cookie': `next-auth.session-token=${session.id}`,
          'Content-Type': 'application/json',
        },
        // Server-side fetch - don't cache dynamic data
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      error = 'Failed to load requests';
    } else {
      const data = await response.json();
      requests = data.requests || [];
    }
  } catch (err) {
    error = 'Server error loading requests';
    console.error(err);
  }

  // STEP 4: Render page
  return (
    <PageContainer>
      <PageHeader
        title="Travel Requests"
        description="View all travel requests"
        primaryAction={
          session.user.permissions?.includes('REQUESTS_CREATE') ? (
            <Link href="/requests/new">
              <Button>New Request</Button>
            </Link>
          ) : null
        }
      />

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <RequestTable
          rows={requests.map((req) => ({
            id: req.id,
            requestNumber: req.requestNumber,
            destination: req.destination,
            status: req.status,
            createdAt: new Date(req.createdAt).toLocaleDateString(),
          }))}
        />
      )}
    </PageContainer>
  );
}
```

**Key Points:**
1. Use `async` for server components
2. Fetch data on server, not client
3. Handle errors gracefully
4. Check permissions for UX (backend enforces security)
5. Render components with fetched data

---

## 📝 Form Implementation Pattern

For pages with forms, use client components:

```typescript
// app/(dashboard)/requests/new/page.tsx

'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PageContainer, PageHeader } from '@/components/layout';
import { RequestForm } from '@/components/requests';
import { Card } from '@/components/ui';

// This is a CLIENT component (marked with 'use client')
// Can handle form submissions and user interactions

export default function NewRequestPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Require authentication
  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (status === 'loading') {
    return <PageContainer><p>Loading...</p></PageContainer>;
  }

  // Handle form submission
  async function handleSubmit(formData: {
    department: string;
    destination: string;
    startDate: string;
    endDate: string;
    purpose: string;
    estimatedCost: string;
    costCenter: string;
  }) {
    setIsSubmitting(true);
    setError(null);

    try {
      // STEP 1: Call backend API
      const response = await fetch('/api/travel-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedCost: parseFloat(formData.estimatedCost),
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        }),
      });

      // STEP 2: Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      // STEP 3: Success - redirect
      setSuccess(true);
      const data = await response.json();
      router.push(`/requests/${data.travelRequest.id}`);
    } catch (err) {
      // STEP 4: Show error to user
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Create Travel Request"
        description="Submit a new travel request for approval"
      />

      {error && (
        <Card style={{ backgroundColor: '#fef2f2', borderColor: '#fca5a5' }}>
          <p style={{ color: '#991b1b' }}>Error: {error}</p>
        </Card>
      )}

      <RequestForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </PageContainer>
  );
}
```

**Key Points:**
1. Mark with `'use client'` for client-side logic
2. Use `useState` for form state
3. Handle async submission with try/catch
4. Show loading state while submitting
5. Show error if API fails
6. Redirect on success

---

## 🔄 Data Fetching Patterns

### Pattern 1: Server-Side Fetch (Recommended for Lists)

```typescript
// app/(dashboard)/tasks/page.tsx

export default async function TasksPage() {
  const session = await getServerSession();

  // Fetch on server
  const response = await fetch('/api/tasks/list', {
    headers: { 'Cookie': `...${session.id}` },
    next: { revalidate: 0 }, // Don't cache
  });

  const { tasks } = await response.json();

  // Render with data
  return <TaskList tasks={tasks} />;
}
```

**When to use:** Page loads, lists, reports

### Pattern 2: Client-Side Fetch (For Interactions)

```typescript
// In a component

'use client';

export function ApprovalPanel() {
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    const response = await fetch('/api/approvals/decide', {
      method: 'POST',
      body: JSON.stringify({ taskId, decision: 'APPROVED' }),
    });
    // ...
  }

  return <button onClick={handleApprove}>Approve</button>;
}
```

**When to use:** Form submission, button clicks, user actions

### Pattern 3: Client-Side Effect (For Dependent Data)

```typescript
// In a component

'use client';

import { useEffect, useState } from 'react';

export function TaskDetail({ taskId }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch when component mounts or taskId changes
    fetch(`/api/tasks/${taskId}`)
      .then(r => r.json())
      .then(data => setTask(data.task))
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) return <p>Loading...</p>;
  return <div>{task.stepName}</div>;
}
```

**When to use:** Dependent data, detail pages

---

## 🛠️ Component Usage Examples

### Example 1: RequestTable

```typescript
import { RequestTable } from '@/components/requests';

// In your page
<RequestTable
  rows={[
    {
      id: '1',
      requestNumber: 'TR-001',
      requester: 'John Doe',
      department: 'Operations',
      destination: 'Cape Town',
      status: 'APPROVED',
      estimatedCost: 'R 5,000',
      createdDate: '2024-01-15',
    },
  ]}
  isLoading={false}
  error={null}
  rowActions={(row) => (
    <Link href={`/requests/${row.id}`}>View</Link>
  )}
/>
```

### Example 2: ApprovalDecisionPanel

```typescript
import { ApprovalDecisionPanel } from '@/components/approvals';
import { useState } from 'react';

'use client';

export function TaskApprovalUI({ task }) {
  const [isDeciding, setIsDeciding] = useState(false);

  async function handleApprove(comment) {
    setIsDeciding(true);
    const response = await fetch('/api/approvals/decide', {
      method: 'POST',
      body: JSON.stringify({
        taskId: task.id,
        decision: 'APPROVED',
        comment,
      }),
    });
    // Handle response
  }

  async function handleReject(comment) {
    setIsDeciding(true);
    const response = await fetch('/api/approvals/decide', {
      method: 'POST',
      body: JSON.stringify({
        taskId: task.id,
        decision: 'REJECTED',
        comment,
      }),
    });
    // Handle response
  }

  return (
    <ApprovalDecisionPanel
      summary={`${task.request.requestNumber}: ${task.request.purpose}`}
      slaWarning={task.dueAt && new Date(task.dueAt) < new Date() ? "Overdue" : null}
      disabled={isDeciding}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
```

### Example 3: PageHeader with Actions

```typescript
import { PageHeader } from '@/components/layout';
import Link from 'next/link';

<PageHeader
  title="Travel Requests"
  description="All travel requests for your department"
  primaryAction={
    <Link href="/requests/new">
      <Button>New Request</Button>
    </Link>
  }
  secondaryAction={
    <Link href="/reports/requests">
      <Button variant="outline">Analytics</Button>
    </Link>
  }
/>
```

---

## ✅ Implementation Checklist

### Dashboard Pages

- [ ] `(dashboard)/page.tsx` - Dashboard home
- [ ] `(dashboard)/layout.tsx` - Authenticated layout

### Request Pages

- [ ] `requests/page.tsx` - List requests
- [ ] `requests/new/page.tsx` - Create request form
- [ ] `requests/[requestId]/page.tsx` - Request detail
- [ ] `requests/[requestId]/edit/page.tsx` - Edit request
- [ ] `requests/[requestId]/audit/page.tsx` - Audit trail

### Task Pages

- [ ] `tasks/page.tsx` - List my tasks
- [ ] `tasks/[taskId]/page.tsx` - Task detail + approval

### Approval Pages

- [ ] `approvals/page.tsx` - Approval queue
- [ ] `approvals/[approvalId]/page.tsx` - Approval detail

### Report Pages

- [ ] `reports/page.tsx` - Reports dashboard
- [ ] `reports/requests/page.tsx` - Request analytics
- [ ] `reports/sla/page.tsx` - SLA tracking
- [ ] `reports/audit/page.tsx` - Audit visibility

### Admin Pages

- [ ] `admin/page.tsx` - Admin dashboard
- [ ] `admin/users/page.tsx` - User list
- [ ] `admin/users/new/page.tsx` - Invite user
- [ ] `admin/users/[userId]/page.tsx` - User detail
- [ ] `admin/users/[userId]/edit/page.tsx` - Edit user
- [ ] `admin/roles/page.tsx` - Roles view
- [ ] `admin/workflows/page.tsx` - Workflows view
- [ ] `admin/audit-logs/page.tsx` - Audit logs

### Settings Pages

- [ ] `settings/page.tsx` - Settings hub
- [ ] `settings/tenant/page.tsx` - Tenant config
- [ ] `settings/notifications/page.tsx` - Notifications
- [ ] `settings/security/page.tsx` - Security settings

### Profile Pages

- [ ] `profile/page.tsx` - User profile
- [ ] `profile/preferences/page.tsx` - Preferences

---

## 🎨 Component Import Patterns

```typescript
// Import components from established paths
import { PageContainer, PageHeader } from '@/components/layout';
import { RequestTable, RequestForm } from '@/components/requests';
import { ApprovalDecisionPanel } from '@/components/approvals';
import { WorkflowTimeline } from '@/components/workflow';
import { KpiCard } from '@/components/dashboard';
import { Button, Card, Input } from '@/components/ui';
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Mistake 1: Fetching on Client When Should be Server

```typescript
// WRONG
'use client';
async function MyPage() {
  const data = await fetch('/api/data');
}

// RIGHT
export default async function MyPage() {
  const data = await fetch('/api/data');
}
```

### ❌ Mistake 2: Forgetting Auth Check

```typescript
// WRONG
export default function Page() {
  return <div>Content</div>;
}

// RIGHT
export default async function Page() {
  const session = await getServerSession();
  if (!session) redirect('/login');
  return <div>Content</div>;
}
```

### ❌ Mistake 3: Hardcoding Backend URL

```typescript
// WRONG
fetch('http://localhost:3000/api/...')

// RIGHT
fetch('/api/...') // Relative URL works in Next.js
```

### ❌ Mistake 4: Not Handling Errors

```typescript
// WRONG
const data = await fetch('/api/data');
const result = await data.json();

// RIGHT
try {
  const data = await fetch('/api/data');
  if (!data.ok) throw new Error('Failed');
  const result = await data.json();
} catch (error) {
  setError(error.message);
}
```

---

## 📱 Responsive Design

Use your component library's responsive classes:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <Card>Request 1</Card>
  <Card>Request 2</Card>
  <Card>Request 3</Card>
</div>
```

---

## ♿ Accessibility Requirements

- [ ] All buttons have `aria-label` when text unclear
- [ ] All form inputs have `<label>` tags
- [ ] All tables have `<thead>` and `<tbody>`
- [ ] All images have `alt` text
- [ ] All interactive elements focusable
- [ ] All form errors announced to screen readers
- [ ] Keyboard navigation works throughout

---

## 🧪 Testing Guide

### Unit Tests

```typescript
// __tests__/components/RequestForm.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { RequestForm } from '@/components/requests';

describe('RequestForm', () => {
  it('should submit form with valid data', async () => {
    const handleSubmit = jest.fn();

    render(<RequestForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/destination/i), {
      target: { value: 'Cape Town' },
    });

    fireEvent.click(screen.getByText(/submit/i));

    await expect(handleSubmit).toHaveBeenCalled();
  });

  it('should show error message', () => {
    render(<RequestForm error="Invalid input" />);

    expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// __tests__/pages/requests-new.test.tsx

describe('POST /requests/new', () => {
  it('should create request and redirect', async () => {
    // Render the page
    // Fill form
    // Submit
    // Verify API called
    // Verify redirect
  });
});
```

---

## 🚀 Deployment Checklist

Before deployment, frontend team verifies:

- [ ] All pages implemented
- [ ] All forms integrated with API
- [ ] All permission checks in place
- [ ] All error states handled
- [ ] All loading states working
- [ ] All responsive layouts tested
- [ ] All accessibility verified
- [ ] No console errors
- [ ] No console warnings
- [ ] Build succeeds: `npm run build`

---

## 📞 Asking Backend Team

When you need something:

**Good:** "I need an API endpoint to list pending approvals with filters for status and date range"

**Good:** "What fields does the task detail endpoint return?"

**Good:** "Does the approval decision endpoint return the updated request?"

**Bad:** "Fix your API, it's broken"

**Bad:** "Why isn't this working?"

---

## 📚 Reference Documents

See also:
- `TEAM_ARCHITECTURE_COLLABORATION.md` - Architecture overview
- `COMPLETE_WORKFLOW_IMPLEMENTATION.md` - Detailed workflows
- `COMPONENT_QUICK_REFERENCE.md` - Component props

---

**Frontend team: Focus on great UX. Backend has your back on security and logic.** ✅

