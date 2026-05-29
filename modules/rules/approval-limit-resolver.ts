import { prisma } from "@/lib/prisma";

const DEFAULT_AUTHORITY_LIMITS = [
  { code: "LM", name: "Line Manager", rankOrder: 1, approvalLimit: 50_000 },
  { code: "BUMA", name: "Business Unit Manager", rankOrder: 2, approvalLimit: 500_000 },
  { code: "C5", name: "C5 Executive", rankOrder: 3, approvalLimit: 5_000_000 },
  { code: "CEO", name: "Chief Executive Officer", rankOrder: 4, approvalLimit: null },
] as const;

export class ApprovalLimitResolver {
  async ensureDefaults(tenantId: string) {
    const existingLevels = await prisma.authorityLevel.findMany();

    for (const level of DEFAULT_AUTHORITY_LIMITS) {
      const existing = existingLevels.find((candidate) => candidate.tenantId === tenantId && candidate.code === level.code);

      if (!existing) {
        await prisma.authorityLevel.create({
          data: {
            tenantId,
            code: level.code,
            name: level.name,
            rankOrder: level.rankOrder,
            approvalLimit: level.approvalLimit,
          },
        });
      }
    }
  }

  async resolveRequiredLevel(tenantId: string, amount: number) {
    await this.ensureDefaults(tenantId);

    const levels = await prisma.authorityLevel.findMany({
      orderBy: { rankOrder: "asc" },
    });
    const tenantLevels = levels.filter((level) => level.tenantId === tenantId);

    const level = tenantLevels.find((candidate) => candidate.approvalLimit === null || amount <= candidate.approvalLimit);

    if (!level) {
      throw new Error(`No authority level can approve amount ${amount}.`);
    }

    return level;
  }

  async getChainToRank(tenantId: string, requiredRankOrder: number) {
    await this.ensureDefaults(tenantId);

    const levels = await prisma.authorityLevel.findMany({ orderBy: { rankOrder: "asc" } });
    return levels.filter((level) => level.tenantId === tenantId && level.rankOrder <= requiredRankOrder);
  }
}

export const approvalLimitResolver = new ApprovalLimitResolver();
