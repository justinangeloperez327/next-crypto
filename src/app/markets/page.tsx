import type { Metadata } from "next";
import { CircleHelp, DatabaseZap } from "lucide-react";
import { AssetTable } from "@/components/asset-table";
import { ChartPanel } from "@/components/chart-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Markets",
  description: "Browse a static preview asset catalog before verified cryptocurrency prices become available.",
};

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <section>
        <Badge variant="outline"><CircleHelp size={13} aria-hidden="true" /> Static catalog preview</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Explore crypto markets</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Search and sort a preview list of assets. All numerical market fields will remain unavailable until a verified provider is connected.
        </p>
      </section>
      <div role="status" className="flex items-start gap-3 rounded-xl border border-border bg-accent/40 px-4 py-4 text-sm">
        <DatabaseZap size={19} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <p className="leading-6"><strong>Market integration pending.</strong> Asset names are illustrative catalog entries, not rankings. No prices or percentage changes are live.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Asset catalog</CardTitle>
          <CardDescription>Searchable and sortable · 8 sample assets · data unavailable</CardDescription>
        </CardHeader>
        <CardContent className="pt-5"><AssetTable /></CardContent>
      </Card>
      <ChartPanel title="Price history" description="Interactive historical charts · planned" status="empty" />
    </div>
  );
}
