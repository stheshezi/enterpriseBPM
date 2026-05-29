import { prisma } from "@/lib/prisma";
import type { AppRole } from "@/types/auth";

export type TenantUserListItem = {
  id: string;
  name: string;
  email: string;
  roles: AppRole[];
  department?: string;
  status: "Active" | "Inactive" | "Invited";
  lastLogin?: string;
};

export async function listTenantUsers(tenantId?: string): Promise<TenantUserListItem[]> {
  const users = await prisma.user.findMany({
    where: tenantId ? { tenantId } : {},
    orderBy: { email: "asc" },
    include: { roles: { include: { role: true } } },
  });

  return users.map((user) => ({
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
    email: user.email,
    roles: user.roles.map((userRole) => userRole.role.name as AppRole),
    department: "N/A",
    status: "Active",
    lastLogin: "Never",
  }));
}

export async function getTenantUserProfile(tenantId: string, userId: string) {
  return prisma.user.findFirst({
    where: { id: userId, tenantId },
    include: { roles: { include: { role: true } } },
  });
}
