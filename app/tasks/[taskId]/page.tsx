import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { WorkflowTimeline, AuditTimeline } from "@/components/workflow";
import { Card } from "@/components/ui";
import { ApprovalDecisionActions } from "@/components/approvals";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { getTaskDetail } from "@/lib/workflow-read-model";

export default async function TaskDetailPage({ params }: { params: { taskId: string } }) {
  const user = await requirePermission(PERMISSIONS.TASKS_VIEW_ASSIGNED);
  const task = await getTaskDetail(params.taskId, user);

  return (
    <PageContainer>
      <PageHeader
        title={task.title}
        description={`Workflow task for request ${task.request.requestNumber}.`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Tasks", href: "/tasks" },
          { label: task.title },
        ]}
        secondaryAction={<Link href={`/requests/${task.request.id}`}>Open request</Link>}
      />
      <div className="stack">
        <Card title="Task Summary">
          <div className="profile-grid">
            <span>Task status <strong>{task.status}</strong></span>
            <span>Due <strong>{task.dueAtLabel}</strong></span>
            <span>Created <strong>{task.createdAtLabel}</strong></span>
            <span>Completed <strong>{task.completedAtLabel ?? "Not completed"}</strong></span>
            <span>Request <strong>{task.request.requestNumber}</strong></span>
            <span>Current request state <strong>{task.request.status}</strong></span>
          </div>
        </Card>
        <WorkflowTimeline steps={task.request.timeline} />
        <ApprovalDecisionActions taskId={task.id} disabled={!task.canDecide} />
        <AuditTimeline events={task.request.auditEvents} />
      </div>
    </PageContainer>
  );
}
