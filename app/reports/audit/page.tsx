import { PageContainer, PageHeader } from "@/components/layout";
import { AuditTimeline } from "@/components/workflow";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function AuditReportsPage() {
  await requirePermission(PERMISSIONS.AUDIT_VIEW);

  return (
    <PageContainer>
      <PageHeader title="Audit Reports" description="Security, approval, user activity, workflow, and configuration events." />
      <AuditTimeline events={[]} />
    </PageContainer>
  );
}
