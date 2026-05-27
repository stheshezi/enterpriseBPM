import type { AuthorityLevel, RequestStatus } from "@prisma/client";
import { approvalLimitResolver } from "@/modules/rules/approval-limit-resolver";

const STATUS_BY_AUTHORITY_CODE: Record<string, RequestStatus> = {
  LM: "PENDING_LM",
  BUMA: "PENDING_BUMA",
  C5: "PENDING_C5",
  CEO: "PENDING_CEO",
};

export class TransitionEngine {
  pendingStatusForAuthority(code: string): RequestStatus {
    return STATUS_BY_AUTHORITY_CODE[code] ?? "PENDING_LM";
  }

  stepNameForAuthority(code: string) {
    return `${code}_APPROVAL`;
  }

  async nextAuthorityLevel({
    tenantId,
    currentAuthorityLevelId,
    requiredAuthorityLevel,
  }: {
    tenantId: string;
    currentAuthorityLevelId?: string | null;
    requiredAuthorityLevel: AuthorityLevel;
  }) {
    const chain = await approvalLimitResolver.getChainToRank(tenantId, requiredAuthorityLevel.rankOrder);

    if (!currentAuthorityLevelId) return chain[0] ?? null;

    const currentIndex = chain.findIndex((level) => level.id === currentAuthorityLevelId);
    return currentIndex === -1 ? chain[0] ?? null : chain[currentIndex + 1] ?? null;
  }
}

export const transitionEngine = new TransitionEngine();
