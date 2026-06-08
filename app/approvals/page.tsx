import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { ApprovalHistory } from "@/components/approvals";
import { PERMISSIONS } from "@/config/permissions";
import { requireCurrentUser, userCanAny } from "@/lib/access-control";
import { redirect } from "next/navigation";
import { getSuperAdminDashboardData } from "@/lib/dashboard-data";
import { PendingTasksTable } from "@/components/dashboard";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const user = await requireCurrentUser();
  if (!userCanAny(user, [PERMISSIONS.REQUESTS_APPROVE_MANAGER, PERMISSIONS.REQUESTS_APPROVE_FINANCE])) {
    redirect("/unauthorized");
  }
  const data = await getSuperAdminDashboardData(user);
  const pendingApprovalCount = data.kpis.find((kpi) => kpi.id === "pending")?.value ?? 0;

  return (
    <PageContainer>
      <PageHeader title="Approvals" description="Centralized approval management view backed by workflow tasks and audit activity." />
      <div className="stack">
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Pending approvals</h2>
            <p className="text-sm text-gray-500">{pendingApprovalCount} requests are waiting for a decision.</p>
          </div>
          <PendingTasksTable
            rows={data.pendingTasks}
            actionLabel="Review Approval"
            emptyMessage="No pending approvals in the database."
          />
        </div>
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
