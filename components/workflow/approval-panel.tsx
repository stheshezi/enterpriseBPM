"use client";

import { useState } from "react";
import { Button, Textarea } from "@/components/ui";

export interface ApprovalPanelProps {
  approverName?: string;
  dueDate?: string;
  slaStatus?: "on-time" | "at-risk" | "overdue";
  disabled?: boolean;
  onApprove: (comment?: string) => void;
  onReject: (comment: string) => void;
}

export function ApprovalPanel({ approverName, dueDate, slaStatus = "on-time", disabled, onApprove, onReject }: ApprovalPanelProps) {
  const [comment, setComment] = useState("");
  const rejectionBlocked = comment.trim().length === 0;

  return (
    <section className={`approval-panel approval-panel--${slaStatus}`}>
      <div>
        <strong>{approverName ?? "Assigned approver"}</strong>
        <p>{dueDate ? `Due ${dueDate}` : "No due date set"}</p>
      </div>
      <Textarea label="Comment" value={comment} onChange={(event) => setComment(event.target.value)} disabled={disabled} />
      <div className="approval-panel__actions">
        <Button variant="success" disabled={disabled} onClick={() => onApprove(comment)}>Approve</Button>
        <Button variant="destructive" disabled={disabled || rejectionBlocked} onClick={() => onReject(comment)}>Reject</Button>
      </div>
    </section>
  );
}
