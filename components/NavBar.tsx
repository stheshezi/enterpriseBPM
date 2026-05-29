"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { AppPermission } from "@/types/auth";

type NavItem = {
  href: string;
  label: string;
  permissions?: AppPermission[];
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/requests", label: "Requests", permissions: [PERMISSIONS.REQUESTS_VIEW_OWN, PERMISSIONS.REQUESTS_VIEW_TENANT] },
  { href: "/tasks", label: "Tasks", permissions: [PERMISSIONS.TASKS_VIEW_ASSIGNED] },
  {
    href: "/approvals",
    label: "Approvals",
    permissions: [PERMISSIONS.REQUESTS_APPROVE_MANAGER, PERMISSIONS.REQUESTS_APPROVE_FINANCE],
  },
  { href: "/reports", label: "Reports", permissions: [PERMISSIONS.REPORTS_VIEW] },
  { href: "/admin", label: "Administration", permissions: [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_MANAGE, PERMISSIONS.ROLES_MANAGE] },
  { href: "/settings", label: "Settings", permissions: [PERMISSIONS.TENANT_MANAGE] },
];

function canView(userPermissions: AppPermission[] | undefined, item: NavItem) {
  return !item.permissions || item.permissions.some((permission) => userPermissions?.includes(permission));
}

export default function NavBar() {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  return (
    <nav className="w-64 min-h-screen bg-gray-800 p-4 flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4">BPM Platform</h2>
      <div className="flex-1 space-y-2">
        {navItems.filter((item) => canView(user?.permissions, item)).map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              className={`block py-2 px-4 rounded transition-colors ${
                active ? "bg-teal-600 text-white" : "text-gray-200 hover:bg-teal-700"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
