import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AppRole } from "@/types/auth";
import { RoleBasedDashboard } from "@/components/dashboard/RoleBasedDashboard";

/**
 * Dynamic role‑specific dashboard.
 * URL: /dashboard/[role]
 */
export default async function RoleDashboardPage({ params }: { params: { role: string } }) {
  const session = await getServerSession(authOptions);

  // Not authenticated → back to login
  if (!session?.user) {
    redirect("/login");
  }

  // Normalise role name
  const roleParam = params.role.toUpperCase() as AppRole;

  // Verify that the user actually has this role
  const userRoles = (session.user.roles ?? []) as AppRole[];
  if (!userRoles.includes(roleParam)) {
    // Unauthorized for this specific view – go to generic dashboard which will redirect again
    redirect("/dashboard");
  }

  // Simple role‑specific placeholder UI – can be expanded later
  return (
    <section className="debt-dashboard">
      <h1>{roleParam.replace("_", " ")} Dashboard</h1>
      <p>Welcome, {session.user.name ?? session.user.email}!</p>
      {/* Future: fetch and display role‑specific data here */}
    </section>
  );
}
