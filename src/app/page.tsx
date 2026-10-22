import Link from "next/link";
import {
  Activity, ArrowRight, ArrowUpRight, CircleCheck, Clock3,
  Layers3, RadioTower, ShieldCheck, Star, Wallet,
} from "lucide-react";
import { AssetTable } from "@/components/asset-table";
import { MarketFeed } from "@/components/market-feed";
import { ChartPanel } from "@/components/chart-panel";
import { DataState } from "@/components/data-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { title: "Market capitalization", subtitle: "Global crypto market", icon: Layers3 },
  { title: "24h trading volume", subtitle: "Aggregated USD volume", icon: Activity },
  { title: "Portfolio value", subtitle: "Your recorded holdings", icon: Wallet },
  { title: "Watchlist assets", subtitle: "Saved to your account", icon: Star },
] as const;

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Badge variant="default"><span className="size-1.5 rounded-full bg-primary" aria-hidden="true" /> Group 3 · API integration</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 size={14} aria-hidden="true" /> CoinGecko Demo key required for prices</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Market overview</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Your cryptocurrency workspace, structured for clarity. Verified market snapshots appear below when CoinGecko is configured; account data remains unavailable.
          </p>
        </div>
        <Button asChild><Link href="/markets">Explore markets <ArrowUpRight size={16} aria-hidden="true" /></Link></Button>
      </section>

      <section aria-label="Market and portfolio summary" className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {metrics.map(({ title, subtitle, icon: Icon }) => (
          <Card key={title}>
            <CardContent className="pt-5 sm:pt-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-muted-foreground">{title}</p>
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon size={17} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight" aria-label={`${title}: unavailable`}>—</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{subtitle} · unavailable</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section aria-labelledby="market-feed-heading">
        <Card>
          <CardHeader>
            <CardTitle id="market-feed-heading">Latest market snapshot</CardTitle>
            <CardDescription className="mt-1">CoinGecko · Top 20 market-cap assets · USD · provider timestamps and stale-data warnings</CardDescription>
          </CardHeader>
          <CardContent className="pt-5"><MarketFeed compact /></CardContent>
        </Card>
      </section>

      <section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <ChartPanel
          title="Market trend"
          description="Historical price series · USD"
          status="empty"
        />
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>My watchlist</CardTitle>
                <CardDescription className="mt-1">Assets you want to follow</CardDescription>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Star size={18} aria-hidden="true" /></span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-border bg-background/50">
              <DataState state="empty" compact title="No saved assets" description="Watchlists will become available when authenticated accounts are implemented." />
            </div>
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link href="/watchlist">View watchlist <ArrowRight size={15} aria-hidden="true" /></Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="assets-heading">
        <Card>
          <CardHeader className="flex-row flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle id="assets-heading">Asset explorer</CardTitle>
              <CardDescription className="mt-1">
                Offline reference names only · not an ordered market ranking or a live quote table
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild><Link href="/markets">All markets <ArrowRight size={15} aria-hidden="true" /></Link></Button>
          </CardHeader>
          <CardContent className="pt-5">
            <AssetTable compact />
          </CardContent>
        </Card>
      </section>

      <section aria-label="Connection roadmap" className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Data readiness</CardTitle>
            <CardDescription className="mt-1">Visible milestones for a dependable market dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-3">
            {[
              { title: "Dashboard architecture", text: "Accessible shell, theme tokens and reusable components", ready: true },
              { title: "Verified market API", text: "Server adapter, caching, attribution and bounded stale fallback (key required)", ready: true },
              { title: "Authenticated portfolio", text: "User accounts, stored transactions and performance analytics", ready: false },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {item.ready ? <CircleCheck size={18} className="text-primary" aria-hidden="true" /> : <RadioTower size={18} aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.text}</p>
                </div>
                <Badge variant={item.ready ? "default" : "outline"}>{item.ready ? "Ready" : "Planned"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-accent/40">
          <CardHeader>
            <span className="mb-2 flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-accent text-accent-foreground">
              <ShieldCheck size={20} aria-hidden="true" />
            </span>
            <CardTitle>Built for transparency</CardTitle>
            <CardDescription className="mt-2">No fake quotes, simulated growth or investment recommendations. Quotes will carry source and freshness information.</CardDescription>
          </CardHeader>
          <CardContent>
            <a className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" href="https://github.com/justinangeloperez327/next-crypto#roadmap" target="_blank" rel="noopener noreferrer">
              Explore the roadmap <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
