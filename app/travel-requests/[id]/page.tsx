import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { Button, Card } from "@/components/ui";

export default function LegacyTravelRequestDetailPage({ params }: { params: { id: string } }) {
  return (
    <PageContainer>
      <PageHeader title="Legacy Travel Request Route" description="This route is kept for compatibility." />
      <Card title={params.id}>
        <Link href={`/requests/${params.id}`}><Button>Open canonical request page</Button></Link>
      </Card>
    </PageContainer>
  );
}
