import { SlaOverviewCard } from "@/components/dashboard";
import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function SlaReportsPage() {
  await requirePermission(PERMISSIONS.REPORTS_VIEW);

  return (
    <PageContainer>
      <PageHeader title="SLA Reports" description="Monitor overdue approvals, breach rate, average approval time, and at-risk work." />
      <SlaOverviewCard onTimeCount={0} atRiskCount={0} overdueCount={0} />
      <Card title="SLA risk"><div className="component-state">At-risk tasks and breach trends will render here.</div></Card>
    </PageContainer>
  );
}
