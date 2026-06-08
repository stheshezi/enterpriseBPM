"use client";

import Link from "next/link";
import { Table } from "@/components/ui/table";

export type AdminRequestTableRow = {
  id: string;
  requestNumber: string;
  type: string;
  requester: string;
  department: string;
  assignee: string;
  approvalLevel: string;
  status: string;
  estimatedCost: string;
  daysPending: string;
  createdAt: string;
  updatedAt: string;
  href: string;
};

export interface AdminRequestsTableProps {
  rows: AdminRequestTableRow[];
}

export function AdminRequestsTable({ rows }: AdminRequestsTableProps) {
  return (
    <Table<AdminRequestTableRow>
      data={rows}
      getRowKey={(row) => row.id}
      columns={[
        { key: "requestNumber", header: "Request Number", sortable: true },
        { key: "type", header: "Request Type", sortable: true },
        { key: "requester", header: "Requester", sortable: true },
        { key: "department", header: "Department", sortable: true },
        { key: "assignee", header: "Current Assignee", sortable: true },
        { key: "approvalLevel", header: "Approval Level", sortable: true },
        { key: "status", header: "Status", sortable: true },
        { key: "estimatedCost", header: "Estimated Cost", sortable: true },
        { key: "daysPending", header: "Days Pending", sortable: true },
        { key: "createdAt", header: "Created Date", sortable: true },
        { key: "updatedAt", header: "Last Updated", sortable: true },
      ]}
      rowActions={(row) => (
        <Link href={row.href}>
          <button className="text-blue-600 hover:underline" type="button">View</button>
        </Link>
      )}
      emptyMessage="No requests found."
    />
  );
}
