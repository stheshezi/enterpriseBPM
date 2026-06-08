import { revalidatePath } from "next/cache";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { prisma } from "@/lib/prisma";

function codeFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default async function RequestTypesPage() {
  const user = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const tenant = user.roles.includes("SUPER_ADMIN")
    ? await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" } })
    : await prisma.tenant.findUnique({ where: { id: user.tenantId } });

  if (!tenant) {
    return (
      <PageContainer>
        <PageHeader title="Request Types" description="Configure request categories for workflow routing." />
        <div className="component-state">No tenant is configured.</div>
      </PageContainer>
    );
  }

  async function createRequestType(formData: FormData) {
    "use server";

    const currentUser = await requirePermission(PERMISSIONS.USERS_MANAGE);
    const name = String(formData.get("name") ?? "").trim();
    const rawCode = String(formData.get("code") ?? "").trim();
    const code = codeFromName(rawCode || name);
    const targetTenantId = currentUser.roles.includes("SUPER_ADMIN")
      ? String(formData.get("tenantId") ?? currentUser.tenantId)
      : currentUser.tenantId;

    if (!name || !code) return;

    await prisma.requestType.upsert({
      where: {
        tenantId_code: {
          tenantId: targetTenantId,
          code,
        },
      },
      update: { name },
      create: {
        tenantId: targetTenantId,
        code,
        name,
      },
    });

    revalidatePath("/admin/request-types");
    revalidatePath("/requests/new");
  }

  const requestTypes = await prisma.requestType.findMany({
    where: { tenantId: tenant.id },
    orderBy: { name: "asc" },
  });

  return (
    <PageContainer>
      <PageHeader
        title="Request Types"
        description="Configure request categories that drive dynamic forms and workflow routing."
      />
      <section className="dashboard-grid">
        {requestTypes.map((requestType) => (
          <Card key={requestType.id} title={requestType.name}>
            <div className="profile-grid">
              <span>Code <strong>{requestType.code}</strong></span>
              <span>Workflow <strong>{requestType.code.toUpperCase()}_WORKFLOW</strong></span>
            </div>
          </Card>
        ))}
        {!requestTypes.length ? <div className="component-state">No configured request types yet. The create form will add one.</div> : null}
      </section>

      <Card title="Add request type">
        <form action={createRequestType} className="request-form">
          <input name="tenantId" type="hidden" value={tenant.id} />
          <label>
            Name
            <input name="name" required placeholder="Legal Review Request" />
          </label>
          <label>
            Code
            <input name="code" placeholder="legal_review" />
          </label>
          <div className="form-actions span-2">
            <Button type="submit">Save Request Type</Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
