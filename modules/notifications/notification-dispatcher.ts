import { prisma } from "@/lib/prisma";

export class NotificationDispatcher {
  async dispatchApprovalAssigned({
    tenantId,
    userId,
    requestId,
    workflowTaskId,
  }: {
    tenantId: string;
    userId: string;
    requestId: string;
    workflowTaskId: string;
  }) {
    return prisma.notification.create({
      data: {
        tenantId,
        userId,
        type: "APPROVAL_ASSIGNED",
        payload: JSON.stringify({ requestId, workflowTaskId }),
      },
    });
  }
}

export const notificationDispatcher = new NotificationDispatcher();
