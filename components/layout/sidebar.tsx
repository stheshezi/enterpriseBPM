"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import type { AppPermission } from "@/types/auth";

export type SidebarNavItem = {
  href: string;
  label: string;
  marker: string;
  permission?: AppPermission;
};

export interface SidebarProps {
  tenantName?: string;
  permissions?: AppPermission[];
  items: SidebarNavItem[];
  isCollapsed?: boolean;
  onLogout?: () => void;
}

export function Sidebar({
  tenantName = "Tenant",
  permissions = [],
  items,
  isCollapsed = false,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const visibleItems = items.filter((item) => !item.permission || permissions.includes(item.permission));

  return (
    <aside className={`layout-sidebar ${isCollapsed ? "layout-sidebar--collapsed" : ""}`} aria-label="Primary navigation">
      <div className="layout-sidebar__brand">
        <span>EB</span>
        {!isCollapsed ? (
          <div>
            <strong>Enterprise BPM</strong>
            <small>{tenantName}</small>
          </div>
        ) : null}
      </div>

      <nav className="layout-sidebar__nav">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "is-active" : ""}
              href={item.href}
              key={`${item.href}-${item.label}`}
            >
              <span className="nav-marker">{item.marker}</span>
              {!isCollapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="layout-sidebar__footer">
        <Button variant="outline" size={isCollapsed ? "icon" : "md"} onClick={onLogout ?? (() => signOut({ callbackUrl: "/login" }))}>
          {isCollapsed ? "S" : "Sign out"}
        </Button>
      </div>
    </aside>
  );
}
