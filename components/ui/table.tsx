"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export type TableColumn<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  pageSize?: number;
  rowActions?: (row: T) => React.ReactNode;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  getRowKey,
  isLoading,
  error,
  emptyMessage = "No records found.",
  pageSize = 10,
  rowActions,
}: TableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const next = data.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
    if (!sortKey) return next;
    return [...next].sort((a, b) => {
      const aValue = String(a[sortKey] ?? "");
      const bValue = String(b[sortKey] ?? "");
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }, [data, query, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="ui-table">
      <div className="ui-table__toolbar">
        <input placeholder="Filter" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} aria-label="Filter table" />
      </div>
      {error ? <div className="ui-table__state ui-table__state--error">{error}</div> : null}
      {isLoading ? <div className="ui-table__state">Loading...</div> : null}
      {!isLoading && !error && pageRows.length === 0 ? <div className="ui-table__state">{emptyMessage}</div> : null}
      {!isLoading && !error && pageRows.length > 0 ? (
        <div className="ui-table__scroll">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)}>
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSortKey(String(column.key));
                          setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                        }}
                      >
                        {column.header}
                      </button>
                    ) : column.header}
                  </th>
                ))}
                {rowActions ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={getRowKey(row)}>
                  {columns.map((column) => (
                    <td key={String(column.key)}>{column.render ? column.render(row) : String(row[column.key] ?? "")}</td>
                  ))}
                  {rowActions ? <td>{rowActions(row)}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="ui-table__pagination">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
        <span>Page {page} of {pageCount}</span>
        <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Next</Button>
      </div>
    </div>
  );
}
