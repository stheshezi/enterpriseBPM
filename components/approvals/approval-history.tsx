import { Badge, Card } from "@/components/ui";

export type ApprovalHistoryItem = {
  id: string;
  approverName: string;
  role: string;
  decision: "APPROVED" | "REJECTED";
  comment?: string;
  timestamp: string;
  stepName: string;
};

export interface ApprovalHistoryProps {
  items: ApprovalHistoryItem[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export function ApprovalHistory({ 
  items, 
  isLoading,
  error,
  emptyMessage = "No approval decisions yet."
}: ApprovalHistoryProps) {
  return (
    <Card title="Approval history">
      {isLoading ? (
        <div className="component-state">Loading approval history...</div>
      ) : null}
      {error ? (
        <div className="component-state error">{error}</div>
      ) : null}
      {!isLoading && !error && !items.length ? (
        <div className="component-state">{emptyMessage}</div>
      ) : null}
      {!isLoading && !error && items.map((item) => (
        <article className="history-item" key={item.id}>
          <Badge variant={item.decision === "APPROVED" ? "success" : "danger"}>{item.decision}</Badge>
          <strong>{item.approverName}</strong>
          <p>{item.role} • {item.stepName} • {item.timestamp}</p>
          {item.comment ? <small>{item.comment}</small> : null}
        </article>
      ))}
    </Card>
  );
}
