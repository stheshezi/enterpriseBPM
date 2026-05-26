import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function EditUserPage({ params }: { params: { userId: string } }) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  return (
    <PageContainer>
      <PageHeader title={`Edit User ${params.userId}`} description="Validate changes, update user profile, recalculate permissions, and audit the update." />
      <Card title="Edit user"><div className="component-state">Editable user fields and role assignment controls will render here.</div></Card>
    </PageContainer>
  );
}
