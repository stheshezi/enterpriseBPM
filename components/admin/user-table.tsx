"use client";

import Link from "next/link";
import { Table } from "@/components/ui";
import { Button } from "@/components/ui";
import { AppRole } from "@/types/auth";
import { RoleBadge } from "@/components/admin/role-badge";

export type UserTableRow = {
  id: string;
  name: string;
  email: string;
  roles: AppRole[];
  department?: string;
  status: "Active" | "Inactive" | "Invited";
  lastLogin?: string;
};

export interface UserTableProps {
  rows: UserTableRow[];
  isLoading?: boolean;
  error?: string;
  detailHrefBase?: string;
}

export function UserTable({ rows, isLoading, error, detailHrefBase }: UserTableProps) {
  return (
    <Table<UserTableRow>
      data={rows}
      isLoading={isLoading}
      error={error}
      getRowKey={(row) => row.id}
      rowActions={detailHrefBase ? (row) => (
        <Link href={`${detailHrefBase}/${row.id}`}>
          <Button variant="outline" size="sm">View</Button>
        </Link>
      ) : undefined}
      columns={[
        { key: "name", header: "Name", sortable: true },
        { key: "email", header: "Email", sortable: true },
        { key: "roles", header: "Role", render: (row) => <span className="pill-list">{row.roles.map((role) => <RoleBadge key={role} role={role} />)}</span> },
        { key: "department", header: "Department", sortable: true },
        { key: "status", header: "Status", sortable: true },
        { key: "lastLogin", header: "Last Login", sortable: true },
      ]}
    />
  );
}
