"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { DataState } from "@/components/data-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataColumn<T> = {
  id: string;
  label: string;
  cell: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number | null;
  className?: string;
};

type DataTableProps<T> = {
  label: string;
  rows: T[];
  columns: DataColumn<T>[];
  rowKey: (row: T) => string;
  searchValue?: (row: T) => string;
  pageSize?: number;
  status?: "ready" | "loading" | "error";
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function DataTable<T>({
  label, rows, columns, rowKey, searchValue, pageSize = 6,
  status = "ready", onRetry, emptyTitle, emptyDescription,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<{ id: string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = React.useState(0);
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const visible = React.useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const filtered = normalized && searchValue
      ? rows.filter((row) => searchValue(row).toLocaleLowerCase().includes(normalized))
      : rows;
    const sortingColumn = columns.find((column) => column.id === sort?.id);
    if (!sortingColumn?.sortValue || !sort) return filtered;
    return [...filtered].sort((a, b) => {
      const left = sortingColumn.sortValue!(a);
      const right = sortingColumn.sortValue!(b);
      if (left == null && right == null) return 0;
      if (left == null) return 1;
      if (right == null) return -1;
      const cmp = typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: "base" });
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [rows, columns, query, sort, searchValue]);
  const maxPage = Math.max(0, Math.ceil(visible.length / safePageSize) - 1);
  const currentPage = Math.min(page, maxPage);
  const paginated = visible.slice(currentPage * safePageSize, (currentPage + 1) * safePageSize);

  function toggleSort(id: string) {
    setPage(0);
    setSort((previous) =>
      previous?.id === id
        ? previous.direction === "asc" ? { id, direction: "desc" } : null
        : { id, direction: "asc" }
    );
  }
  return (
    <div>
      {searchValue && (
        <div className="relative mb-4 w-full sm:max-w-[320px]">
          <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-muted-foreground" />
          <Input
            type="search"
            aria-label={`Search ${label}`}
            placeholder="Search assets..."
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(0); }}
            className="pl-10"
          />
        </div>
      )}
      {status === "loading" ? <DataState state="loading" /> : status === "error" ? (
        <DataState state="error" onRetry={onRetry} />
      ) : visible.length === 0 ? (
        <DataState state="empty" title={query ? "No matching results" : emptyTitle} description={query ? "Try a different search term." : emptyDescription} />
      ) : (
        <>
          <Table>
            <caption className="sr-only">{label}</caption>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id} className={column.className} aria-sort={sort?.id === column.id ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}>
                    {column.sortValue ? (
                      <button type="button" className="inline-flex min-h-10 items-center gap-1.5 rounded-md font-medium hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring" onClick={() => toggleSort(column.id)} aria-label={`Sort by ${column.label}`}>
                        {column.label}
                        {sort?.id === column.id
                          ? sort.direction === "asc" ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" />
                          : <ArrowUpDown size={13} aria-hidden="true" />}
                      </button>
                    ) : column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((column) => <TableCell key={column.id} className={cn("text-foreground", column.className)}>{column.cell(row)}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-1 pt-4">
            <p role="status" className="text-xs text-muted-foreground">
              Showing {currentPage * safePageSize + 1}–{Math.min((currentPage + 1) * safePageSize, visible.length)} of {visible.length}
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}>Previous</Button>
              <span className="min-w-16 text-center text-xs tabular-nums text-muted-foreground" aria-label="Current page">
                {currentPage + 1} / {maxPage + 1}
              </span>
              <Button type="button" variant="outline" size="sm" disabled={currentPage >= maxPage} onClick={() => setPage((value) => Math.min(maxPage, value + 1))}>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
