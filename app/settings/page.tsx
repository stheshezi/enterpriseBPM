import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const user = await requirePermission(PERMISSIONS.TENANT_MANAGE);
  const isSuperAdmin = user.roles.includes("SUPER_ADMIN");
  const tenant = isSuperAdmin
    ? await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" } })
    : await prisma.tenant.findUnique({ where: { id: user.tenantId } });
  const [tenantCount, userCount, roleCount, workflowCount] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count({ where: isSuperAdmin ? {} : { tenantId: user.tenantId } }),
    prisma.role.count({ where: isSuperAdmin ? {} : { tenantId: user.tenantId } }),
    prisma.workflowDefinition.count({ where: isSuperAdmin ? {} : { tenantId: user.tenantId } }),
  ]);

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
          <span>Tenant name <strong>{tenant?.name ?? "Not configured"}</strong></span>
          <span>Tenant domain <strong>{tenant?.domain ?? "Not configured"}</strong></span>
          <span>Tenant count <strong>{tenantCount}</strong></span>
          <span>User count <strong>{userCount}</strong></span>
          <span>Role count <strong>{roleCount}</strong></span>
          <span>Workflow definitions <strong>{workflowCount}</strong></span>
          <span>Default timezone <strong>Africa/Johannesburg</strong></span>
          <span>Default currency <strong>ZAR</strong></span>
          <span>SLA default <strong>48 hours</strong></span>
        </div>
      </Card>
    </PageContainer>
  );
}
