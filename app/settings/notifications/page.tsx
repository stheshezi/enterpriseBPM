import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function NotificationSettingsPage() {
  await requirePermission(PERMISSIONS.TENANT_MANAGE);

  return (
    <PageContainer>
      <PageHeader title="Notification Settings" description="Email notifications, approval notifications, SLA alerts, and digest frequency." />
      <Card title="Notification preferences"><div className="component-state">Tenant notification settings will render here.</div></Card>
    </PageContainer>
  );
}
