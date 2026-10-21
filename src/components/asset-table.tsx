"use client";

import { CircleHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataColumn } from "@/components/data-table";
import { PREVIEW_ASSETS, type PreviewAsset } from "@/lib/market-preview";

const columns: DataColumn<PreviewAsset>[] = [
  {
    id: "name", label: "Asset", sortValue: (row) => row.name,
    cell: (row) => (
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold">{row.symbol.slice(0, 2)}</span>
        <span className="flex flex-col gap-0.5">
          <strong className="font-medium">{row.name}</strong>
          <small className="text-xs text-muted-foreground">{row.symbol}</small>
        </span>
      </div>
    ),
  },
  { id: "category", label: "Category", sortValue: (row) => row.category, cell: (row) => <span className="text-muted-foreground">{row.category}</span> },
  { id: "price", label: "Price (USD)", cell: () => <span aria-label="Price unavailable" className="text-muted-foreground">—</span> },
  { id: "change", label: "24h change", cell: () => <span aria-label="Change unavailable" className="text-muted-foreground">—</span> },
  {
    id: "status", label: "Data status",
    cell: () => <Badge variant="outline"><CircleHelp size={12} aria-hidden="true" /> Not connected</Badge>,
  },
];

export function AssetTable({ compact = false }: { compact?: boolean }) {
  return (
    <DataTable
      label="Asset catalog preview"
      rows={compact ? [...PREVIEW_ASSETS.slice(0, 5)] : [...PREVIEW_ASSETS]}
      columns={columns}
      rowKey={(row) => row.symbol}
      searchValue={compact ? undefined : (row) => `${row.name} ${row.symbol} ${row.category}`}
      pageSize={compact ? 5 : 6}
      emptyTitle="No assets available"
      emptyDescription="The asset catalog is not available."
    />
  );
}
