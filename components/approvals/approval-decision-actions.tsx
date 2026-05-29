"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button, Card, Textarea } from "@/components/ui";

type ActionState =
  | { status: "idle" }
  | { status: "submitting"; decision: "APPROVED" | "REJECTED" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export function ApprovalDecisionActions({ taskId, disabled }: { taskId: string; disabled?: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>({ status: "idle" });

  async function processDecision(formElement: HTMLFormElement, decision: "APPROVED" | "REJECTED") {
    setState({ status: "submitting", decision });
    const form = new FormData(formElement);
    const response = await fetch("/api/approvals/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId,
        decision,
        comment: String(form.get("comment") ?? ""),
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setState({ status: "error", message: payload.error ?? "Unable to process approval." });
      return;
    }

    setState({ status: "success", message: `Request ${decision.toLowerCase()}.` });
    router.refresh();
  }

  async function submit(event: FormEvent<HTMLFormElement>, decision: "APPROVED" | "REJECTED") {
    event.preventDefault();
    await processDecision(event.currentTarget, decision);
  }

  return (
    <Card title="Approval Decision Panel">
      <form className="approval-decision-panel" onSubmit={(event) => submit(event, "APPROVED")}>
        <Textarea label="Decision comment" name="comment" placeholder="Add a short decision note" />
        {state.status === "error" ? <p className="error">{state.message}</p> : null}
        {state.status === "success" ? <p className="success">{state.message}</p> : null}
        <div className="approval-actions">
          <Button
            disabled={disabled}
            isLoading={state.status === "submitting" && state.decision === "REJECTED"}
            onClick={(event) => {
              const form = event.currentTarget.form;
              if (form) void processDecision(form, "REJECTED");
            }}
            type="button"
            variant="destructive"
          >
            Reject
          </Button>
          <Button disabled={disabled} isLoading={state.status === "submitting" && state.decision === "APPROVED"} type="submit">
            Approve
          </Button>
        </div>
      </form>
    </Card>
  );
}
