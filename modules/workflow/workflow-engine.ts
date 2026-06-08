import type { ApprovalDecision } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getMongoDb, nowStamp } from "@/lib/mongo-native";
import { resolveResponsibility } from "@/services/governanceResolver";
import { hierarchyTraversalService } from "@/modules/authority/hierarchy-traversal-service";
import { approvalLimitResolver } from "@/modules/rules/approval-limit-resolver";
import { transitionEngine } from "@/modules/workflow/transition-engine";
import type { CreateRequestInput, TravelRequestPayload } from "@/modules/requests/service";

type DbClient = any;

function collection(db: DbClient, name: string) {
  return db.collection(name) as any;
}

function withId<T extends { _id: string }>(document: T) {
  const { _id, ...rest } = document;
  return { id: _id, ...rest };
}

export class WorkflowEngine {
  async submitRequest({
    input,
    requesterId,
    tenantId,
  }: {
    input: CreateRequestInput;
    requesterId: string;
    tenantId: string;
  }) {
    // Extract payload for cost resolution
    const payload = input.payload as TravelRequestPayload;
    const estimatedCost = (payload as any).estimatedCost || 0;

    const requiredAuthority = await approvalLimitResolver.resolveRequiredLevel(
      tenantId,
      estimatedCost
    );
    const firstAuthority = await transitionEngine.nextAuthorityLevel({
      tenantId,
      requiredAuthorityLevel: requiredAuthority,
    });

    if (!firstAuthority) {
      throw new Error("Workflow has no approval authority levels configured.");
    }

    const resolution = await resolveResponsibility({
      tenantId,
      authorityLevelCode: firstAuthority.code,
    });

    const hierarchySnapshot = await hierarchyTraversalService.snapshotChain(
      requesterId,
      tenantId
    );
    const authorityChain = await approvalLimitResolver.getChainToRank(
      tenantId,
      requiredAuthority.rankOrder
    );

    const departmentName = (payload as any).department || input.departmentId;
    const department = departmentName
      ? await prisma.department.findFirst({
          where: {
            tenantId,
            name: typeof departmentName === "string" ? departmentName : "",
          },
        })
      : null;

    const requestNumber = `REQ-${Date.now()}`;
    const currentState = transitionEngine.pendingStatusForAuthority(
      firstAuthority.code
    );
    const stepName = transitionEngine.stepNameForAuthority(firstAuthority.code);

    const db = await getMongoDb();
    const timestamp = nowStamp();
    const request = {
      _id: randomUUID(),
      requestNumber,
      requesterId,
      tenantId,
      requestTypeId: input.requestTypeId,
      departmentId: department?.id || input.departmentId,
      payload: input.payload,
      requiredAuthorityLevelId: requiredAuthority.id,
      status: currentState,
      currentStep: stepName,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const task = {
      _id: randomUUID(),
      tenantId,
      requestId: request._id,
      assigneeId: resolution.assignedToUserId,
      authorityLevelId: resolution.authorityLevelId,
      authorityOwnerUserId: resolution.authorityOwnerUserId,
      delegatedFromUserId: resolution.delegated ? resolution.authorityOwnerUserId : undefined,
      stepName,
      status: "PENDING",
      dueAt: null,
      completedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await collection(db, "Request").insertOne(request);
    await collection(db, "WorkflowTask").insertOne(task);
    await collection(db, "WorkflowAssignment").insertOne({
      _id: randomUUID(),
      tenantId,
      requestId: request._id,
      workflowTaskId: task._id,
      assignedToUserId: resolution.assignedToUserId,
      authorityLevelId: resolution.authorityLevelId,
      status: "ACTIVE",
      assignedAt: timestamp,
    });
    await collection(db, "ApprovalSnapshot").insertOne({
      _id: randomUUID(),
      tenantId,
      requestId: request._id,
      snapshotVersion: 1,
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
        amount: estimatedCost,
        requestType: (payload as any).requestType,
        workflowCode: (payload as any).workflowCode ?? "CONFIGURABLE_REQUEST_WORKFLOW",
        payload: input.payload,
      }),
      createdAt: timestamp,
    });
    await this.recordAssignmentEvents(db, {
      tenantId,
      requestId: request._id,
      taskId: task._id,
      actorUserId: requesterId,
      currentState,
      requestNumber,
      resolution,
      requiredAuthorityCode: requiredAuthority.code,
    });

    return { ...withId(request), tasks: [withId(task)] };
  }

  async executeTransition({
    taskId,
    actorUserId,
    tenantId,
    decision,
    comment,
    bypassAssignment = false,
  }: {
    taskId: string;
    actorUserId: string;
    tenantId: string;
    decision: ApprovalDecision;
    comment?: string;
    bypassAssignment?: boolean;
  }) {
    const db = await getMongoDb();
    const timestamp = nowStamp();

    const task = await prisma.workflowTask.findFirst({
      where: { id: taskId, tenantId },
      include: { request: true, authorityLevel: true },
    });

    if (!task) throw new Error("Task not found.");
    if (task.status !== "PENDING") throw new Error("Task has already been completed.");
    if (!bypassAssignment && task.assigneeId && task.assigneeId !== actorUserId) {
      throw new Error("Only the assigned approver can complete this task.");
    }

    const requestUpdate = await collection(db, "Request").updateOne(
      {
        _id: task.requestId,
        tenantId,
        version: task.request.version,
        status: task.request.status,
      },
      { $inc: { version: 1 }, $set: { updatedAt: timestamp } },
    );

    if (requestUpdate.matchedCount !== 1) {
      throw new Error("Workflow changed while this approval was being processed. Please reload and try again.");
    }

    const previousState = task.request.status;

    await collection(db, "WorkflowTask").updateOne(
      { _id: task.id },
      {
        $set: {
          status: decision === "APPROVED" ? "COMPLETED" : "REJECTED",
          completedAt: timestamp,
          assigneeId: actorUserId,
          updatedAt: timestamp,
        },
      },
    );

    await collection(db, "WorkflowAssignment").updateMany(
      { tenantId, workflowTaskId: task.id, status: "ACTIVE" },
      { $set: { status: decision === "APPROVED" ? "COMPLETED" : "CANCELLED" } },
    );

    if (decision === "REJECTED") {
      const request = await this.finalizeRequest(db, {
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

    const requiredAuthority = task.request.requiredAuthorityLevelId
      ? await prisma.authorityLevel.findUnique({ where: { id: task.request.requiredAuthorityLevelId } })
      : null;

    if (!requiredAuthority) throw new Error("Required authority level not found.");

    const nextAuthority = await transitionEngine.nextAuthorityLevel({
      tenantId,
      currentAuthorityLevelId: task.authorityLevelId,
      requiredAuthorityLevel: requiredAuthority,
    });

    if (!nextAuthority) {
      const request = await this.finalizeRequest(db, {
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

    const resolution = await resolveResponsibility({
      tenantId,
      authorityLevelCode: nextAuthority.code,
    });

    const nextState = transitionEngine.pendingStatusForAuthority(nextAuthority.code);
    const nextStepName = transitionEngine.stepNameForAuthority(nextAuthority.code);

    await collection(db, "ApprovalAction").insertOne({
      _id: randomUUID(),
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
      actionTimestamp: timestamp,
    });

    await collection(db, "Request").updateOne(
      { _id: task.requestId },
      { $set: { status: nextState, currentStep: nextStepName, updatedAt: timestamp } },
    );
    const request = withId((await collection(db, "Request").findOne({ _id: task.requestId })) as any);

    const nextTaskDocument = {
      _id: randomUUID(),
      tenantId,
      requestId: task.requestId,
      assigneeId: resolution.assignedToUserId,
      authorityLevelId: resolution.authorityLevelId,
      authorityOwnerUserId: resolution.authorityOwnerUserId,
      delegatedFromUserId: resolution.delegated ? resolution.authorityOwnerUserId : undefined,
      stepName: nextStepName,
      status: "PENDING",
      dueAt: null,
      completedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await collection(db, "WorkflowTask").insertOne(nextTaskDocument);
    await collection(db, "WorkflowAssignment").insertOne({
      _id: randomUUID(),
      tenantId,
      requestId: task.requestId,
      workflowTaskId: nextTaskDocument._id,
      assignedToUserId: resolution.assignedToUserId,
      authorityLevelId: resolution.authorityLevelId,
      status: "ACTIVE",
      assignedAt: timestamp,
    });

    await this.recordApprovalEvents(db, {
      tenantId,
      requestId: task.requestId,
      taskId: task.id,
      nextTaskId: nextTaskDocument._id,
      actorUserId,
      previousState,
      nextState,
      comment,
      resolution,
    });

    return { task: withId(nextTaskDocument), request };
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
    }
  ) {
    const timestamp = nowStamp();

    await collection(tx, "ApprovalAction").insertOne({
      _id: randomUUID(),
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
      actionTimestamp: timestamp,
    });

    await collection(tx, "Request").updateOne(
      { _id: task.requestId },
      { $set: { status: nextState, currentStep: "COMPLETED", updatedAt: timestamp } },
    );
    const request = withId((await collection(tx, "Request").findOne({ _id: task.requestId })) as any);

    await collection(tx, "AuditLog").insertOne({
      _id: randomUUID(),
      tenantId,
      actorUserId,
      travelRequestId: task.requestId,
      workflowTaskId: task.id,
      entityType: "Request",
      entityId: task.requestId,
      action: decision === "APPROVED" ? "REQUEST_APPROVED" : "REQUEST_REJECTED",
      previousState,
      nextState,
      oldValue: null,
      authorityOwnerUserId: task.authorityOwnerUserId,
      delegated: Boolean(task.delegatedFromUserId),
      newValue: JSON.stringify({ comment, step: task.stepName, decision }),
      createdAt: timestamp,
    });

    await collection(tx, "WorkflowEvent").insertOne({
      _id: randomUUID(),
      tenantId,
      requestId: task.requestId,
      workflowTaskId: task.id,
      actorUserId,
      type: decision === "APPROVED" ? "WORKFLOW_COMPLETED" : "APPROVAL_REJECTED",
      previousState,
      nextState,
      payload: JSON.stringify({ comment, step: task.stepName }),
      createdAt: timestamp,
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
    }
  ) {
    const timestamp = nowStamp();

    await collection(tx, "AuditLog").insertOne({
      _id: randomUUID(),
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      travelRequestId: input.requestId,
      workflowTaskId: input.taskId,
      entityType: "Request",
      entityId: input.requestId,
      action: "REQUEST_SUBMITTED",
      previousState: "DRAFT",
      nextState: input.currentState,
      oldValue: null,
      authorityOwnerUserId: input.resolution.authorityOwnerUserId,
      delegated: input.resolution.delegated,
      newValue: JSON.stringify({
        requestNumber: input.requestNumber,
        requiredAuthorityLevel: input.requiredAuthorityCode,
        assignedToUserId: input.resolution.assignedToUserId,
      }),
      createdAt: timestamp,
    });

    await collection(tx, "WorkflowEvent").insertOne({
      _id: randomUUID(),
      tenantId: input.tenantId,
      requestId: input.requestId,
      workflowTaskId: input.taskId,
      actorUserId: input.actorUserId,
      type: "APPROVAL_ASSIGNED",
      previousState: null,
      nextState: input.currentState,
      payload: JSON.stringify(input.resolution),
      createdAt: timestamp,
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
    }
  ) {
    const timestamp = nowStamp();

    await collection(tx, "AuditLog").insertOne({
      _id: randomUUID(),
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      travelRequestId: input.requestId,
      workflowTaskId: input.taskId,
      entityType: "Request",
      entityId: input.requestId,
      action: "REQUEST_APPROVED",
      previousState: input.previousState,
      nextState: input.nextState,
      oldValue: null,
      authorityOwnerUserId: input.resolution.authorityOwnerUserId,
      delegated: input.resolution.delegated,
      newValue: JSON.stringify({ comment: input.comment }),
      createdAt: timestamp,
    });

    await collection(tx, "WorkflowEvent").insertMany([
        {
          _id: randomUUID(),
          tenantId: input.tenantId,
          requestId: input.requestId,
          workflowTaskId: input.taskId,
          actorUserId: input.actorUserId,
          type: "APPROVAL_COMPLETED",
          previousState: input.previousState,
          nextState: input.nextState,
          payload: JSON.stringify({ comment: input.comment }),
          createdAt: timestamp,
        },
        {
          _id: randomUUID(),
          tenantId: input.tenantId,
          requestId: input.requestId,
          workflowTaskId: input.nextTaskId,
          actorUserId: input.actorUserId,
          type: "APPROVAL_ASSIGNED",
          previousState: null,
          nextState: input.nextState,
          payload: JSON.stringify(input.resolution),
          createdAt: timestamp,
        },
      ]);
  }

  async getRequest(requestId: string) {
    return prisma.request.findUnique({
      where: { id: requestId },
      include: {
        requester: true,
        requestType: true,
        tasks: true,
        approvalActions: true,
        workflowEvents: true,
        auditLogs: true,
      },
    });
  }

  async getUserRequests(userId: string, tenantId: string) {
    return prisma.request.findMany({
      where: {
        tenantId,
        requesterId: userId,
      },
      include: {
        requestType: true,
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateRequestStatus(
    requestId: string,
    status: string,
    tenantId: string
  ) {
    return prisma.request.update({
      where: { id: requestId },
      data: { status: status as any },
    });
  }
}

export const workflowEngine = new WorkflowEngine();
