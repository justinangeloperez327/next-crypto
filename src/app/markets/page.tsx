import type { Metadata } from "next";
import { CircleHelp, DatabaseZap } from "lucide-react";
import { AssetTable } from "@/components/asset-table";
import { MarketFeed } from "@/components/market-feed";
import { ChartPanel } from "@/components/chart-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Markets",
  description: "View validated CoinGecko market quotes when configured, or browse the offline asset catalog.",
};

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <section>
        <Badge variant="outline"><CircleHelp size={13} aria-hidden="true" /> Static catalog preview</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Explore crypto markets</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Browse verified CoinGecko quotes when the server key is configured, with timestamps and stale-data warnings. An offline asset catalog remains below.
        </p>
      </section>
      <div role="status" className="flex items-start gap-3 rounded-xl border border-border bg-accent/40 px-4 py-4 text-sm">
        <DatabaseZap size={19} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <p className="leading-6"><strong>Source and freshness matter.</strong> Quotes are displayed only when received from CoinGecko. Without a configured key or valid provider response, no prices are invented.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Latest market snapshot</CardTitle>
          <CardDescription>CoinGecko · USD quotes · server-side caching and source timestamps</CardDescription>
        </CardHeader>
        <CardContent className="pt-5"><MarketFeed /></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Offline asset catalog</CardTitle>
          <CardDescription>Static reference names only · not rankings or live market data</CardDescription>
        </CardHeader>
        <CardContent className="pt-5"><AssetTable /></CardContent>
      </Card>
      <ChartPanel title="Price history" description="Interactive historical charts · planned" status="empty" />
    </div>
  );
}
