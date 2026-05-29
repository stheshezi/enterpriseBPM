import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/layout";
import { RequestCard } from "@/components/requests";
import { AuditTimeline, WorkflowTimeline } from "@/components/workflow";
import { Button, Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { getRequestDetail } from "@/lib/workflow-read-model";

export default async function RequestDetailPage({ params }: { params: { requestId: string } }) {
  const user = await requirePermission(PERMISSIONS.REQUESTS_VIEW_OWN);
  const request = await getRequestDetail(params.requestId, user);

  return (
    <PageContainer>
      <PageHeader
        title={`Request ${request.requestNumber}`}
        description="Single source of truth for request lifecycle state."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Requests", href: "/requests" }, { label: request.requestNumber }]}
        primaryAction={<Link href={`/requests/${params.requestId}/edit`}><Button>Edit</Button></Link>}
        secondaryAction={<Link href={`/requests/${params.requestId}/audit`}><Button variant="outline">Audit</Button></Link>}
      />
      <div className="stack">
        <RequestCard
          requestNumber={request.requestNumber}
          purpose={request.purpose}
          status={request.status}
          requester={request.requester}
          destination={request.destination}
          dateRange={request.dateRange}
          estimatedCost={request.estimatedCost}
          currentStep={request.currentStep}
        />
        <Card title="Current Assignment">
          {request.currentTask ? (
            <div className="profile-grid">
              <span>Step <strong>{request.currentTask.stepName}</strong></span>
              <span>Status <strong>{request.currentTask.status}</strong></span>
              <span>Assignee <strong>{request.currentTask.assignee}</strong></span>
              <span>Due <strong>{request.currentTask.dueAt}</strong></span>
            </div>
          ) : (
            <div className="component-state">No active assignment.</div>
          )}
        </Card>
        <Card title="Request Data">
          <div className="profile-grid">
            {Object.entries(request.payload).map(([key, value]) => (
              <span key={key}>{key}<strong>{String(value)}</strong></span>
            ))}
          </div>
        </Card>
        <WorkflowTimeline steps={request.timeline} />
        <AuditTimeline events={request.auditEvents} />
      </div>
    </PageContainer>
  );
}
