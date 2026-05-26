import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { Card, Button } from "@/components/ui";
import { requireCurrentUser } from "@/lib/access-control";

export default async function ProfilePage() {
  const user = await requireCurrentUser();

  return (
    <PageContainer>
      <PageHeader title="Profile" description="Your account, tenant, and access profile." primaryAction={<Link href="/profile/preferences"><Button>Preferences</Button></Link>} />
      <Card title={user.name ?? user.email}>
        <div className="profile-grid">
          <span>Email <strong>{user.email}</strong></span>
          <span>Tenant <strong>{user.tenantDomain ?? user.tenantId}</strong></span>
          <span>Roles <strong>{user.roles.join(", ")}</strong></span>
          <span>Permissions <strong>{user.permissions.length}</strong></span>
        </div>
      </Card>
    </PageContainer>
  );
}
