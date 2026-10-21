import type { Metadata } from "next";
import { ArrowUpRight, LockKeyhole, Wallet } from "lucide-react";
import { ChartPanel } from "@/components/chart-panel";
import { DataState } from "@/components/data-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A planned, non-custodial cryptocurrency portfolio tracker.",
};

export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      <section>
        <Badge variant="outline"><LockKeyhole size={13} aria-hidden="true" /> Accounts not enabled</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Portfolio tracker</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          A private, non-custodial ledger for your manually entered transactions. Holdings and performance charts are scheduled for later development phases.
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Portfolio balance", value: "—", hint: "No transactions yet" },
          { label: "Total return", value: "—", hint: "Calculations not enabled" },
          { label: "Tracked positions", value: "—", hint: "Accounts not enabled" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5 sm:pt-6">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold" aria-label={`${stat.label}: unavailable`}>{stat.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
        <ChartPanel title="Portfolio performance" description="Time-weighted and cash-flow-aware analysis · planned" status="empty" />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Wallet size={18} className="text-primary" aria-hidden="true" /><CardTitle>Holdings</CardTitle></div>
            <CardDescription className="mt-1">Your asset allocation</CardDescription>
          </CardHeader>
          <CardContent><DataState state="empty" title="No holdings recorded" description="After accounts and a transaction ledger are implemented, positions will appear here." compact /></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
          <CardDescription className="mt-1">Manual entries, fees and cost basis · Group 9</CardDescription>
        </CardHeader>
        <CardContent>
          <DataState state="empty" title="Transaction history is empty" description="Recording transactions is not available until authentication and persistence are ready." compact />
          <a className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline" href="https://github.com/justinangeloperez327/next-crypto#roadmap" target="_blank" rel="noopener noreferrer">
            View planned capabilities <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
