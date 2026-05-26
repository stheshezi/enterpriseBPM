import { PageContainer, PageHeader } from "@/components/layout";
import { Card, Input, Select, Button } from "@/components/ui";
import { ROLE_DEFINITIONS, ROLE_NAMES } from "@/config/roles";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function NewUserPage() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  return (
    <PageContainer>
      <PageHeader title="Invite User" description="Create or invite a tenant user and assign their starting role." />
      <Card title="User invitation">
        <form className="tenant-settings-form">
          <Input label="First Name" name="firstName" />
          <Input label="Last Name" name="lastName" />
          <Input label="Email" name="email" type="email" required />
          <Input label="Department" name="department" />
          <Select label="Role" name="role" required options={ROLE_NAMES.map((role) => ({ label: ROLE_DEFINITIONS[role].label, value: role }))} />
          <Input label="Manager" name="manager" />
          <Select label="Status" name="status" options={[{ label: "Invited", value: "Invited" }, { label: "Active", value: "Active" }]} />
          <Button disabled>Create invitation</Button>
        </form>
      </Card>
    </PageContainer>
  );
}
