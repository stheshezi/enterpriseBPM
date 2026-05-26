"use client";

import React, { useState } from "react";
import { PERMISSIONS } from "@/config/permissions";
import { Sidebar, SidebarNavItem } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { AppPermission } from "@/types/auth";

const defaultNavItems: SidebarNavItem[] = [
  { href: "/", label: "Dashboard", marker: "D" },
  { href: "/requests", label: "Requests", marker: "R", permission: PERMISSIONS.REQUESTS_CREATE },
  { href: "/tasks", label: "My Tasks", marker: "T", permission: PERMISSIONS.TASKS_VIEW_ASSIGNED },
  { href: "/approvals", label: "Approvals", marker: "A", permission: PERMISSIONS.REQUESTS_APPROVE_MANAGER },
  { href: "/reports", label: "Reports", marker: "P", permission: PERMISSIONS.REPORTS_VIEW },
  { href: "/admin", label: "Administration", marker: "U", permission: PERMISSIONS.USERS_VIEW },
  { href: "/settings", label: "Settings", marker: "S", permission: PERMISSIONS.TENANT_MANAGE },
];

export interface AppShellProps {
  children: React.ReactNode;
  tenantName?: string;
  userName?: string;
  permissions?: AppPermission[];
  navItems?: SidebarNavItem[];
}

export function AppShell({
  children,
  tenantName,
  userName,
  permissions = [],
  navItems = defaultNavItems,
}: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar tenantName={tenantName} permissions={permissions} items={navItems} isCollapsed={isCollapsed} />
      <div className="app-shell__content">
        <Topbar tenantName={tenantName} userName={userName} />
        <button className="sidebar-toggle" type="button" onClick={() => setIsCollapsed((value) => !value)} aria-label="Toggle sidebar">
          {isCollapsed ? "Expand" : "Collapse"}
        </button>
        {children}
      </div>
    </div>
  );
}
