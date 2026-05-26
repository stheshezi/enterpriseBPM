import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { RequestCard } from "@/components/requests";
import { AuditTimeline, WorkflowTimeline } from "@/components/workflow";
import { Button, Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function RequestDetailPage({ params }: { params: { requestId: string } }) {
  await requirePermission(PERMISSIONS.REQUESTS_VIEW_OWN);

  return (
    <PageContainer>
      <PageHeader
        title={`Request ${params.requestId}`}
        description="Single source of truth for request lifecycle state."
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Requests", href: "/requests" }, { label: params.requestId }]}
        primaryAction={<Link href={`/requests/${params.requestId}/edit`}><Button>Edit</Button></Link>}
        secondaryAction={<Link href={`/requests/${params.requestId}/audit`}><Button variant="outline">Audit</Button></Link>}
      />
      <div className="stack">
        <RequestCard requestNumber={params.requestId} purpose="Travel request lifecycle" status="SUBMITTED" requester="Current user" destination="Pending data" dateRange="Pending dates" estimatedCost="Pending cost" currentStep="Manager Approval" />
        <Card title="Current Assignment"><div className="component-state">Assigned approver, due date, SLA state, and pending action will render here.</div></Card>
        <WorkflowTimeline steps={[
          { title: "Submitted", status: "completed" },
          { title: "Manager Approval", status: "current" },
          { title: "Finance Approval", status: "pending" },
          { title: "Approved", status: "pending" },
        ]} />
        <AuditTimeline events={[]} />
      </div>
    </PageContainer>
  );
}
