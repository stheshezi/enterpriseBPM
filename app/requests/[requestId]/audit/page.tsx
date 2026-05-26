import { PageContainer, PageHeader } from "@/components/layout";
import { AuditTimeline } from "@/components/workflow";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function RequestAuditPage({ params }: { params: { requestId: string } }) {
  await requirePermission(PERMISSIONS.AUDIT_VIEW);

  return (
    <PageContainer>
      <PageHeader title={`Audit ${params.requestId}`} description="Immutable read-only request history." />
      <AuditTimeline events={[]} />
    </PageContainer>
  );
}
