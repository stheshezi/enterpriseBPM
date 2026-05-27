import type { AuditAction } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class AuditRecorder {
  async record({
    tenantId,
    actorUserId,
    travelRequestId,
    workflowTaskId,
    entityType,
    entityId,
    action,
    oldValue,
    newValue,
    previousState,
    nextState,
    authorityOwnerUserId,
    delegated = false,
    ipAddress,
    userAgent,
  }: {
    tenantId: string;
    actorUserId?: string | null;
    travelRequestId?: string | null;
    workflowTaskId?: string | null;
    entityType: string;
    entityId?: string | null;
    action: AuditAction;
    oldValue?: unknown;
    newValue?: unknown;
    previousState?: string | null;
    nextState?: string | null;
    authorityOwnerUserId?: string | null;
    delegated?: boolean;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    return prisma.auditLog.create({
      data: {
        tenantId,
        actorUserId,
        travelRequestId,
        workflowTaskId,
        entityType,
        entityId,
        action,
        oldValue: oldValue === undefined ? undefined : JSON.stringify(oldValue),
        newValue: newValue === undefined ? undefined : JSON.stringify(newValue),
        previousState,
        nextState,
        authorityOwnerUserId,
        delegated,
        ipAddress,
        userAgent,
      },
    });
  }
}

export const auditRecorder = new AuditRecorder();
