"use client";

import type { AppPermission } from "@/types/auth";
import { useCurrentUser } from "@/hooks/use-current-user";

export function usePermissions() {
  const { user } = useCurrentUser();

  return {
    permissions: user?.permissions ?? [],
    can(permission: AppPermission) {
      return Boolean(user?.permissions.includes(permission));
    },
    canAny(permissions: AppPermission[]) {
      return permissions.some((permission) => user?.permissions.includes(permission));
    },
  };
}
