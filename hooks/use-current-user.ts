"use client";

import { useSession } from "next-auth/react";
import type { CurrentUser } from "@/types/auth";

export function useCurrentUser() {
  const session = useSession();
  const user = session.data?.user
    ? ({
        id: session.data.user.id,
        email: session.data.user.email ?? "",
        name: session.data.user.name,
        tenantId: session.data.user.tenantId,
        tenantDomain: session.data.user.tenantDomain,
        roles: session.data.user.roles,
        permissions: session.data.user.permissions,
      } satisfies CurrentUser)
    : null;

  return { ...session, user };
}
