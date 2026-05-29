import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { CurrentUser } from "@/types/auth";

function formatDateTime(date: Date | null | undefined) {
  if (!date) return undefined;
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Johannesburg",
  }).format(date);
}

function label(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function personName(user: { firstName: string | null; lastName: string | null; email: string } | null | undefined) {
  if (!user) return "Unknown user";
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
}

function money(value: unknown) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);
}

function canSeeTenant(user: CurrentUser, tenantId: string) {
  return user.roles.includes("SUPER_ADMIN") || user.tenantId === tenantId;
}

export async function getRequestDetail(requestId: string, user: CurrentUser) {
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      requestNumber: true,
      requesterId: true,
      tenantId: true,
      payload: true,
      status: true,
      currentStep: true,
      createdAt: true,
      updatedAt: true,
      tasks: { orderBy: { createdAt: "asc" } },
      approvalActions: { orderBy: { actionTimestamp: "desc" } },
      workflowEvents: { orderBy: { createdAt: "asc" } },
      auditLogs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!request || !canSeeTenant(user, request.tenantId)) notFound();

  const userIds = [
    request.requesterId,
    ...request.tasks.flatMap((task) => [task.assigneeId, task.authorityOwnerUserId].filter(Boolean) as string[]),
    ...request.approvalActions.map((action) => action.actionByUserId),
    ...request.auditLogs.flatMap((log) => (log.actorUserId ? [log.actorUserId] : [])),
  ];
  const [users, tenant] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: [...new Set(userIds)] } },
      select: { id: true, firstName: true, lastName: true, email: true },
    }),
    prisma.tenant.findUnique({ where: { id: request.tenantId }, select: { name: true, domain: true } }),
  ]);
  const userById = new Map(users.map((item) => [item.id, item]));
  const payload = request.payload as Record<string, unknown>;
  const currentTask = request.tasks.find((task) => task.status === "PENDING") ?? request.tasks.at(-1);

  return {
    id: request.id,
    requestNumber: request.requestNumber,
    tenantName: tenant?.name ?? "Unknown tenant",
    requester: personName(userById.get(request.requesterId)),
    purpose: String(payload.purpose ?? "Untitled request"),
    destination: String(payload.destination ?? "Not captured"),
    dateRange: [formatDateTime(payload.startDate ? new Date(String(payload.startDate)) : null), formatDateTime(payload.endDate ? new Date(String(payload.endDate)) : null)]
      .filter(Boolean)
      .join(" to ") || "Dates not captured",
    estimatedCost: money(payload.estimatedCost),
    status: request.status,
    currentStep: request.currentStep ?? "Not started",
    createdAt: formatDateTime(request.createdAt),
    updatedAt: formatDateTime(request.updatedAt),
    payload,
    currentTask: currentTask
      ? {
          id: currentTask.id,
          stepName: currentTask.stepName,
          status: currentTask.status,
          assignee: currentTask.assigneeId ? personName(userById.get(currentTask.assigneeId)) : "Unassigned",
          dueAt: formatDateTime(currentTask.dueAt) ?? "No due date",
        }
      : null,
    tasks: request.tasks.map((task) => ({
      id: task.id,
      title: label(task.stepName),
      status: task.status,
      assignee: task.assigneeId ? personName(userById.get(task.assigneeId)) : "Unassigned",
      createdAt: formatDateTime(task.createdAt),
      completedAt: formatDateTime(task.completedAt),
      href: `/tasks/${task.id}`,
    })),
    timeline: request.workflowEvents.map((event) => ({
      title: label(event.type),
      status:
        event.nextState === "REJECTED"
          ? ("rejected" as const)
          : event.type.includes("COMPLETED")
            ? ("completed" as const)
            : event.type.includes("ASSIGNED")
              ? ("current" as const)
              : ("pending" as const),
      actorName: event.actorUserId ? personName(userById.get(event.actorUserId)) : "System",
      timestamp: formatDateTime(event.createdAt),
      description: [event.previousState ? label(event.previousState) : null, event.nextState ? label(event.nextState) : null]
        .filter(Boolean)
        .join(" -> "),
    })),
    auditEvents: request.auditLogs.map((log) => ({
      id: log.id,
      actor: log.actorUserId ? personName(userById.get(log.actorUserId)) : "System",
      action: label(log.action),
      timestamp: formatDateTime(log.createdAt) ?? "",
      oldValue: log.previousState ? label(log.previousState) : log.oldValue ?? undefined,
      newValue: log.nextState ? label(log.nextState) : log.newValue ?? undefined,
      origin: log.actorUserId ? ("user" as const) : ("system" as const),
    })),
    approvalHistory: request.approvalActions.map((action) => ({
      id: action.id,
      approverName: personName(userById.get(action.actionByUserId)),
      role: action.delegated ? "Delegated approver" : "Approver",
      decision: action.action === "REJECTED" ? ("REJECTED" as const) : ("APPROVED" as const),
      comment: action.comments ?? undefined,
      timestamp: formatDateTime(action.actionTimestamp) ?? "",
      stepName: label(action.previousState ?? request.currentStep ?? "Approval"),
    })),
  };
}

export async function getTaskDetail(taskId: string, user: CurrentUser) {
  const task = await prisma.workflowTask.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      requestId: true,
      assigneeId: true,
      authorityOwnerUserId: true,
      tenantId: true,
      stepName: true,
      status: true,
      dueAt: true,
      createdAt: true,
      completedAt: true,
    },
  });

  if (!task || !canSeeTenant(user, task.tenantId)) notFound();
  const request = await getRequestDetail(task.requestId, user);
  const canDecide = task.status === "PENDING" && (user.roles.includes("SUPER_ADMIN") || !task.assigneeId || task.assigneeId === user.id);

  return {
    ...task,
    title: label(task.stepName),
    dueAtLabel: formatDateTime(task.dueAt) ?? "No due date",
    createdAtLabel: formatDateTime(task.createdAt) ?? "",
    completedAtLabel: formatDateTime(task.completedAt),
    request,
    canDecide,
  };
}
