import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function SecuritySettingsPage() {
  await requirePermission(PERMISSIONS.TENANT_MANAGE);

  return (
    <PageContainer>
      <PageHeader title="Security Settings" description="MFA policy view, session timeout, and password policy." />
      <Card title="Security policy"><div className="component-state">Phase One security controls are read-only until policy management is enabled.</div></Card>
    </PageContainer>
  );
}
