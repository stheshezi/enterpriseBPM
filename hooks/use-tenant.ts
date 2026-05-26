"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

export function useTenant() {
  const { user } = useCurrentUser();

  return {
    tenantId: user?.tenantId ?? null,
    tenantDomain: user?.tenantDomain ?? null,
  };
}
