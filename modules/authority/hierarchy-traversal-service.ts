import { prisma } from "@/lib/prisma";

const MAX_HIERARCHY_DEPTH = 25;

export class HierarchyTraversalService {
  async findAuthorityOwner({
    requesterId,
    tenantId,
    authorityLevelId,
  }: {
    requesterId: string;
    tenantId: string;
    authorityLevelId: string;
  }) {
    const visited = new Set<string>();
    let current = await prisma.user.findUnique({
      where: { id: requesterId },
      select: { id: true, managerId: true },
    });

    for (let depth = 0; depth < MAX_HIERARCHY_DEPTH && current?.managerId; depth += 1) {
      if (visited.has(current.id)) {
        throw new Error("Circular reporting hierarchy detected.");
      }

      visited.add(current.id);

      const manager = await prisma.user.findFirst({
        where: { id: current.managerId, active: true },
        select: { id: true, tenantId: true, managerId: true, authorityLevelId: true },
      });

      if (!manager || manager.tenantId !== tenantId) break;
      if (manager.authorityLevelId === authorityLevelId) return manager;

      current = manager;
    }

    const activeUsers = await prisma.user.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" },
    });

    return activeUsers.find((user) => user.tenantId === tenantId && user.authorityLevelId === authorityLevelId) ?? null;
  }

  async snapshotChain(requesterId: string, tenantId: string) {
    const chain = [];
    const visited = new Set<string>();
    let current = await prisma.user.findFirst({
      where: { id: requesterId },
      select: {
        id: true,
        email: true,
        tenantId: true,
        managerId: true,
        authorityLevel: true,
      },
    });

    for (let depth = 0; depth < MAX_HIERARCHY_DEPTH && current; depth += 1) {
      if (visited.has(current.id)) break;
      visited.add(current.id);
      chain.push({
        userId: current.id,
        email: current.email,
        authorityLevel: current.authorityLevel?.code ?? null,
        managerId: current.managerId,
      });

      if (!current.managerId) break;
      const next = await prisma.user.findFirst({
        where: { id: current.managerId },
        select: {
          id: true,
          email: true,
          managerId: true,
          tenantId: true,
          authorityLevel: true,
        },
      });
      current = next?.tenantId === tenantId ? next : null;
    }

    return chain;
  }
}

export const hierarchyTraversalService = new HierarchyTraversalService();
