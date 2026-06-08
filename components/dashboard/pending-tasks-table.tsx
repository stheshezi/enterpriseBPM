"use client";

import Link from "next/link";
import { Button, Table } from "@/components/ui";

export type PendingTaskTableRow = {
  id: string;
  requestNumber: string;
  title: string;
  tenant: string;
  assignee: string;
  dueAt: string;
  overdue: boolean;
  href: string;
};

export interface PendingTasksTableProps {
  rows: PendingTaskTableRow[];
  actionLabel: string;
  emptyMessage: string;
}

export function PendingTasksTable({ rows, actionLabel, emptyMessage }: PendingTasksTableProps) {
  return (
    <Table<PendingTaskTableRow>
      data={rows}
      getRowKey={(row) => row.id}
      columns={[
        { key: "requestNumber", header: "Request Number", sortable: true },
        { key: "title", header: "Step Name", sortable: true },
        { key: "tenant", header: "Tenant", sortable: true },
        { key: "assignee", header: "Assignee", sortable: true },
        {
          key: "dueAt",
          header: "Due Date",
          sortable: true,
          render: (row) => (
            <span className={row.overdue ? "text-red-600 font-medium" : ""}>
              {row.dueAt} {row.overdue && "(Overdue)"}
            </span>
          ),
        },
      ]}
      rowActions={(row) => (
        <Link href={row.href}>
          <Button variant="outline" size="sm">{actionLabel}</Button>
        </Link>
      )}
      emptyMessage={emptyMessage}
    />
  );
}
