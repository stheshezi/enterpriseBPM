import { RoleDashboard, SuperAdminDashboard } from "@/components/dashboard";
import { PageContainer } from "@/components/layout";
import { getRoleDashboardData, getSuperAdminDashboardData } from "@/lib/dashboard-data";
import { requireCurrentUser } from "@/lib/access-control";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const isSuperAdmin = user.roles.includes("SUPER_ADMIN");

  if (isSuperAdmin) {
    const data = await getSuperAdminDashboardData(user);
    return (
      <PageContainer>
        <SuperAdminDashboard data={data} />
      </PageContainer>
    );
  }

  const data = await getRoleDashboardData(user);

  return (
    <PageContainer>
      <RoleDashboard data={data} />
    </PageContainer>
  );
}
