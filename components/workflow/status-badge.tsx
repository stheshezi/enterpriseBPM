import { Badge, BadgeVariant } from "@/components/ui";

export type BpmStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_MANAGER_APPROVAL"
  | "PENDING_FINANCE_APPROVAL"
  | "PENDING_LM"
  | "PENDING_BUMA"
  | "PENDING_C5"
  | "PENDING_CEO"
  | "MANAGER_APPROVAL"
  | "FINANCE_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "OVERDUE"
  | "PENDING";

const statusMap: Record<BpmStatus, { label: string; variant: BadgeVariant }> = {
  DRAFT: { label: "Draft", variant: "neutral" },
  SUBMITTED: { label: "Submitted", variant: "info" },
  PENDING_MANAGER_APPROVAL: { label: "Manager approval", variant: "warning" },
  PENDING_FINANCE_APPROVAL: { label: "Finance approval", variant: "warning" },
  PENDING_LM: { label: "Line manager", variant: "warning" },
  PENDING_BUMA: { label: "Business unit manager", variant: "warning" },
  PENDING_C5: { label: "C5 executive", variant: "warning" },
  PENDING_CEO: { label: "CEO approval", variant: "warning" },
  MANAGER_APPROVAL: { label: "Manager approval", variant: "warning" },
  FINANCE_APPROVAL: { label: "Finance approval", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  CANCELLED: { label: "Cancelled", variant: "neutral" },
  COMPLETED: { label: "Completed", variant: "success" },
  OVERDUE: { label: "Overdue", variant: "danger" },
  PENDING: { label: "Pending", variant: "warning" },
};

export interface StatusBadgeProps {
  status: BpmStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const mapped = statusMap[status] ?? { label: status, variant: "default" as const };
  return <Badge variant={mapped.variant}>{mapped.label}</Badge>;
}
