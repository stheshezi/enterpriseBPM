import React from "react";

export interface CardProps {
  title?: string;
  description?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  bordered?: boolean;
  elevated?: boolean;
  compact?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  title,
  description,
  header,
  footer,
  actions,
  bordered = true,
  elevated = false,
  compact = false,
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={[
        "ui-card",
        bordered ? "ui-card--bordered" : "",
        elevated ? "ui-card--elevated" : "",
        compact ? "ui-card--compact" : "",
        className,
      ].join(" ")}
    >
      {(header || title || description || actions) && (
        <div className="ui-card__header">
          {header ?? (
            <div>
              {title ? <h2>{title}</h2> : null}
              {description ? <p>{description}</p> : null}
            </div>
          )}
          {actions ? <div className="ui-card__actions">{actions}</div> : null}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
      {footer ? <div className="ui-card__footer">{footer}</div> : null}
    </section>
  );
}
