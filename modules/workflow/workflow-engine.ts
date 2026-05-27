import type { ApprovalDecision } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authorityResolver } from "@/modules/authority/authority-resolver";
import { hierarchyTraversalService } from "@/modules/authority/hierarchy-traversal-service";
import { approvalLimitResolver } from "@/modules/rules/approval-limit-resolver";
import { transitionEngine } from "@/modules/workflow/transition-engine";
import type { CreateTravelRequestInput } from "@/modules/requests/service";

type DbClient = any;

export class WorkflowEngine {
  async submitRequest({
    input,
    requesterId,
    tenantId,
  }: {
    input: CreateTravelRequestInput;
    requesterId: string;
    tenantId: string;
  }) {
    const requiredAuthority = await approvalLimitResolver.resolveRequiredLevel(tenantId, input.estimatedCost);
    const firstAuthority = await transitionEngine.nextAuthorityLevel({
      tenantId,
      requiredAuthorityLevel: requiredAuthority,
    });

    if (!firstAuthority) {
      throw new Error("Workflow has no approval authority levels configured.");
    }

    const resolution = await authorityResolver.resolve({
      tenantId,
      requesterId,
      authorityLevelId: firstAuthority.id,
    });

    const hierarchySnapshot = await hierarchyTraversalService.snapshotChain(requesterId, tenantId);
    const authorityChain = await approvalLimitResolver.getChainToRank(tenantId, requiredAuthority.rankOrder);
    const department = await prisma.department.findFirst({
      where: { tenantId, name: input.department },
    });

    const requestNumber = `TR-${Date.now()}`;
    const currentState = transitionEngine.pendingStatusForAuthority(firstAuthority.code);
    const stepName = transitionEngine.stepNameForAuthority(firstAuthority.code);

    return prisma.$transaction(async (tx) => {
      const request = await tx.travelRequest.create({
        data: {
          ...input,
          requestNumber,
          requesterId,
          tenantId,
          departmentId: department?.id,
          requiredAuthorityLevelId: requiredAuthority.id,
          status: currentState,
          currentStep: stepName,
          version: 1,
        },
      });

      const task = await tx.workflowTask.create({
        data: {
          tenantId,
          requestId: request.id,
          assigneeId: resolution.assignedToUserId,
          authorityLevelId: resolution.authorityLevelId,
          authorityOwnerUserId: resolution.authorityOwnerUserId,
          delegatedFromUserId: resolution.delegated ? resolution.authorityOwnerUserId : undefined,
          stepName,
          status: "PENDING",
        },
      });

      await tx.workflowAssignment.create({
        data: {
          tenantId,
          requestId: request.id,
          workflowTaskId: task.id,
          assignedToUserId: resolution.assignedToUserId,
          authorityLevelId: resolution.authorityLevelId,
          status: "ACTIVE",
        },
      });

      await tx.approvalSnapshot.create({
        data: {
          tenantId,
          requestId: request.id,
          hierarchy: JSON.stringify(hierarchySnapshot),
          authorityChain: JSON.stringify(
            authorityChain.map((level) => ({
              id: level.id,
              code: level.code,
              rankOrder: level.rankOrder,
              approvalLimit: level.approvalLimit,
            })),
          ),
          policyContext: JSON.stringify({
            amount: input.estimatedCost,
            department: input.department,
            travelType: input.travelType,
          }),
        },
      });

      await this.recordAssignmentEvents(tx as DbClient, {
        tenantId,
        requestId: request.id,
        taskId: task.id,
        actorUserId: requesterId,
        currentState,
        requestNumber,
        resolution,
        requiredAuthorityCode: requiredAuthority.code,
      });

      return tx.travelRequest.findUniqueOrThrow({
        where: { id: request.id },
        include: { tasks: true },
      });
    });
  }

  async executeTransition({
    taskId,
    actorUserId,
    tenantId,
    decision,
    comment,
  }: {
    taskId: string;
    actorUserId: string;
    tenantId: string;
    decision: ApprovalDecision;
    comment?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.workflowTask.findFirst({
        where: { id: taskId, tenantId },
        include: { request: true, authorityLevel: true },
      });

      if (!task) throw new Error("Task not found.");
      if (task.status !== "PENDING") throw new Error("Task has already been completed.");
      if (task.assigneeId && task.assigneeId !== actorUserId) {
        throw new Error("Only the assigned approver can complete this task.");
      }

      const requestUpdate = await tx.travelRequest.updateMany({
        where: {
          id: task.requestId,
          tenantId,
          version: task.request.version,
          status: task.request.status,
        },
        data: {
          version: { increment: 1 },
        },
      });

      if (requestUpdate.count !== 1) {
        throw new Error("Workflow changed while this approval was being processed. Please reload and try again.");
      }

      await tx.workflowTask.update({
        where: { id: task.id },
        data: {
          status: decision === "APPROVED" ? "COMPLETED" : "REJECTED",
          completedAt: new Date(),
          assigneeId: actorUserId,
        },
      });

      await tx.workflowAssignment.updateMany({
        where: {
          tenantId,
          workflowTaskId: task.id,
          status: "ACTIVE",
        },
        data: {
          status: decision === "APPROVED" ? "COMPLETED" : "CANCELLED",
        },
      });

      const previousState = task.request.status;

      if (decision === "REJECTED") {
        const request = await this.finalizeRequest(tx as DbClient, {
          task,
          actorUserId,
          tenantId,
          decision,
          comment,
          previousState,
          nextState: "REJECTED",
        });

        return { task, request };
      }

      const requiredAuthority = await tx.authorityLevel.findUnique({
        where: { id: task.request.requiredAuthorityLevelId ?? task.authorityLevelId ?? "" },
      });

      if (!requiredAuthority) {
        throw new Error("Required authority level not found.");
      }

      const nextAuthority = await transitionEngine.nextAuthorityLevel({
        tenantId,
        currentAuthorityLevelId: task.authorityLevelId,
        requiredAuthorityLevel: requiredAuthority,
      });

      if (!nextAuthority) {
        const request = await this.finalizeRequest(tx as DbClient, {
          task,
          actorUserId,
          tenantId,
          decision,
          comment,
          previousState,
          nextState: "APPROVED",
        });

        return { task, request };
      }

      const resolution = await authorityResolver.resolve({
        tenantId,
        requesterId: task.request.requesterId,
        authorityLevelId: nextAuthority.id,
      });

      const nextState = transitionEngine.pendingStatusForAuthority(nextAuthority.code);
      const nextStepName = transitionEngine.stepNameForAuthority(nextAuthority.code);

      await tx.approvalAction.create({
        data: {
          tenantId,
          requestId: task.requestId,
          workflowTaskId: task.id,
          actionByUserId: actorUserId,
          authorityOwnerUserId: task.authorityOwnerUserId,
          delegated: Boolean(task.delegatedFromUserId),
          action: decision,
          comments: comment,
          previousState,
          nextState,
        },
      });

      const request = await tx.travelRequest.update({
        where: { id: task.requestId },
        data: {
          status: nextState,
          currentStep: nextStepName,
        },
      });

      const nextTask = await tx.workflowTask.create({
        data: {
          tenantId,
          requestId: task.requestId,
          assigneeId: resolution.assignedToUserId,
          authorityLevelId: resolution.authorityLevelId,
          authorityOwnerUserId: resolution.authorityOwnerUserId,
          delegatedFromUserId: resolution.delegated ? resolution.authorityOwnerUserId : undefined,
          stepName: nextStepName,
          status: "PENDING",
        },
      });

      await tx.workflowAssignment.create({
        data: {
          tenantId,
          requestId: task.requestId,
          workflowTaskId: nextTask.id,
          assignedToUserId: resolution.assignedToUserId,
          authorityLevelId: resolution.authorityLevelId,
          status: "ACTIVE",
        },
      });

      await this.recordApprovalEvents(tx as DbClient, {
        tenantId,
        requestId: task.requestId,
        taskId: task.id,
        nextTaskId: nextTask.id,
        actorUserId,
        previousState,
        nextState,
        comment,
        resolution,
      });

      return { task: nextTask, request };
    });
  }

  private async finalizeRequest(
    tx: DbClient,
    {
      task,
      actorUserId,
      tenantId,
      decision,
      comment,
      previousState,
      nextState,
    }: {
      task: any;
      actorUserId: string;
      tenantId: string;
      decision: ApprovalDecision;
      comment?: string;
      previousState: string;
      nextState: "APPROVED" | "REJECTED";
    },
  ) {
    await tx.approvalAction.create({
      data: {
        tenantId,
        requestId: task.requestId,
        workflowTaskId: task.id,
        actionByUserId: actorUserId,
        authorityOwnerUserId: task.authorityOwnerUserId,
        delegated: Boolean(task.delegatedFromUserId),
        action: decision,
        comments: comment,
        previousState,
        nextState,
      },
    });

    const request = await tx.travelRequest.update({
      where: { id: task.requestId },
      data: {
        status: nextState,
        currentStep: "COMPLETED",
      },
    });

    await tx.auditLog.create({
      data: {
        tenantId,
        actorUserId,
        travelRequestId: task.requestId,
        workflowTaskId: task.id,
        entityType: "TravelRequest",
        entityId: task.requestId,
        action: decision === "APPROVED" ? "REQUEST_APPROVED" : "REQUEST_REJECTED",
        previousState,
        nextState,
        authorityOwnerUserId: task.authorityOwnerUserId,
        delegated: Boolean(task.delegatedFromUserId),
        newValue: JSON.stringify({ comment, step: task.stepName, decision }),
      },
    });

    await tx.workflowEvent.create({
      data: {
        tenantId,
        requestId: task.requestId,
        workflowTaskId: task.id,
        actorUserId,
        type: decision === "APPROVED" ? "WORKFLOW_COMPLETED" : "APPROVAL_REJECTED",
        previousState,
        nextState,
        payload: JSON.stringify({ comment, step: task.stepName }),
      },
    });

    return request;
  }

  private async recordAssignmentEvents(
    tx: DbClient,
    input: {
      tenantId: string;
      requestId: string;
      taskId: string;
      actorUserId: string;
      currentState: string;
      requestNumber: string;
      resolution: any;
      requiredAuthorityCode: string;
    },
  ) {
    await tx.auditLog.create({
      data: {
        tenantId: input.tenantId,
        actorUserId: input.actorUserId,
        travelRequestId: input.requestId,
        workflowTaskId: input.taskId,
        entityType: "TravelRequest",
        entityId: input.requestId,
        action: "REQUEST_SUBMITTED",
        previousState: "DRAFT",
        nextState: input.currentState,
        authorityOwnerUserId: input.resolution.authorityOwnerUserId,
        delegated: input.resolution.delegated,
        newValue: JSON.stringify({
          requestNumber: input.requestNumber,
          requiredAuthorityLevel: input.requiredAuthorityCode,
          assignedToUserId: input.resolution.assignedToUserId,
        }),
      },
    });

    await tx.workflowEvent.create({
      data: {
        tenantId: input.tenantId,
        requestId: input.requestId,
        workflowTaskId: input.taskId,
        actorUserId: input.actorUserId,
        type: "APPROVAL_ASSIGNED",
        nextState: input.currentState,
        payload: JSON.stringify(input.resolution),
      },
    });
  }

  private async recordApprovalEvents(
    tx: DbClient,
    input: {
      tenantId: string;
      requestId: string;
      taskId: string;
      nextTaskId: string;
      actorUserId: string;
      previousState: string;
      nextState: string;
      comment?: string;
      resolution: any;
    },
  ) {
    await tx.auditLog.create({
      data: {
        tenantId: input.tenantId,
        actorUserId: input.actorUserId,
        travelRequestId: input.requestId,
        workflowTaskId: input.taskId,
        entityType: "TravelRequest",
        entityId: input.requestId,
        action: "REQUEST_APPROVED",
        previousState: input.previousState,
        nextState: input.nextState,
        authorityOwnerUserId: input.resolution.authorityOwnerUserId,
        delegated: input.resolution.delegated,
        newValue: JSON.stringify({ comment: input.comment }),
      },
    });

    await tx.workflowEvent.createMany({
      data: [
        {
          tenantId: input.tenantId,
          requestId: input.requestId,
          workflowTaskId: input.taskId,
          actorUserId: input.actorUserId,
          type: "APPROVAL_COMPLETED",
          previousState: input.previousState,
          nextState: input.nextState,
          payload: JSON.stringify({ comment: input.comment }),
        },
        {
          tenantId: input.tenantId,
          requestId: input.requestId,
          workflowTaskId: input.nextTaskId,
          actorUserId: input.actorUserId,
          type: "APPROVAL_ASSIGNED",
          nextState: input.nextState,
          payload: JSON.stringify(input.resolution),
        },
      ],
    });
  }
}

export const workflowEngine = new WorkflowEngine();
