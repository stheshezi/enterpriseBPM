import { PageContainer, PageHeader } from "@/components/layout";
import { ApprovalHistory } from "@/components/approvals";
import { WorkflowTimeline } from "@/components/workflow";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function ApprovalDetailPage({ params }: { params: { approvalId: string } }) {
  await requirePermission(PERMISSIONS.REQUESTS_APPROVE_MANAGER);

  return (
    <PageContainer>
      <PageHeader title={`Approval ${params.approvalId}`} description="Detailed approval decision interface." />
      <div className="stack">
        <Card title="Decision panel"><div className="component-state">Approval and rejection controls activate when an approval is assigned.</div></Card>
        <ApprovalHistory items={[]} />
        <WorkflowTimeline steps={[]} />
      </div>
    </PageContainer>
  );
}
