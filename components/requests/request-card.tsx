import { Card } from "@/components/ui";
import { BpmStatus, StatusBadge } from "@/components/workflow";

export interface RequestCardProps {
  requestNumber: string;
  purpose: string;
  status: BpmStatus;
  requester: string;
  destination: string;
  dateRange: string;
  estimatedCost: string;
  currentStep?: string;
  isLoading?: boolean;
  error?: string;
}

export function RequestCard({ 
  requestNumber, 
  purpose, 
  status, 
  requester, 
  destination, 
  dateRange, 
  estimatedCost, 
  currentStep,
  isLoading,
  error 
}: RequestCardProps) {
  if (isLoading) {
    return (
      <Card compact className="request-card request-card--loading">
        <div className="request-card__skeleton">Loading request...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card compact className="request-card request-card--error">
        <div className="request-card__error">{error}</div>
      </Card>
    );
  }

  return (
    <Card compact className="request-card">
      <div className="request-card__top">
        <strong>{requestNumber}</strong>
        <StatusBadge status={status} />
      </div>
      <h2>{purpose}</h2>
      <p>{requester} • {destination} • {dateRange}</p>
      <small>{estimatedCost}{currentStep ? ` • ${currentStep}` : ""}</small>
    </Card>
  );
}
