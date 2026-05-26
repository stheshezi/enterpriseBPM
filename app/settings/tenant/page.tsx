import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function TenantSettingsPage() {
  await requirePermission(PERMISSIONS.TENANT_MANAGE);

  return (
    <PageContainer>
      <PageHeader title="Tenant Settings" description="Tenant name, logo, currency, timezone, and business rule defaults." />
      <Card title="Tenant profile"><div className="component-state">Tenant settings save logic will validate input, update settings, audit the change, and refresh cache.</div></Card>
    </PageContainer>
  );
}
