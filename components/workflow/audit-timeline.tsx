export type AuditTimelineEvent = {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
  origin?: "system" | "user";
};

export interface AuditTimelineProps {
  events: AuditTimelineEvent[];
  isLoading?: boolean;
}

export function AuditTimeline({ events, isLoading }: AuditTimelineProps) {
  if (isLoading) return <div className="component-state">Loading audit trail...</div>;
  if (!events.length) return <div className="component-state">No audit events yet.</div>;

  return (
    <ol className="audit-timeline">
      {events.map((event) => (
        <li key={event.id}>
          <strong>{event.action}</strong>
          <p>{event.actor} • {event.timestamp} • {event.origin ?? "user"}</p>
          {(event.oldValue || event.newValue) && <small>{event.oldValue ?? "-"} → {event.newValue ?? "-"}</small>}
        </li>
      ))}
    </ol>
  );
}
