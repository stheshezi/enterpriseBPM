import { Button } from "@/components/ui";

export interface ApprovalActionsProps {
  disabled?: boolean;
  isApproving?: boolean;
  isRejecting?: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalActions({ disabled, isApproving, isRejecting, onApprove, onReject }: ApprovalActionsProps) {
  return (
    <div className="approval-actions">
      <Button variant="success" disabled={disabled || isRejecting} isLoading={isApproving} onClick={onApprove}>Approve</Button>
      <Button variant="destructive" disabled={disabled || isApproving} isLoading={isRejecting} onClick={onReject}>Reject</Button>
    </div>
  );
}
