import Link from "next/link";
import { PERMISSIONS } from "@/config/permissions";
import { ROLE_DEFINITIONS } from "@/config/roles";
import { requireCurrentUser, userCan } from "@/lib/access-control";

const dashboardCards = [
  {
    title: "New travel request",
    body: "Submit a trip and send it straight into approval.",
    href: "/requests/new",
    permission: PERMISSIONS.REQUESTS_CREATE,
  },
  {
    title: "User command center",
    body: "Review users, assigned roles, and permission coverage.",
    href: "/admin/users",
    permission: PERMISSIONS.USERS_VIEW,
  },
  {
    title: "Manager approvals",
    body: "Approve operational travel requests waiting on managers.",
    href: "/approvals",
    permission: PERMISSIONS.REQUESTS_APPROVE_MANAGER,
  },
  {
    title: "Finance approvals",
    body: "Review cost centers, budgets, and finance approval tasks.",
    href: "/approvals",
    permission: PERMISSIONS.REQUESTS_APPROVE_FINANCE,
  },
  {
    title: "Audit and controls",
    body: "Inspect tenant activity and sensitive access events.",
    href: "/admin/audit-logs",
    permission: PERMISSIONS.AUDIT_VIEW,
  },
  {
    title: "System administration",
    body: "Godlevel tenant, role, and platform controls.",
    href: "/admin",
    permission: PERMISSIONS.SYSTEM_ADMIN,
  },
] as const;

export default async function HomePage() {
  const user = await requireCurrentUser();
  const visibleCards = dashboardCards.filter((card) => userCan(user, card.permission));

  return (
    <main className="page-shell">
      <section className="toolbar">
        <div>
          <p className="eyebrow">Enterprise BPM</p>
          <h1>{user.name ?? user.email}</h1>
        </div>
      </section>

      <section className="identity-strip">
        <div>
          <span>Tenant</span>
          <strong>{user.tenantDomain ?? user.tenantId}</strong>
        </div>
        <div>
          <span>Roles</span>
          <strong>{user.roles.map((role) => ROLE_DEFINITIONS[role].label).join(", ")}</strong>
        </div>
        <div>
          <span>Permissions</span>
          <strong>{user.permissions.length}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        {visibleCards.map((card) => (
          <Link className="feature-card" href={card.href} key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
