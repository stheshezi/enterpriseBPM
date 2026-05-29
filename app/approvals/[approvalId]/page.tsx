import { PageContainer, PageHeader } from "@/components/layout";
import { ApprovalDecisionActions, ApprovalHistory } from "@/components/approvals";
import { WorkflowTimeline } from "@/components/workflow";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/requirePermission";
import { getTaskDetail } from "@/lib/workflow-read-model";

export default async function ApprovalDetailPage({ params }: { params: { approvalId: string } }) {
  const user = await requirePermission([PERMISSIONS.REQUESTS_APPROVE_MANAGER, PERMISSIONS.REQUESTS_APPROVE_FINANCE]);
  const task = await getTaskDetail(params.approvalId, user);

  return (
    <PageContainer>
      <PageHeader title={`Approval ${task.request.requestNumber}`} description={`${task.title} decision interface.`} />
      <div className="stack">
        <Card title="Approval context">
          <div className="profile-grid">
            <span>Request <strong>{task.request.requestNumber}</strong></span>
            <span>Requester <strong>{task.request.requester}</strong></span>
            <span>Destination <strong>{task.request.destination}</strong></span>
            <span>Estimated cost <strong>{task.request.estimatedCost}</strong></span>
            <span>Task status <strong>{task.status}</strong></span>
            <span>Due <strong>{task.dueAtLabel}</strong></span>
          </div>
        </Card>
        <ApprovalDecisionActions taskId={task.id} disabled={!task.canDecide} />
        <ApprovalHistory items={task.request.approvalHistory} />
        <WorkflowTimeline steps={task.request.timeline} />
      </div>
    </PageContainer>
  );
}
