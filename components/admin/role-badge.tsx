import { Badge, BadgeVariant } from "@/components/ui";
import type { AppRole } from "@/types/auth";

const roleMap: Record<AppRole, { label: string; variant: BadgeVariant }> = {
  SUPER_ADMIN: { label: "Super Admin", variant: "danger" },
  ADMIN: { label: "Tenant Admin", variant: "info" },
  MANAGER: { label: "Manager", variant: "success" },
  FINANCE: { label: "Finance Approver", variant: "warning" },
  REQUESTER: { label: "Requester", variant: "neutral" },
};

export interface RoleBadgeProps {
  role: AppRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const mapped = roleMap[role];
  return <Badge variant={mapped.variant}>{mapped.label}</Badge>;
}
