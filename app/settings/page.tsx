import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const user = await requirePermission(PERMISSIONS.TENANT_MANAGE);
  const isSuperAdmin = user.roles.includes("SUPER_ADMIN");
  const tenant = isSuperAdmin
    ? await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" } })
    : await prisma.tenant.findUnique({ where: { id: user.tenantId } });

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
      
      <SettingsClient 
        initialData={{
          tenantName: tenant?.name ?? "",
          tenantCode: "",
          defaultTimezone: "Africa/Johannesburg",
          defaultCurrency: "ZAR",
          primaryContact: "",
          notificationEmail: "",
          slaDefaultHours: "48",
        }}
      />
    </PageContainer>
  );
}
