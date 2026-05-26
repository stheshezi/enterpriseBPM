import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function SettingsPage() {
  await requirePermission(PERMISSIONS.TENANT_MANAGE);

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Centralized tenant settings hub."
        secondaryAction={<Link href="/preferences"><Button variant="outline">Preferences</Button></Link>}
      />
      <section className="dashboard-grid">
        <Link className="feature-card" href="/settings/tenant"><h2>Tenant Settings</h2><p>Name, logo, timezone, currency, and business rules.</p></Link>
        <Link className="feature-card" href="/settings/notifications"><h2>Notification Settings</h2><p>Email, approval, SLA alerts, and digest frequency.</p></Link>
        <Link className="feature-card" href="/settings/security"><h2>Security Settings</h2><p>MFA policy, session timeout, and password policy.</p></Link>
      </section>
      <Card title="Operational defaults">
        <div className="profile-grid">
          <span>Tenant name <strong>Super Admin Tenant</strong></span>
          <span>Default timezone <strong>Africa/Johannesburg</strong></span>
          <span>Default currency <strong>ZAR</strong></span>
          <span>SLA default <strong>48 hours</strong></span>
        </div>
      </Card>
    </PageContainer>
  );
}
