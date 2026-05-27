import { delegationResolver } from "@/modules/delegation/delegation-resolver";
import { hierarchyTraversalService } from "@/modules/authority/hierarchy-traversal-service";
import { approvalLimitResolver } from "@/modules/rules/approval-limit-resolver";

export type AuthorityResolutionInput = {
  tenantId: string;
  requesterId: string;
  authorityLevelId: string;
};

export type AuthorityResolution = {
  authorityLevelId: string;
  authorityLevelCode: string;
  authorityOwnerUserId: string;
  assignedToUserId: string;
  delegated: boolean;
};

export class AuthorityResolver {
  async resolve(input: AuthorityResolutionInput): Promise<AuthorityResolution> {
    const authorityOwner = await hierarchyTraversalService.findAuthorityOwner(input);

    if (!authorityOwner) {
      throw new Error("No active authority owner found.");
    }

    const chain = await approvalLimitResolver.getChainToRank(input.tenantId, Number.MAX_SAFE_INTEGER);
    const authorityLevel = chain.find((level) => level.id === input.authorityLevelId);

    if (!authorityLevel) {
      throw new Error("Authority level not found.");
    }

    const delegation = await delegationResolver.resolve({
      tenantId: input.tenantId,
      authorityOwnerUserId: authorityOwner.id,
      authorityLevelId: input.authorityLevelId,
    });

    return {
      authorityLevelId: input.authorityLevelId,
      authorityLevelCode: authorityLevel.code,
      authorityOwnerUserId: authorityOwner.id,
      assignedToUserId: delegation?.delegatedToUserId ?? authorityOwner.id,
      delegated: Boolean(delegation),
    };
  }
}

export const authorityResolver = new AuthorityResolver();
