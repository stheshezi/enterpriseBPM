"use client";

import { useState } from "react";
import { Modal, Textarea } from "@/components/ui";
import { ApprovalActions } from "@/components/approvals/approval-actions";

export interface ApprovalDecisionPanelProps {
  summary: string;
  slaWarning?: string;
  disabled?: boolean;
  onApprove: (comment?: string) => void;
  onReject: (comment: string) => void;
}

export function ApprovalDecisionPanel({ summary, slaWarning, disabled, onApprove, onReject }: ApprovalDecisionPanelProps) {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);

  return (
    <section className="approval-decision-panel">
      <strong>{summary}</strong>
      {slaWarning ? <p className="warning-text">{slaWarning}</p> : null}
      <Textarea label="Comment" value={comment} onChange={(event) => setComment(event.target.value)} disabled={disabled} />
      <ApprovalActions disabled={disabled} onApprove={() => setDecision("approve")} onReject={() => setDecision("reject")} />
      <Modal
        isOpen={decision !== null}
        title={decision === "approve" ? "Confirm approval" : "Confirm rejection"}
        description={decision === "reject" ? "A rejection comment is required." : "Confirm this approval decision."}
        onClose={() => setDecision(null)}
        footer={
          <ApprovalActions
            disabled={decision === "reject" && comment.trim().length === 0}
            onApprove={() => { if (decision === "approve") onApprove(comment); setDecision(null); }}
            onReject={() => { if (decision === "reject" && comment.trim()) onReject(comment); setDecision(null); }}
          />
        }
      />
    </section>
  );
}
