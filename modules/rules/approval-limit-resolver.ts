import { prisma } from "@/lib/prisma";

const DEFAULT_AUTHORITY_LIMITS = [
  { code: "LM", name: "Line Manager", rankOrder: 1, approvalLimit: 50_000 },
  { code: "BUMA", name: "Business Unit Manager", rankOrder: 2, approvalLimit: 500_000 },
  { code: "C5", name: "C5 Executive", rankOrder: 3, approvalLimit: 5_000_000 },
  { code: "CEO", name: "Chief Executive Officer", rankOrder: 4, approvalLimit: null },
] as const;

export class ApprovalLimitResolver {
  async ensureDefaults(tenantId: string) {
    for (const level of DEFAULT_AUTHORITY_LIMITS) {
      await prisma.authorityLevel.upsert({
        where: { tenantId_code: { tenantId, code: level.code } },
        update: {
          name: level.name,
          rankOrder: level.rankOrder,
          approvalLimit: level.approvalLimit,
        },
        create: {
          tenantId,
          code: level.code,
          name: level.name,
          rankOrder: level.rankOrder,
          approvalLimit: level.approvalLimit,
        },
      });
    }
  }

  async resolveRequiredLevel(tenantId: string, amount: number) {
    await this.ensureDefaults(tenantId);

    const levels = await prisma.authorityLevel.findMany({
      where: { tenantId },
      orderBy: { rankOrder: "asc" },
    });

    const level = levels.find((candidate) => candidate.approvalLimit === null || amount <= candidate.approvalLimit);

    if (!level) {
      throw new Error(`No authority level can approve amount ${amount}.`);
    }

    return level;
  }

  async getChainToRank(tenantId: string, requiredRankOrder: number) {
    await this.ensureDefaults(tenantId);

    return prisma.authorityLevel.findMany({
      where: {
        tenantId,
        rankOrder: { lte: requiredRankOrder },
      },
      orderBy: { rankOrder: "asc" },
    });
  }
}

export const approvalLimitResolver = new ApprovalLimitResolver();
