import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function EditRequestPage({ params }: { params: { requestId: string } }) {
  await requirePermission(PERMISSIONS.REQUESTS_CREATE);

  return (
    <PageContainer>
      <PageHeader title={`Edit ${params.requestId}`} description="Editable only while draft or rejected with resubmission allowed." />
      <Card title="Edit rules">
        <div className="component-state">Submitted, approved, completed, and cancelled requests are blocked from editing.</div>
      </Card>
    </PageContainer>
  );
}
