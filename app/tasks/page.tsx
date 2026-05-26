import { PageContainer, PageHeader } from "@/components/layout";
import { PendingTasksCard } from "@/components/dashboard";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function TasksPage() {
  await requirePermission(PERMISSIONS.TASKS_VIEW_ASSIGNED);

  return (
    <PageContainer>
      <PageHeader title="My Tasks" description="Actionable workflow assignments filtered to the current user." />
      <PendingTasksCard tasks={[]} />
    </PageContainer>
  );
}
