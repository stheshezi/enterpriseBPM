import { Card } from "@/components/ui";

export interface SlaOverviewCardProps {
  onTimeCount: number;
  atRiskCount: number;
  overdueCount: number;
  averageCompletionTime?: string;
  slaBreachRate?: string;
  isLoading?: boolean;
  error?: string;
}

export function SlaOverviewCard({ 
  onTimeCount, 
  atRiskCount, 
  overdueCount, 
  averageCompletionTime, 
  slaBreachRate,
  isLoading,
  error
}: SlaOverviewCardProps) {
  if (isLoading) {
    return (
      <Card compact className="sla-overview-card sla-overview-card--loading">
        <p className="component-state">Loading SLA data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card compact className="sla-overview-card sla-overview-card--error">
        <p className="component-state error">{error}</p>
      </Card>
    );
  }

  return (
    <Card compact className="sla-overview-card" title="SLA Overview">
      <div className="sla-metrics">
        <div className="sla-metric sla-metric--on-time">
          <strong>{onTimeCount}</strong>
          <small>On time</small>
        </div>
        <div className="sla-metric sla-metric--at-risk">
          <strong>{atRiskCount}</strong>
          <small>At risk</small>
        </div>
        <div className="sla-metric sla-metric--overdue">
          <strong>{overdueCount}</strong>
          <small>Overdue</small>
        </div>
      </div>
      {averageCompletionTime || slaBreachRate ? (
        <div className="sla-stats">
          {averageCompletionTime ? <p>Avg completion: <strong>{averageCompletionTime}</strong></p> : null}
          {slaBreachRate ? <p>SLA breach rate: <strong>{slaBreachRate}</strong></p> : null}
        </div>
      ) : null}
    </Card>
  );
}
