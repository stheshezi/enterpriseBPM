import { RequestStatus, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CurrentUser } from "@/types/auth";

const pendingRequestStatuses: RequestStatus[] = [
  RequestStatus.SUBMITTED,
  RequestStatus.PENDING_LM,
  RequestStatus.PENDING_BUMA,
  RequestStatus.PENDING_C5,
  RequestStatus.PENDING_CEO,
  RequestStatus.MANAGER_APPROVAL,
  RequestStatus.FINANCE_APPROVAL,
];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function daysAgo(days: number) {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() - days);
  return date;
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Johannesburg",
  }).format(date);
}

function statusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function personName(user: { firstName: string | null; lastName: string | null; email: string } | null | undefined) {
  if (!user) return "Unknown user";
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
}

export type SuperAdminDashboardData = Awaited<ReturnType<typeof getSuperAdminDashboardData>>;
export type RoleDashboardData = Awaited<ReturnType<typeof getRoleDashboardData>>;

export async function getSuperAdminDashboardData(user: CurrentUser) {
  const isSuperAdmin = user.roles.includes("SUPER_ADMIN");
  const tenantScope = isSuperAdmin ? {} : { tenantId: user.tenantId };
  const since30Days = daysAgo(30);
  const now = new Date();

  const [
    tenantCount,
    activeTenantCount,
    userCount,
    activeUserCount,
    requestCount,
    requestsCreated30Days,
    pendingRequestCount,
    approvedRequestCount,
    rejectedRequestCount,
    pendingTaskCount,
    overdueTaskCount,
    notificationCount,
    statusCounts,
    taskStatusCounts,
    recentRequests,
    recentTasks,
    recentAuditLogs,
    requestEvents,
  ] = await Promise.all([
    prisma.tenant.count(),
    prisma.tenant.count({ where: { users: { some: { active: true } } } }),
    prisma.user.count({ where: tenantScope }),
    prisma.user.count({ where: { ...tenantScope, active: true } }),
    prisma.request.count({ where: tenantScope }),
    prisma.request.count({ where: { ...tenantScope, createdAt: { gte: since30Days } } }),
    prisma.request.count({ where: { ...tenantScope, status: { in: pendingRequestStatuses } } }),
    prisma.request.count({ where: { ...tenantScope, status: RequestStatus.APPROVED } }),
    prisma.request.count({ where: { ...tenantScope, status: RequestStatus.REJECTED } }),
    prisma.workflowTask.count({ where: { ...tenantScope, status: TaskStatus.PENDING } }),
    prisma.workflowTask.count({
      where: {
        ...tenantScope,
        status: TaskStatus.PENDING,
        dueAt: { lt: now },
      },
    }),
    prisma.notification.count({ where: tenantScope }),
    prisma.request.groupBy({
      by: ["status"],
      where: tenantScope,
      _count: { _all: true },
    }),
    prisma.workflowTask.groupBy({
      by: ["status"],
      where: tenantScope,
      _count: { _all: true },
    }),
    prisma.request.findMany({
      where: tenantScope,
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        requestNumber: true,
        requesterId: true,
        tenantId: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.workflowTask.findMany({
      where: { ...tenantScope, status: TaskStatus.PENDING },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        requestId: true,
        assigneeId: true,
        tenantId: true,
        stepName: true,
        dueAt: true,
      },
    }),
    prisma.auditLog.findMany({
      where: tenantScope,
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        actorUserId: true,
        tenantId: true,
        travelRequestId: true,
        entityType: true,
        entityId: true,
        action: true,
        createdAt: true,
      },
    }),
    prisma.request.findMany({
      where: { ...tenantScope, createdAt: { gte: daysAgo(180) } },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        createdAt: true,
        status: true,
        tenantId: true,
      },
    }),
  ]);

  const tenantIds = [
    ...recentRequests.map((request) => request.tenantId),
    ...recentTasks.map((task) => task.tenantId),
    ...recentAuditLogs.map((log) => log.tenantId),
    ...requestEvents.map((request) => request.tenantId),
  ];
  const userIds = [
    ...recentRequests.map((request) => request.requesterId),
    ...recentTasks.flatMap((task) => (task.assigneeId ? [task.assigneeId] : [])),
    ...recentAuditLogs.flatMap((log) => (log.actorUserId ? [log.actorUserId] : [])),
  ];
  const requestIds = recentTasks.map((task) => task.requestId);

  const [tenants, users, taskRequests] = await Promise.all([
    prisma.tenant.findMany({
      where: { id: { in: [...new Set(tenantIds)] } },
      select: { id: true, name: true, domain: true },
    }),
    prisma.user.findMany({
      where: { id: { in: [...new Set(userIds)] } },
      select: { id: true, firstName: true, lastName: true, email: true },
    }),
    prisma.request.findMany({
      where: { id: { in: [...new Set(requestIds)] } },
      select: { id: true, requestNumber: true, status: true },
    }),
  ]);

  const tenantById = new Map(tenants.map((tenant) => [tenant.id, tenant]));
  const userById = new Map(users.map((item) => [item.id, item]));
  const requestById = new Map(taskRequests.map((request) => [request.id, request]));
  const completedRequestCount = approvedRequestCount + rejectedRequestCount;
  const completionRate = requestCount ? Math.round((completedRequestCount / requestCount) * 100) : 0;
  const activeUserRate = userCount ? Math.round((activeUserCount / userCount) * 100) : 0;
  const approvalBacklogRate = requestCount ? Math.round((pendingRequestCount / requestCount) * 100) : 0;

  return {
    scope: isSuperAdmin ? "Platform" : "Tenant",
    generatedAt: formatDateTime(new Date()),
    kpis: [
      {
        id: "tenants",
        title: "Tenants",
        value: tenantCount,
        detail: `${activeTenantCount} with active users`,
        href: "/admin",
        tone: "info",
      },
      {
        id: "users",
        title: "Users",
        value: userCount,
        detail: `${activeUserRate}% active`,
        href: "/admin/users",
        tone: "success",
      },
      {
        id: "requests",
        title: "Requests",
        value: requestCount,
        detail: `${requestsCreated30Days} created in 30 days`,
        href: "/requests",
        tone: "neutral",
      },
      {
        id: "pending",
        title: "Pending approvals",
        value: pendingRequestCount,
        detail: `${approvalBacklogRate}% of request volume`,
        href: "/approvals",
        tone: pendingRequestCount ? "warning" : "success",
      },
      {
        id: "tasks",
        title: "Open tasks",
        value: pendingTaskCount,
        detail: `${overdueTaskCount} overdue`,
        href: "/tasks",
        tone: overdueTaskCount ? "danger" : "info",
      },
      {
        id: "completion",
        title: "Completion rate",
        value: `${completionRate}%`,
        detail: `${completedRequestCount} completed decisions`,
        href: "/reports/requests",
        tone: "success",
      },
    ],
    statusSummary: Object.values(RequestStatus).map((status) => ({
      status,
      label: statusLabel(status),
      count: statusCounts.find((item) => item.status === status)?._count._all ?? 0,
    })),
    taskSummary: Object.values(TaskStatus).map((status) => ({
      status,
      label: statusLabel(status),
      count: taskStatusCounts.find((item) => item.status === status)?._count._all ?? 0,
    })),
    recentRequests: recentRequests.map((request) => ({
      id: request.id,
      requestNumber: request.requestNumber,
      requester: personName(userById.get(request.requesterId)),
      tenant: tenantById.get(request.tenantId)?.name ?? "Unknown tenant",
      status: request.status,
      statusLabel: statusLabel(request.status),
      createdAt: formatDateTime(request.createdAt),
      href: `/requests/${request.id}`,
    })),
    pendingTasks: recentTasks.map((task) => ({
      id: task.id,
      title: task.stepName,
      requestNumber: requestById.get(task.requestId)?.requestNumber ?? "Unknown request",
      assignee: task.assigneeId ? personName(userById.get(task.assigneeId)) : "Unassigned",
      tenant: tenantById.get(task.tenantId)?.name ?? "Unknown tenant",
      dueAt: task.dueAt ? formatDateTime(task.dueAt) : "No due date",
      overdue: Boolean(task.dueAt && task.dueAt < now),
      href: `/tasks/${task.id}`,
    })),
    recentActivities: recentAuditLogs.map((log) => ({
      id: log.id,
      actor: log.actorUserId ? personName(userById.get(log.actorUserId)) : "System",
      tenant: tenantById.get(log.tenantId)?.name ?? "Unknown tenant",
      action: statusLabel(log.action),
      entityType: log.entityType,
      entityId: log.entityId,
      createdAt: formatDateTime(log.createdAt),
      href: log.travelRequestId ? `/requests/${log.travelRequestId}` : "/admin/audit-logs",
    })),
    requestEvents: requestEvents.map((request) => ({
      id: request.id,
      status: request.status,
      statusLabel: statusLabel(request.status),
      tenant: tenantById.get(request.tenantId)?.name ?? "Unknown tenant",
      createdAt: request.createdAt.toISOString(),
    })),
    totals: {
      notifications: notificationCount,
      approved: approvedRequestCount,
      rejected: rejectedRequestCount,
      overdueTasks: overdueTaskCount,
    },
    systemHealth: [
      {
        label: "Tenant scope",
        value: isSuperAdmin ? "Platform-wide" : "Tenant",
        state: "healthy" as const,
      },
      {
        label: "Workflow tasks",
        value: overdueTaskCount ? `${overdueTaskCount} overdue` : "On track",
        state: overdueTaskCount ? ("risk" as const) : ("healthy" as const),
      },
      {
        label: "Approval backlog",
        value: pendingRequestCount ? `${pendingRequestCount} pending` : "Clear",
        state: pendingRequestCount > 10 ? ("risk" as const) : ("healthy" as const),
      },
      {
        label: "Recent activity",
        value: recentAuditLogs.length ? "Auditing active" : "No recent logs",
        state: recentAuditLogs.length ? ("healthy" as const) : ("warning" as const),
      },
    ],
  };
}

export async function getRoleDashboardData(user: CurrentUser) {
  const isManager = user.roles.includes("MANAGER") || user.roles.includes("FINANCE") || user.roles.includes("ADMIN");
  const teamMembers = isManager
    ? await prisma.user.findMany({
        where: { tenantId: user.tenantId, managerId: user.id },
        select: { id: true, firstName: true, lastName: true, email: true },
      })
    : [];
  const teamMemberIds = teamMembers.map((member) => member.id);
  const requestWhere = isManager && teamMemberIds.length
    ? { tenantId: user.tenantId, requesterId: { in: teamMemberIds } }
    : { tenantId: user.tenantId, requesterId: user.id };
  const taskWhere = { tenantId: user.tenantId, assigneeId: user.id, status: TaskStatus.PENDING };

  const [
    myRequestCount,
    teamRequestCount,
    pendingTaskCount,
    pendingApprovalCount,
    statusCounts,
    recentRequests,
    openTasks,
  ] = await Promise.all([
    prisma.request.count({ where: { tenantId: user.tenantId, requesterId: user.id } }),
    prisma.request.count({ where: requestWhere }),
    prisma.workflowTask.count({ where: taskWhere }),
    prisma.workflowTask.count({ where: taskWhere }),
    prisma.request.groupBy({
      by: ["status"],
      where: requestWhere,
      _count: { _all: true },
    }),
    prisma.request.findMany({
      where: requestWhere,
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        requestNumber: true,
        requesterId: true,
        status: true,
        currentStep: true,
        createdAt: true,
        payload: true,
      },
    }),
    prisma.workflowTask.findMany({
      where: taskWhere,
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        requestId: true,
        stepName: true,
        status: true,
        dueAt: true,
        createdAt: true,
      },
    }),
  ]);

  const users = await prisma.user.findMany({
    where: { id: { in: [...new Set(recentRequests.map((request) => request.requesterId))] } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const taskRequests = await prisma.request.findMany({
    where: { id: { in: [...new Set(openTasks.map((task) => task.requestId))] } },
    select: { id: true, requestNumber: true },
  });
  const userById = new Map(users.map((item) => [item.id, item]));
  const requestById = new Map(taskRequests.map((request) => [request.id, request]));

  return {
    roleExperience: isManager ? ("manager" as const) : ("employee" as const),
    generatedAt: formatDateTime(new Date()),
    kpis: isManager
      ? [
          { title: "Pending approvals", value: pendingApprovalCount, detail: "Assigned approval work", href: "/approvals" },
          { title: "Team requests", value: teamRequestCount, detail: `${teamMemberIds.length} direct reports`, href: "/requests" },
          { title: "Open tasks", value: pendingTaskCount, detail: "Assigned workflow tasks", href: "/tasks" },
        ]
      : [
          { title: "My requests", value: myRequestCount, detail: "Submitted by you", href: "/requests" },
          { title: "My pending tasks", value: pendingTaskCount, detail: "Assigned workflow tasks", href: "/tasks" },
          { title: "Recent submissions", value: recentRequests.length, detail: "Latest visible requests", href: "/requests" },
        ],
    statusSummary: Object.values(RequestStatus).map((status) => ({
      status,
      label: statusLabel(status),
      count: statusCounts.find((item) => item.status === status)?._count._all ?? 0,
    })),
    recentRequests: recentRequests.map((request) => {
      const payload = request.payload as Record<string, unknown>;
      return {
        id: request.id,
        requestNumber: request.requestNumber,
        requester: personName(userById.get(request.requesterId)),
        title: String(payload.purpose ?? payload.requestTypeName ?? "Request"),
        statusLabel: statusLabel(request.status),
        currentStep: request.currentStep ?? "Not started",
        createdAt: formatDateTime(request.createdAt),
        href: `/requests/${request.id}`,
      };
    }),
    openTasks: openTasks.map((task) => ({
      id: task.id,
      title: task.stepName,
      requestNumber: requestById.get(task.requestId)?.requestNumber ?? "Unknown request",
      dueAt: task.dueAt ? formatDateTime(task.dueAt) : "No due date",
      overdue: Boolean(task.dueAt && task.dueAt < new Date()),
      href: `/tasks/${task.id}`,
    })),
  };
}
