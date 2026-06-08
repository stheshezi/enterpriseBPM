import Link from "next/link";
import { BarChart3, CheckCircle2, Clock3, FileText, PlusCircle } from "lucide-react";
import type { RoleDashboardData } from "@/lib/dashboard-data";

const iconByIndex = [
  <CheckCircle2 aria-hidden="true" size={18} key="approval" />,
  <FileText aria-hidden="true" size={18} key="request" />,
  <Clock3 aria-hidden="true" size={18} key="task" />,
];

export function RoleDashboard({ data }: { data: RoleDashboardData }) {
  const isManager = data.roleExperience === "manager";

  return (
    <div className="super-admin-dashboard">
      <section className="super-admin-hero">
        <div>
          <p className="eyebrow">{isManager ? "Manager workspace" : "Employee workspace"}</p>
          <h1>{isManager ? "Manager Dashboard" : "My Dashboard"}</h1>
          <p>
            {isManager
              ? "Approvals, team request movement, open workflow tasks, and request status at a glance."
              : "Your requests, assigned work, recent submissions, and request progress in one place."}
          </p>
        </div>
        <div className="super-admin-hero__meta">
          <span>Last refreshed</span>
          <strong>{data.generatedAt}</strong>
          <small>{isManager ? "Team-aware dashboard" : "Personal dashboard"}</small>
        </div>
      </section>

      <section className="super-admin-kpis" aria-label="Role dashboard KPIs">
        {data.kpis.map((kpi, index) => (
          <Link className="super-admin-kpi super-admin-kpi--info" href={kpi.href} key={kpi.title}>
            <span className="super-admin-kpi__icon">{iconByIndex[index] ?? iconByIndex[0]}</span>
            <span>{kpi.title}</span>
            <strong>{kpi.value}</strong>
            <small>{kpi.detail}</small>
          </Link>
        ))}
        <Link className="super-admin-kpi super-admin-kpi--success" href="/requests/new">
          <span className="super-admin-kpi__icon"><PlusCircle aria-hidden="true" size={18} /></span>
          <span>Create request</span>
          <strong>New</strong>
          <small>Select a request type and start the right workflow</small>
        </Link>
      </section>

      <section className="super-admin-actions" aria-label="Dashboard shortcuts">
        <Link href="/dashboard"><BarChart3 aria-hidden="true" size={18} />Dashboard</Link>
        <Link href="/requests"><FileText aria-hidden="true" size={18} />Requests</Link>
        <Link href="/requests/new"><PlusCircle aria-hidden="true" size={18} />Create Request</Link>
        <Link href="/tasks"><Clock3 aria-hidden="true" size={18} />My Tasks</Link>
        {isManager ? <Link href="/approvals"><CheckCircle2 aria-hidden="true" size={18} />Approvals</Link> : null}
      </section>

      <section className="super-admin-grid">
        <div className="super-admin-panel">
          <header>
            <div>
              <h2>{isManager ? "Pending approvals" : "My pending tasks"}</h2>
              <p>{isManager ? "Approval work assigned to you." : "Workflow tasks waiting for your action."}</p>
            </div>
            <Link href={isManager ? "/approvals" : "/tasks"}>View all</Link>
          </header>
          <div className="live-list">
            {data.openTasks.map((task) => (
              <Link className={task.overdue ? "is-risk" : ""} href={task.href} key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.requestNumber}</span>
                <small>{task.dueAt}</small>
              </Link>
            ))}
            {!data.openTasks.length ? <p className="component-state">No pending tasks.</p> : null}
          </div>
        </div>

        <div className="super-admin-panel">
          <header>
            <div>
              <h2>{isManager ? "Team requests" : "My requests"}</h2>
              <p>{isManager ? "Recent requests from your team." : "Your latest submissions."}</p>
            </div>
            <Link href="/requests">View all</Link>
          </header>
          <div className="live-list">
            {data.recentRequests.map((request) => (
              <Link href={request.href} key={request.id}>
                <strong>{request.requestNumber}</strong>
                <span>{request.title}</span>
                <small>{request.statusLabel} - {request.createdAt}</small>
              </Link>
            ))}
            {!data.recentRequests.length ? <p className="component-state">No requests yet.</p> : null}
          </div>
        </div>

        <div className="super-admin-panel">
          <header>
            <div>
              <h2>Request status summary</h2>
              <p>Current status mix for this dashboard scope.</p>
            </div>
          </header>
          <div className="task-health">
            {data.statusSummary.filter((item) => item.count > 0).map((item) => (
              <Link href={`/requests?status=${item.status}`} key={item.status}>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </Link>
            ))}
            {data.statusSummary.every((item) => item.count === 0) ? <p className="component-state">No request statuses yet.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
