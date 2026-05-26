export interface WorkflowStepProps {
  title: string;
  status: "completed" | "current" | "pending" | "rejected" | "cancelled" | "overdue";
  actorName?: string;
  timestamp?: string;
  description?: string;
}

export function WorkflowStep({ title, status, actorName, timestamp, description }: WorkflowStepProps) {
  return (
    <li className={`workflow-step workflow-step--${status}`}>
      <span className="workflow-step__marker" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{description ?? status}</p>
        {(actorName || timestamp) && <small>{[actorName, timestamp].filter(Boolean).join(" • ")}</small>}
      </div>
    </li>
  );
}
