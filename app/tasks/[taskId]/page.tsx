import { PageContainer, PageHeader } from "@/components/layout";
import { WorkflowTimeline, AuditTimeline } from "@/components/workflow";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function TaskDetailPage({ params }: { params: { taskId: string } }) {
  await requirePermission(PERMISSIONS.TASKS_VIEW_ASSIGNED);

  return (
    <PageContainer>
      <PageHeader title={`Task ${params.taskId}`} description="Workflow execution page for assigned work." />
      <div className="stack">
        <Card title="Task Summary"><div className="component-state">Task type, due date, linked request, and SLA state will render here.</div></Card>
        <WorkflowTimeline steps={[]} />
        <Card title="Approval Decision Panel"><div className="component-state">Approve and reject controls activate for the current assigned approver.</div></Card>
        <AuditTimeline events={[]} />
      </div>
    </PageContainer>
  );
}
