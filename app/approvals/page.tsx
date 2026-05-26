import { PageContainer, PageHeader } from "@/components/layout";
import { ApprovalHistory } from "@/components/approvals";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function ApprovalsPage() {
  await requirePermission(PERMISSIONS.REQUESTS_APPROVE_MANAGER);

  return (
    <PageContainer>
      <PageHeader title="Approvals" description="Centralized approval management view." />
      <div className="stack">
        <Card title="Pending approvals">
          <div className="component-state">Pending, completed, rejected, and overdue approvals will render here with filters.</div>
        </Card>
        <ApprovalHistory items={[]} />
      </div>
    </PageContainer>
  );
}
