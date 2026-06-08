import { PageContainer, PageHeader } from "@/components/layout";
import { WorkflowTimeline } from "@/components/workflow";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function WorkflowsPage() {
  await requirePermission(PERMISSIONS.SYSTEM_ADMIN);

  const workflowRoutes = [
    { type: "Travel Request", workflow: "Travel Approval workflow", steps: ["Submitted", "Manager Approval", "Finance Approval", "Completed"] },
    { type: "Leave Request", workflow: "Leave Approval workflow", steps: ["Submitted", "Manager Approval", "HR Record", "Completed"] },
    { type: "Purchase Request", workflow: "Procurement workflow", steps: ["Submitted", "Manager Approval", "Procurement Review", "Finance Approval", "Completed"] },
    { type: "Future Request Types", workflow: "Configurable workflow", steps: ["Submitted", "Configured approvals", "Completed"] },
  ];

  return (
    <PageContainer>
      <PageHeader title="Workflows" description="Request-type driven workflow routing foundation." />
      <section className="stack">
        {workflowRoutes.map((route) => (
          <Card key={route.type} title={`${route.type}: ${route.workflow}`}>
            <WorkflowTimeline steps={route.steps.map((step, index) => ({
              title: step,
              status: index === 0 ? "completed" : index === 1 ? "current" : "pending",
            }))} />
          </Card>
        ))}
      </section>
    </PageContainer>
  );
}
