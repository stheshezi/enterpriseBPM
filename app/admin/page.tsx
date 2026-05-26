import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { PermissionMatrix } from "@/components/admin";
import { Button } from "@/components/ui";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { ROLE_DEFINITIONS, ROLE_NAMES } from "@/config/roles";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function AdminPage() {
  await requirePermission(PERMISSIONS.USERS_VIEW);

  return (
    <PageContainer>
      <PageHeader
        title="Administration"
        description="Users, roles, permissions, tenant controls, and audit-facing configuration."
        primaryAction={<Link href="/admin/users"><Button>Open users</Button></Link>}
      />
      <section className="dashboard-grid">
        <Link className="feature-card" href="/admin/users"><h2>Users</h2><p>User list, invitations, and profile access.</p></Link>
        <Link className="feature-card" href="/admin/roles"><h2>Roles</h2><p>Read-only Phase One role definitions.</p></Link>
        <Link className="feature-card" href="/admin/workflows"><h2>Workflows</h2><p>System-managed workflow definitions.</p></Link>
        <Link className="feature-card" href="/admin/audit-logs"><h2>Audit Logs</h2><p>Central tenant audit visibility.</p></Link>
      </section>
      <PermissionMatrix
        roles={ROLE_NAMES}
        permissions={ALL_PERMISSIONS}
        rolePermissions={Object.fromEntries(ROLE_NAMES.map((role) => [role, ROLE_DEFINITIONS[role].permissions])) as never}
      />
    </PageContainer>
  );
}
