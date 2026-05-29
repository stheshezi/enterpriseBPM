import { redirect } from "next/navigation";
import { requireCurrentUser, userCanAny } from "@/lib/access-control";
import type { AppPermission } from "@/types/auth";

export async function requirePermission(permissions: AppPermission | AppPermission[]) {
  const user = await requireCurrentUser();
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

  if (!userCanAny(user, requiredPermissions)) {
    redirect("/unauthorized");
  }

  return user;
}
