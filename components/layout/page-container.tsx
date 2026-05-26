import React from "react";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <main className={`layout-page-container ${className}`}>{children}</main>;
}
