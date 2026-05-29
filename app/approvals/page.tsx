import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { ApprovalHistory } from "@/components/approvals";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/requirePermission";
import { getSuperAdminDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const user = await requirePermission([PERMISSIONS.REQUESTS_APPROVE_MANAGER, PERMISSIONS.REQUESTS_APPROVE_FINANCE]);
  const data = await getSuperAdminDashboardData(user);
  const pendingApprovalCount = data.kpis.find((kpi) => kpi.id === "pending")?.value ?? 0;

  return (
    <PageContainer>
      <PageHeader title="Approvals" description="Centralized approval management view backed by workflow tasks and audit activity." />
      <div className="stack">
        <Card title="Pending approvals" description={`${pendingApprovalCount} requests are waiting for a decision.`}>
          <div className="live-list">
            {data.pendingTasks.map((task) => (
              <Link className={task.overdue ? "is-risk" : ""} href={task.href} key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.requestNumber} - {task.assignee}</span>
                <small>{task.tenant} - Due {task.dueAt}</small>
              </Link>
            ))}
            {!data.pendingTasks.length ? <div className="component-state">No pending approvals in the database.</div> : null}
          </div>
        </Card>
        <ApprovalHistory
          items={data.recentActivities
            .filter((activity) => activity.action.includes("Approved") || activity.action.includes("Rejected"))
            .map((activity) => ({
              id: activity.id,
              approverName: activity.actor,
              role: activity.tenant,
              decision: activity.action.includes("Rejected") ? "REJECTED" : "APPROVED",
              timestamp: activity.createdAt,
              stepName: activity.entityType,
            }))}
        />
      </div>
    </PageContainer>
  );
}
