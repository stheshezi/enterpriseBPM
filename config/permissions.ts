import type { AppPermission } from "@/types/auth";

export const PERMISSIONS = {
  TENANT_MANAGE: "tenant.manage",
  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",
  ROLES_MANAGE: "roles.manage",
  REQUESTS_CREATE: "requests.create",
  REQUESTS_VIEW_OWN: "requests.view.own",
  REQUESTS_VIEW_TENANT: "requests.view.tenant",
  REQUESTS_APPROVE_MANAGER: "requests.approve.manager",
  REQUESTS_APPROVE_FINANCE: "requests.approve.finance",
  REQUESTS_CANCEL_OWN: "requests.cancel.own",
  TASKS_VIEW_ASSIGNED: "tasks.view.assigned",
  REPORTS_VIEW: "reports.view",
  AUDIT_VIEW: "audit.view",
  SYSTEM_ADMIN: "system.admin",
} as const satisfies Record<string, AppPermission>;

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
