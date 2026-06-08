import { PrismaClient, AuthorityLevel, Responsibility, ResponsibilityAssignment } from '@prisma/client';

const prisma = new PrismaClient();

export type ResponsibilityResolution = {
  authorityLevelId: string;
  authorityLevelCode: string;
  authorityOwnerUserId: string;
  assignedToUserId: string;
  delegated: boolean;
};

/**
 * Resolve a responsibility (formerly authority) based on the authority level code.
 *
 * The function performs the following steps:
 *   1. Look up the AuthorityLevel by its code and tenantId.
 *   2. Find the Responsibility that matches the same code.
 *   3. Retrieve the ResponsibilityAssignment for that Responsibility (primary and optional delegate).
 *   4. Return the IDs required by the workflow engine.
 *
 * This implementation assumes a 1‑to‑1 mapping between AuthorityLevel.code and
 * Responsibility.code. Adjust the logic if your data model differs.
 */
export const resolveResponsibility = async (input: {
  tenantId: string;
  authorityLevelId?: string;
  authorityLevelCode?: string;
}): Promise<ResponsibilityResolution> => {
  tenantId: string;
  authorityLevelCode: string;
}): Promise<ResponsibilityResolution> => {
  const { tenantId, authorityLevelId, authorityLevelCode: inputCode } = input;
  let authorityLevelCode = inputCode;
  // If code not provided, fetch it using the authorityLevelId
  if (!authorityLevelCode && authorityLevelId) {
    const level = await prisma.authorityLevel.findUnique({ where: { id: authorityLevelId, tenantId } });
    if (!level) {
      throw new Error(`Authority level with id ${authorityLevelId} not found for tenant ${tenantId}`);
    }
    authorityLevelCode = level.code;
  }
  if (!authorityLevelCode) {
    throw new Error('Either authorityLevelCode or authorityLevelId must be provided');
  }

  // 1. Find the authority level record to obtain its ID.
  const authorityLevel = await prisma.authorityLevel.findFirst({
    where: { tenantId, code: authorityLevelCode },
  });
  if (!authorityLevel) {
    throw new Error(`Authority level with code ${authorityLevelCode} not found for tenant ${tenantId}`);
  }

  // 2. Find the responsibility record that corresponds to this code.
  const responsibility = await prisma.responsibility.findFirst({
    where: { tenantId, code: authorityLevelCode },
  });
  if (!responsibility) {
    throw new Error(`Responsibility with code ${authorityLevelCode} not found for tenant ${tenantId}`);
  }

  // 3. Find the assignment (primary & optional delegate).
  const assignment = await prisma.responsibilityAssignment.findFirst({
    where: { tenantId, responsibilityId: responsibility.id },
  });

  if (!assignment) {
    throw new Error(`No responsibility assignment configured for ${authorityLevelCode} in tenant ${tenantId}`);
  }

  const primaryUserId = assignment.primaryUserId;
  const delegateUserId = assignment.delegateUserId ?? undefined;

  return {
    authorityLevelId: authorityLevel.id,
    authorityLevelCode,
    authorityOwnerUserId: primaryUserId,
    assignedToUserId: delegateUserId ?? primaryUserId,
    delegated: Boolean(delegateUserId),
  };
};
