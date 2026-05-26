import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { RoleBadge } from "@/components/admin";
import { Button, Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { getTenantUserProfile } from "@/modules/admin/users";
import type { AppRole } from "@/types/auth";

export default async function UserDetailPage({ params }: { params: { userId: string } }) {
  const currentUser = await requirePermission(PERMISSIONS.USERS_VIEW);
  const user = await getTenantUserProfile(currentUser.tenantId, params.userId);

  return (
    <PageContainer>
      <PageHeader
        title={user?.email ?? "User profile"}
        description="User profile, roles, permissions, activity, and assigned work."
        primaryAction={<Link href={`/admin/users/${params.userId}/edit`}><Button>Edit User</Button></Link>}
      />
      <Card title="Profile">
        {user ? (
          <div className="profile-grid">
            <span>Name <strong>{[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}</strong></span>
            <span>Email <strong>{user.email}</strong></span>
            <span>Roles <strong className="pill-list">{user.roles.map((role) => <RoleBadge key={role.roleId} role={role.role.name as AppRole} />)}</strong></span>
            <span>Last Login <strong>Never</strong></span>
          </div>
        ) : <div className="component-state">User not found in this tenant.</div>}
      </Card>
    </PageContainer>
  );
}
