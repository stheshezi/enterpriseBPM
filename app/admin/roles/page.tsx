import { PermissionMatrix } from "@/components/admin";
import { PageContainer, PageHeader } from "@/components/layout";
import { ALL_PERMISSIONS, PERMISSIONS } from "@/config/permissions";
import { ROLE_DEFINITIONS, ROLE_NAMES } from "@/config/roles";
import { requirePermission } from "@/lib/access-control";

export default async function RolesPage() {
  await requirePermission(PERMISSIONS.ROLES_MANAGE);

  return (
    <PageContainer>
      <PageHeader title="Roles" description="Phase One role definitions are read-only and system-managed." />
      <PermissionMatrix
        roles={ROLE_NAMES}
        permissions={ALL_PERMISSIONS}
        rolePermissions={Object.fromEntries(ROLE_NAMES.map((role) => [role, ROLE_DEFINITIONS[role].permissions])) as never}
      />
    </PageContainer>
  );
}
