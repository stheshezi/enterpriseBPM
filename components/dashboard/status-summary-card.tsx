import { Card } from "@/components/ui";

export type StatusSummaryItem = {
  status: string;
  count: number;
  trend?: "up" | "down" | "neutral";
};

export interface StatusSummaryCardProps {
  title?: string;
  items: StatusSummaryItem[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export function StatusSummaryCard({ 
  title = "Request Status Summary", 
  items, 
  isLoading, 
  error,
  emptyMessage = "No data available"
}: StatusSummaryCardProps) {
  if (isLoading) {
    return (
      <Card compact className="status-summary-card status-summary-card--loading">
        <p className="component-state">Loading status summary...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card compact className="status-summary-card status-summary-card--error">
        <p className="component-state error">{error}</p>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card compact className="status-summary-card">
        <p className="component-state">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card compact className="status-summary-card" title={title}>
      <ol className="status-list">
        {items.map((item) => (
          <li key={item.status} className={`status-item status-item--${item.trend ?? "neutral"}`}>
            <span className="status-item__label">{item.status}</span>
            <strong className="status-item__value">{item.count}</strong>
          </li>
        ))}
      </ol>
    </Card>
  );
}
