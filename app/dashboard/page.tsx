import { SuperAdminDashboard } from "@/components/dashboard";
import { PageContainer } from "@/components/layout";
import { getSuperAdminDashboardData } from "@/lib/dashboard-data";
import { requireCurrentUser } from "@/lib/access-control";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const data = await getSuperAdminDashboardData(user);

  return (
    <PageContainer>
      <SuperAdminDashboard data={data} />
    </PageContainer>
  );
}
