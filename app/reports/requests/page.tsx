import { KpiCard } from "@/components/dashboard";
import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function RequestReportsPage() {
  await requirePermission(PERMISSIONS.REPORTS_VIEW);

  return (
    <PageContainer>
      <PageHeader title="Request Reports" description="Detailed request analytics by department, destination, and processing time." />
      <section className="dashboard-grid">
        <KpiCard title="Total Requests" value={0} />
        <KpiCard title="Approved Requests" value={0} />
        <KpiCard title="Rejected Requests" value={0} />
      </section>
      <Card title="Breakdowns"><div className="component-state">Requests by department and destination will render here.</div></Card>
    </PageContainer>
  );
}
