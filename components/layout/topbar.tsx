"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import React, { useContext, useState } from "react";
import { ThemeContext } from "@/app/providers";
import { Button } from "@/components/ui";

export interface TopbarProps {
  tenantName?: string;
  userName?: string;
  environment?: string;
  notificationCount?: number;
  onSearch?: (query: string) => void;
  onSignOut?: () => void;
}

export function Topbar({
  tenantName,
  userName,
  environment,
  notificationCount = 0,
  onSearch,
  onSignOut,
}: TopbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === "dark";

  return (
    <header className="layout-topbar">
      <div className="layout-topbar__search">
        <span aria-hidden="true">/</span>
        <input aria-label="Search" placeholder="Search requests, tasks, users" onChange={(event) => onSearch?.(event.target.value)} />
      </div>
      <div className="layout-topbar__meta">
        {environment ? <span className="environment-badge">{environment}</span> : null}
        {tenantName ? <strong>{tenantName}</strong> : null}
        <button type="button" aria-label={`${notificationCount} notifications`} className="notification-button">
          {notificationCount}
        </button>
        <div className="user-menu">
          <button className="user-menu__trigger" type="button" onClick={() => setIsMenuOpen((value) => !value)} aria-expanded={isMenuOpen}>
            <span>{userName?.slice(0, 1).toUpperCase() ?? "U"}</span>
            <strong>{userName ?? "User"}</strong>
          </button>
          {isMenuOpen ? (
            <div className="user-menu__panel">
              <Link href="/profile">Profile</Link>
              <Link href="/profile/preferences">Preferences</Link>
              <label className="theme-switch">
                <span>Dark mode</span>
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={(event) => themeContext?.setTheme(event.target.checked ? "dark" : "light")}
                />
              </label>
              <Button variant="ghost" size="sm" onClick={onSignOut ?? (() => signOut({ callbackUrl: "/login" }))}>Sign out</Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
