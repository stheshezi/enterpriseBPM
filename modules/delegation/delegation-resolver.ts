import { prisma } from "@/lib/prisma";

export class DelegationResolver {
  async resolve({
    tenantId,
    authorityOwnerUserId,
    authorityLevelId,
    at = new Date(),
  }: {
    tenantId: string;
    authorityOwnerUserId: string;
    authorityLevelId: string;
    at?: Date;
  }) {
    return prisma.delegation.findFirst({
      where: {
        tenantId,
        delegatedFromUserId: authorityOwnerUserId,
        authorityLevelId,
        active: true,
        startDate: { lte: at },
        endDate: { gte: at },
        delegatedTo: { active: true },
      },
      include: { delegatedTo: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const delegationResolver = new DelegationResolver();
