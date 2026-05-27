import { ALL_PERMISSIONS, PERMISSIONS } from "@/config/permissions";
import type { AppPermission, AppRole, RoleDefinition } from "@/types/auth";

export const ROLE_DEFINITIONS: Record<AppRole, RoleDefinition> = {
  SUPER_ADMIN: {
    name: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Godlevel platform owner with every system and tenant permission.",
    permissions: ALL_PERMISSIONS,
  },
  ADMIN: {
    name: "ADMIN",
    label: "Tenant Admin",
    description: "Runs tenant users, roles, reporting, and operational oversight.",
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_MANAGE,
      PERMISSIONS.ROLES_MANAGE,
      PERMISSIONS.REQUESTS_CREATE,
      PERMISSIONS.REQUESTS_VIEW_OWN,
      PERMISSIONS.REQUESTS_VIEW_TENANT,
      PERMISSIONS.REQUESTS_CANCEL_OWN,
      PERMISSIONS.TASKS_VIEW_ASSIGNED,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.AUDIT_VIEW,
    ],
  },
  IT_SUPPORT: {
    name: "IT_SUPPORT",
    label: "IT Support",
    description: "Supports users, monitors workflow health, and investigates access or routing issues.",
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_MANAGE,
      PERMISSIONS.REQUESTS_VIEW_TENANT,
      PERMISSIONS.TASKS_VIEW_ASSIGNED,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.AUDIT_VIEW,
      PERMISSIONS.SYSTEM_ADMIN,
    ],
  },
  MANAGER: {
    name: "MANAGER",
    label: "Manager",
    description: "Reviews team travel requests and handles manager approval tasks.",
    permissions: [
      PERMISSIONS.REQUESTS_CREATE,
      PERMISSIONS.REQUESTS_VIEW_OWN,
      PERMISSIONS.REQUESTS_VIEW_TENANT,
      PERMISSIONS.REQUESTS_APPROVE_MANAGER,
      PERMISSIONS.REQUESTS_CANCEL_OWN,
      PERMISSIONS.TASKS_VIEW_ASSIGNED,
    ],
  },
  FINANCE: {
    name: "FINANCE",
    label: "Finance",
    description: "Reviews budget impact and handles finance approval tasks.",
    permissions: [
      PERMISSIONS.REQUESTS_CREATE,
      PERMISSIONS.REQUESTS_VIEW_OWN,
      PERMISSIONS.REQUESTS_VIEW_TENANT,
      PERMISSIONS.REQUESTS_APPROVE_FINANCE,
      PERMISSIONS.TASKS_VIEW_ASSIGNED,
      PERMISSIONS.REPORTS_VIEW,
    ],
  },
  REQUESTER: {
    name: "REQUESTER",
    label: "Requester",
    description: "Creates and tracks their own travel requests.",
    permissions: [
      PERMISSIONS.REQUESTS_CREATE,
      PERMISSIONS.REQUESTS_VIEW_OWN,
      PERMISSIONS.REQUESTS_CANCEL_OWN,
    ],
  },
};

export const ROLE_NAMES = Object.keys(ROLE_DEFINITIONS) as AppRole[];

export function getPermissionsForRoles(roles: string[]): AppPermission[] {
  const permissionSet = new Set<AppPermission>();

  for (const role of roles) {
    const definition = ROLE_DEFINITIONS[role as AppRole];
    definition?.permissions.forEach((permission) => permissionSet.add(permission));
  }

  return [...permissionSet];
}

export function hasPermission(
  roles: string[] | undefined,
  permission: AppPermission,
): boolean {
  if (!roles?.length) return false;
  return getPermissionsForRoles(roles).includes(permission);
}
