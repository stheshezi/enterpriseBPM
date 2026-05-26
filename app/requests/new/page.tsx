import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function NewRequestPage() {
  await requirePermission(PERMISSIONS.REQUESTS_CREATE);

  return (
    <PageContainer>
      <PageHeader title="New Request" description="Workflow entry point for creating a travel request." />
      <Card title="Request form" description="The active MVP form is available at the legacy route while this route becomes the canonical entry point.">
        <a href="/travel-requests/new">Open request form</a>
      </Card>
    </PageContainer>
  );
}
