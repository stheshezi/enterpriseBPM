"use client";

import { AppRole } from "@/types/auth";
import { useRouter } from "next/navigation";

/**
 * RoleBasedDashboard – renders a simple role‑specific view.
 */
export function RoleBasedDashboard({ userRoles }: { userRoles: AppRole[] }) {
  // const router = useRouter(); // No redirect needed – just render content
  const primaryRole = userRoles[0] ?? "REQUESTER";

  const roleContent: Record<AppRole, JSX.Element> = {
    SUPER_ADMIN: (
      <div className="debt-dashboard">
        <h2>Super Admin Dashboard</h2>
        <p>Manage tenants, users and system settings.</p>
      </div>
    ),
    ADMIN: (
      <div className="debt-dashboard">
        <h2>Admin Dashboard</h2>
        <p>Overview of users and tenant configuration.</p>
      </div>
    ),
    IT_SUPPORT: (
      <div className="debt-dashboard">
        <h2>IT Support Dashboard</h2>
        <p>Support tickets and user assistance.</p>
      </div>
    ),
    MANAGER: (
      <div className="debt-dashboard">
        <h2>Manager Dashboard</h2>
        <p>Approve requests and monitor approvals.</p>
      </div>
    ),
    FINANCE: (
      <div className="debt-dashboard">
        <h2>Finance Dashboard</h2>
        <p>View financial approvals and reports.</p>
      </div>
    ),
    REQUESTER: (
      <div className="debt-dashboard">
        <h2>Requester Dashboard</h2>
        <p>Create and track workflow requests across request types.</p>
      </div>
    ),
  };

  return roleContent[primaryRole] ?? roleContent["REQUESTER"];
}
