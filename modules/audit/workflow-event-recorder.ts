import type { WorkflowEventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class WorkflowEventRecorder {
  async append({
    tenantId,
    requestId,
    workflowTaskId,
    actorUserId,
    type,
    previousState,
    nextState,
    payload,
  }: {
    tenantId: string;
    requestId?: string | null;
    workflowTaskId?: string | null;
    actorUserId?: string | null;
    type: WorkflowEventType;
    previousState?: string | null;
    nextState?: string | null;
    payload?: unknown;
  }) {
    return prisma.workflowEvent.create({
      data: {
        tenantId,
        requestId,
        workflowTaskId,
        actorUserId,
        type,
        previousState,
        nextState,
        payload: payload === undefined ? undefined : JSON.stringify(payload),
      },
    });
  }
}

export const workflowEventRecorder = new WorkflowEventRecorder();
