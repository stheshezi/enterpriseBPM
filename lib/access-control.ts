import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { AppPermission, CurrentUser } from "@/types/auth";

export function userCan(
  user: Pick<CurrentUser, "permissions"> | null | undefined,
  permission: AppPermission,
) {
  return Boolean(user?.permissions.includes(permission));
}

export function userCanAny(
  user: Pick<CurrentUser, "permissions"> | null | undefined,
  permissions: AppPermission[],
) {
  return permissions.some((permission) => userCan(user, permission));
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    tenantId: session.user.tenantId,
    tenantDomain: session.user.tenantDomain,
    roles: session.user.roles,
    permissions: session.user.permissions,
  };
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requirePermission(permission: AppPermission) {
  const user = await requireCurrentUser();
  if (!userCan(user, permission)) redirect("/unauthorized");
  return user;
}
