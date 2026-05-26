"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { AppShell } from "@/components/layout";
import { useCurrentUser } from "@/hooks/use-current-user";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthenticatedFrame>{children}</AuthenticatedFrame>
      </ThemeProvider>
    </SessionProvider>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("bpm-theme") === "dark" ? "dark" : "light";
    setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("bpm-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

type ThemeContextValue = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function AuthenticatedFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, status } = useCurrentUser();
  const isPublicRoute = pathname.startsWith("/login") || pathname.startsWith("/unauthorized");

  if (isPublicRoute || status !== "authenticated" || !user) {
    return <>{children}</>;
  }

  return (
    <AppShell
      tenantName={user.tenantDomain ?? "Super Admin Tenant"}
      userName={user.name ?? user.email}
      permissions={user.permissions}
    >
      {children}
    </AppShell>
  );
}
