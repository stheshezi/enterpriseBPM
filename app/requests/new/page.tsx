import { PageContainer, PageHeader } from "@/components/layout";
import { TravelRequestForm } from "@/components/requests";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function NewRequestPage() {
  await requirePermission(PERMISSIONS.REQUESTS_CREATE);

  return (
    <PageContainer>
      <PageHeader title="New Request" description="Create a travel request and start the approval workflow." />
      <TravelRequestForm />
    </PageContainer>
  );
}
