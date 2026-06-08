import { PrismaClient, Responsibility, ResponsibilityAssignment, EscalationRule } from '@prisma/client';

const prisma = new PrismaClient();

// Responsibility CRUD
export const createResponsibility = async (tenantId: string, code: string, description?: string, order?: number) => {
  return await prisma.responsibility.create({
    data: {
      tenantId,
      code,
      description,
      order,
    },
  });
};

export const getResponsibilities = async (tenantId: string) => {
  return await prisma.responsibility.findMany({ where: { tenantId } });
};

export const updateResponsibility = async (id: string, data: Partial<Responsibility>) => {
  return await prisma.responsibility.update({ where: { id }, data });
};

export const deleteResponsibility = async (id: string) => {
  return await prisma.responsibility.delete({ where: { id } });
};

// Responsibility Assignment CRUD
export const assignUserToResponsibility = async (
  tenantId: string,
  responsibilityId: string,
  primaryUserId?: string,
  delegateUserId?: string,
) => {
  return await prisma.responsibilityAssignment.create({
    data: {
      tenantId,
      responsibilityId,
      primaryUserId,
      delegateUserId,
    },
  });
};

export const getAssignmentsByResponsibility = async (responsibilityId: string) => {
  return await prisma.responsibilityAssignment.findMany({ where: { responsibilityId } });
};

export const getAssignmentsByUser = async (userId: string) => {
  return await prisma.responsibilityAssignment.findMany({
    where: {
      OR: [{ primaryUserId: userId }, { delegateUserId: userId }],
    },
  });
};

export const removeAssignment = async (id: string) => {
  return await prisma.responsibilityAssignment.delete({ where: { id } });
};

// Escalation Rule CRUD
export const createEscalationRule = async (
  tenantId: string,
  sourceResponsibilityId: string,
  targetResponsibilityId: string,
  condition: string,
) => {
  return await prisma.escalationRule.create({
    data: {
      tenantId,
      sourceResponsibilityId,
      targetResponsibilityId,
      condition,
    },
  });
};

export const getEscalationRules = async (tenantId: string) => {
  return await prisma.escalationRule.findMany({ where: { tenantId } });
};

export const deleteEscalationRule = async (id: string) => {
  return await prisma.escalationRule.delete({ where: { id } });
};
