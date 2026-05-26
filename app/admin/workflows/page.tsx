import { PageContainer, PageHeader } from "@/components/layout";
import { WorkflowTimeline } from "@/components/workflow";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function WorkflowsPage() {
  await requirePermission(PERMISSIONS.SYSTEM_ADMIN);

  return (
    <PageContainer>
      <PageHeader title="Workflows" description="Phase One workflow definitions are read-only and system-managed." />
      <Card title="Travel Request Workflow">
        <WorkflowTimeline steps={[
          { title: "Submitted", status: "completed" },
          { title: "Manager Approval", status: "current" },
          { title: "Finance Approval", status: "pending" },
          { title: "Approved", status: "pending" },
          { title: "Completed", status: "pending" },
        ]} />
      </Card>
    </PageContainer>
  );
}
