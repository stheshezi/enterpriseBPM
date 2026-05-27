import { prisma } from "@/lib/prisma";
import { complianceLogger } from "@/modules/audit/compliance-logger";

export class ActingAuthorityService {
  async createActingAuthority({
    tenantId,
    delegatedFromUserId,
    delegatedToUserId,
    authorityLevelId,
    startDate,
    endDate,
    reason,
    createdBy,
  }: {
    tenantId: string;
    delegatedFromUserId: string;
    delegatedToUserId: string;
    authorityLevelId: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
    createdBy?: string;
  }) {
    if (endDate < startDate) {
      throw new Error("Delegation end date must be on or after the start date.");
    }

    const delegation = await prisma.delegation.create({
      data: {
        tenantId,
        delegatedFromUserId,
        delegatedToUserId,
        authorityLevelId,
        startDate,
        endDate,
        reason,
        createdBy,
      },
    });

    await complianceLogger.log({
      tenantId,
      actorUserId: createdBy,
      entityType: "Delegation",
      entityId: delegation.id,
      action: "DELEGATION_CREATED",
      newValue: {
        delegatedFromUserId,
        delegatedToUserId,
        authorityLevelId,
        startDate,
        endDate,
        reason,
      },
    });

    return delegation;
  }
}

export const actingAuthorityService = new ActingAuthorityService();
