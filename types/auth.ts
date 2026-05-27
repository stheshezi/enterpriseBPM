export type AppRole = "SUPER_ADMIN" | "ADMIN" | "IT_SUPPORT" | "MANAGER" | "FINANCE" | "REQUESTER";

export type AppPermission =
  | "tenant.manage"
  | "users.view"
  | "users.manage"
  | "roles.manage"
  | "requests.create"
  | "requests.view.own"
  | "requests.view.tenant"
  | "requests.approve.manager"
  | "requests.approve.finance"
  | "requests.cancel.own"
  | "tasks.view.assigned"
  | "reports.view"
  | "audit.view"
  | "system.admin";

export type RoleDefinition = {
  name: AppRole;
  label: string;
  description: string;
  permissions: AppPermission[];
};

export type CurrentUser = {
  id: string;
  email: string;
  name?: string | null;
  tenantId: string;
  tenantDomain?: string | null;
  roles: AppRole[];
  permissions: AppPermission[];
};
