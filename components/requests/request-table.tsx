"use client";

import { Table } from "@/components/ui";
import { BpmStatus, StatusBadge } from "@/components/workflow";

export type RequestTableRow = {
  id: string;
  requestNumber: string;
  requester: string;
  department: string;
  destination: string;
  status: BpmStatus;
  currentStep?: string;
  estimatedCost: string;
  createdDate: string;
};

export interface RequestTableProps {
  rows: RequestTableRow[];
  isLoading?: boolean;
  error?: string;
}

export function RequestTable({ rows, isLoading, error }: RequestTableProps) {
  return (
    <Table<RequestTableRow>
      data={rows}
      isLoading={isLoading}
      error={error}
      getRowKey={(row) => row.id}
      columns={[
        { key: "requestNumber", header: "Request Number", sortable: true },
        { key: "requester", header: "Requester", sortable: true },
        { key: "department", header: "Department", sortable: true },
        { key: "destination", header: "Key Detail", sortable: true },
        { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "currentStep", header: "Current Step" },
        { key: "estimatedCost", header: "Estimated Cost", sortable: true },
        { key: "createdDate", header: "Created Date", sortable: true },
      ]}
    />
  );
}
