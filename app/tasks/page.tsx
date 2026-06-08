import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { PERMISSIONS } from "@/config/permissions";
import { requireCurrentUser, userCanAny } from "@/lib/access-control";
import { redirect } from "next/navigation";
import { getSuperAdminDashboardData } from "@/lib/dashboard-data";
import { PendingTasksTable } from "@/components/dashboard";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await requireCurrentUser();
  if (!userCanAny(user, [PERMISSIONS.TASKS_VIEW_ASSIGNED])) {
    redirect("/unauthorized");
  }
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
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Open workflow tasks</h2>
        </div>
        <PendingTasksTable
          rows={data.pendingTasks}
          actionLabel="Review Task"
          emptyMessage="No pending tasks in the database."
        />
      </div>
    </PageContainer>
  );
}
