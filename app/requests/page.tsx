import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { RequestTable } from "@/components/requests";
import { Button } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function RequestsPage() {
  await requirePermission(PERMISSIONS.REQUESTS_CREATE);

  return (
    <PageContainer>
      <PageHeader
        title="Requests"
        description="Create, find, and track workflow requests across the tenant."
        primaryAction={<Link href="/travel-requests/new"><Button>New request</Button></Link>}
      />
      <RequestTable rows={[]} />
    </PageContainer>
  );
}
