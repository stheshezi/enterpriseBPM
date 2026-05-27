import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { UserTable } from "@/components/admin";
import { Button } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { listTenantUsers } from "@/modules/admin/users";

export default async function AdminUsersPage() {
  const user = await requirePermission(PERMISSIONS.USERS_VIEW);
  const users = await listTenantUsers(user.tenantId);

  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        description="Invite, manage, and configure user access and roles."
        primaryAction={<Link href="/admin/users/new"><Button>Invite User</Button></Link>}
      />
      <UserTable
        rows={users}
        detailHrefBase="/admin/users"
      />
    </PageContainer>
  );
}
