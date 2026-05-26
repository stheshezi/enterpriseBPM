import React from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/layout/breadcrumbs";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  statusBadge?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  primaryAction,
  secondaryAction,
  statusBadge,
}: PageHeaderProps) {
  return (
    <section className="page-header">
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="page-header__main">
        <div>
          <div className="page-header__title">
            <h1>{title}</h1>
            {statusBadge}
          </div>
          {description ? <p>{description}</p> : null}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="page-header__actions">
            {secondaryAction}
            {primaryAction}
          </div>
        )}
      </div>
    </section>
  );
}
