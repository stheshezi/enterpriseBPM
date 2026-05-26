import { Card } from "@/components/ui";

export interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function KpiCard({ title, value, description, trend = "neutral", trendLabel, icon, isLoading }: KpiCardProps) {
  return (
    <Card compact className="kpi-card">
      <div className="kpi-card__top">{icon}<span>{title}</span></div>
      <strong>{isLoading ? "..." : value}</strong>
      {description ? <p>{description}</p> : null}
      {trendLabel ? <small className={`trend trend--${trend}`}>{trendLabel}</small> : null}
    </Card>
  );
}
