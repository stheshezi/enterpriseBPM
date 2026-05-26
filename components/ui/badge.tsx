import React from "react";

export type BadgeVariant = "default" | "info" | "success" | "warning" | "danger" | "neutral" | "outline";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return <span className={`ui-badge ui-badge--${variant} ${className}`}>{children}</span>;
}
