import Link from "next/link";
import { KpiCard, SlaOverviewCard, StatusSummaryCard } from "@/components/dashboard";
import { PageContainer, PageHeader } from "@/components/layout";
import { PERMISSIONS } from "@/config/permissions";
import { requireAnyPermission } from "@/lib/access-control";
import { getSuperAdminDashboardData } from "@/lib/dashboard-data";

export default async function ReportsPage() {
  const user = await requireAnyPermission(PERMISSIONS.REPORTS_VIEW);
  const data = await getSuperAdminDashboardData(user);
  const totalRequests = data.kpis.find((kpi) => kpi.id === "requests")?.value ?? 0;
  const pendingApprovals = data.kpis.find((kpi) => kpi.id === "pending")?.value ?? 0;
  const completionRate = data.kpis.find((kpi) => kpi.id === "completion")?.value ?? "0%";

  return (
    <PageContainer>
      <PageHeader title="Reports" description="Enterprise operational reporting dashboard." />
      <section className="dashboard-grid">
        <Link className="feature-card" href="/reports/requests"><h2>Request Analytics</h2><p>Volumes, outcomes, departments, and destinations.</p></Link>
        <Link className="feature-card" href="/reports/sla"><h2>SLA Reports</h2><p>Breach rates, average approval time, and at-risk tasks.</p></Link>
        <Link className="feature-card" href="/reports/audit"><h2>Audit Reports</h2><p>Security, workflow, user, and configuration events.</p></Link>
      </section>
      <section className="dashboard-grid">
        <KpiCard title="Total Requests" value={totalRequests} description="All visible requests" />
        <KpiCard title="Pending Approvals" value={pendingApprovals} description="Awaiting decision" />
        <KpiCard title="Completion Rate" value={completionRate} description="Completed requests" />
      </section>
      <section className="stack">
        <StatusSummaryCard items={data.statusSummary.map((item) => ({ status: item.label, count: item.count }))} />
        <SlaOverviewCard
          onTimeCount={Number(data.totals.approved)}
          atRiskCount={Number(pendingApprovals)}
          overdueCount={data.totals.overdueTasks}
        />
      </section>
    </PageContainer>
  );
}
