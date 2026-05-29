import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { getSuperAdminDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await requirePermission(PERMISSIONS.TASKS_VIEW_ASSIGNED);
  const data = await getSuperAdminDashboardData(user);

  return (
    <PageContainer>
      <PageHeader title="My Tasks" description="Actionable workflow assignments from the database." />
      <section className="dashboard-grid">
        {data.taskSummary.map((item) => (
          <Link className="feature-card" href={`/tasks?status=${item.status}`} key={item.status}>
            <h2>{item.label}</h2>
            <strong>{item.count}</strong>
            <p>Workflow tasks in this status.</p>
          </Link>
        ))}
      </section>
      <Card title="Open workflow tasks">
        <div className="live-list">
          {data.pendingTasks.map((task) => (
            <Link className={task.overdue ? "is-risk" : ""} href={task.href} key={task.id}>
              <strong>{task.title}</strong>
              <span>{task.requestNumber} - {task.assignee}</span>
              <small>{task.tenant} - Due {task.dueAt}</small>
            </Link>
          ))}
          {!data.pendingTasks.length ? <div className="component-state">No pending tasks in the database.</div> : null}
        </div>
      </Card>
    </PageContainer>
  );
}
