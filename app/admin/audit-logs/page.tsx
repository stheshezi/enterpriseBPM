import { PageContainer, PageHeader } from "@/components/layout";
import { AuditTimeline } from "@/components/workflow";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function AdminAuditLogsPage() {
  await requirePermission(PERMISSIONS.AUDIT_VIEW);

  return (
    <PageContainer>
      <PageHeader title="Audit Logs" description="Centralized tenant audit visibility with search, filters, export, and actor/date controls." />
      <AuditTimeline events={[]} />
    </PageContainer>
  );
}
