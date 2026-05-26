import Link from "next/link";
import { KpiCard, SlaOverviewCard, StatusSummaryCard } from "@/components/dashboard";
import { PageContainer, PageHeader } from "@/components/layout";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";

export default async function ReportsPage() {
  await requirePermission(PERMISSIONS.REPORTS_VIEW);

  return (
    <PageContainer>
      <PageHeader title="Reports" description="Enterprise operational reporting dashboard." />
      <section className="dashboard-grid">
        <Link className="feature-card" href="/reports/requests"><h2>Request Analytics</h2><p>Volumes, outcomes, departments, and destinations.</p></Link>
        <Link className="feature-card" href="/reports/sla"><h2>SLA Reports</h2><p>Breach rates, average approval time, and at-risk tasks.</p></Link>
        <Link className="feature-card" href="/reports/audit"><h2>Audit Reports</h2><p>Security, workflow, user, and configuration events.</p></Link>
      </section>
      <section className="dashboard-grid">
        <KpiCard title="Total Requests" value={0} description="All visible requests" />
        <KpiCard title="Pending Approvals" value={0} description="Awaiting decision" />
        <KpiCard title="Completion Rate" value="0%" description="Completed requests" />
      </section>
      <section className="stack">
        <StatusSummaryCard items={[]} />
        <SlaOverviewCard onTimeCount={0} atRiskCount={0} overdueCount={0} />
      </section>
    </PageContainer>
  );
}
