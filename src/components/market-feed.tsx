"use client";

import * as React from "react";
import { ArrowUpRight, Clock3, RefreshCw, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/data-state";
import { DataTable, type DataColumn } from "@/components/data-table";
import type { MarketAsset, MarketResult } from "@/lib/market/types";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const preciseUsd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 8 });
const compactUsd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 2 });

export function formatPrice(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  return (value > 0 && value < 1 ? preciseUsd : usd).format(value);
}
export function formatLarge(value: number | null) {
  return value === null || !Number.isFinite(value) ? "—" : compactUsd.format(value);
}
export function formatChange(value: number | null) {
  return value === null || !Number.isFinite(value) ? "—" : `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

const columns: DataColumn<MarketAsset>[] = [
  { id: "rank", label: "#", sortValue: (a) => a.rank, cell: (a) => <span className="text-muted-foreground tabular-nums">{a.rank ?? "—"}</span> },
  {
    id: "asset", label: "Asset", sortValue: (a) => a.name,
    cell: (a) => <span className="flex flex-col gap-0.5"><strong className="font-medium">{a.name}</strong><small className="text-xs text-muted-foreground">{a.symbol}</small></span>,
  },
  { id: "price", label: "Price (USD)", sortValue: (a) => a.priceUsd, cell: (a) => <span className="tabular-nums">{formatPrice(a.priceUsd)}</span> },
  { id: "change", label: "24h", sortValue: (a) => a.change24hPercent, cell: (a) => <span className={`tabular-nums ${a.change24hPercent === null ? "text-muted-foreground" : a.change24hPercent < 0 ? "text-destructive" : "text-primary"}`}>{formatChange(a.change24hPercent)}</span> },
  { id: "cap", label: "Market cap", sortValue: (a) => a.marketCapUsd, cell: (a) => <span className="tabular-nums">{formatLarge(a.marketCapUsd)}</span> },
  { id: "volume", label: "24h volume", sortValue: (a) => a.volume24hUsd, cell: (a) => <span className="tabular-nums">{formatLarge(a.volume24hUsd)}</span> },
  {
    id: "asof", label: "Source updated",
    cell: (a) => a.sourceUpdatedAt ? <time dateTime={a.sourceUpdatedAt} className="text-xs text-muted-foreground">{new Date(a.sourceUpdatedAt).toLocaleString()}</time> : <span className="text-muted-foreground">Unknown</span>,
  },
];

const reasons: Record<string, string> = {
  not_configured: "A CoinGecko Demo API key has not been configured on the server. Add COINGECKO_DEMO_API_KEY to enable real prices.",
  authentication_error: "CoinGecko rejected the configured API key. Check the server configuration.",
  rate_limited: "CoinGecko has limited requests. The feed will become available after the rate-limit window.",
  provider_unavailable: "The market-data provider is temporarily unavailable.",
  invalid_response: "The provider returned data that failed validation.",
  timeout: "The provider did not respond before the request timeout.",
};

export function MarketFeed({ compact = false }: { compact?: boolean }) {
  const [result, setResult] = React.useState<MarketResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [networkError, setNetworkError] = React.useState(false);

  const load = React.useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setNetworkError(false);
    try {
      const response = await fetch("/api/markets", { signal, cache: "no-store" });
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || !("status" in payload)) throw new Error("Invalid API response");
      const data = payload as MarketResult;
      if (data.status !== "unavailable" && data.status !== "fresh" && data.status !== "stale") throw new Error("Invalid API status");
      if (data.status !== "unavailable" && (!data.snapshot || !Array.isArray(data.snapshot.assets))) throw new Error("Invalid snapshot");
      if (!response.ok && data.status !== "unavailable") throw new Error("Unexpected API failure");
      setResult(data);
    } catch (error) {
      if (signal?.aborted || (error instanceof Error && error.name === "AbortError")) return;
      setNetworkError(true);
      setResult(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const snapshot = result && result.status !== "unavailable" ? result.snapshot : null;
  const stale = result?.status === "stale";
  const unavailable = result?.status === "unavailable";
  const staleWarning = result?.status === "stale" ? result.warning : undefined;
  const retryAfter = result?.status === "unavailable" ? result.retryAfterSeconds : undefined;
  const warning = result?.status === "unavailable" ? reasons[result.reason] : networkError ? "Unable to contact the application market endpoint." : null;

  return (
    <section aria-label="CoinGecko market feed" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={snapshot && !stale ? "default" : "outline"}>
            {loading ? "Loading" : stale ? "Stale cached data" : snapshot ? "Market feed connected" : "Feed unavailable"}
          </Badge>
          {snapshot && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock3 size={13} aria-hidden="true" />Fetched <time dateTime={snapshot.fetchedAt}>{new Date(snapshot.fetchedAt).toLocaleString()}</time></span>}
        </div>
        <Button type="button" variant="outline" size="sm" disabled={loading} onClick={() => void load()}>
          <RefreshCw size={14} aria-hidden="true" /> Refresh feed
        </Button>
      </div>

      {loading ? (
        <DataState state="loading" />
      ) : snapshot ? (
        <>
          {stale && <p role="alert" className="rounded-lg border border-border bg-muted px-4 py-3 text-sm leading-6">CoinGecko is currently unavailable. Showing the last successful snapshot from {new Date(snapshot.fetchedAt).toLocaleString()} — prices may be outdated. {staleWarning ? reasons[staleWarning] : ""}</p>}
          <DataTable
            label="CoinGecko market prices"
            rows={compact ? snapshot.assets.slice(0, 5) : snapshot.assets}
            rowKey={(row) => row.id}
            columns={columns}
            searchValue={compact ? undefined : (row) => `${row.name} ${row.symbol}`}
            pageSize={compact ? 5 : 10}
            emptyTitle="No market prices returned"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Prices in USD · Provider timestamps shown per asset · {stale ? "Stale cache" : "Cached response (up to 2 minutes)"}</span>
            <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              Data by CoinGecko <ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-border bg-background/50">
          <div role="alert" className="mx-auto max-w-xl px-5 py-10 text-center">
            <WifiOff size={27} className="mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-sm font-semibold">Market data unavailable</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{warning ?? "There is no verified snapshot available."}</p>
            {unavailable && retryAfter && <p className="mt-2 text-xs text-muted-foreground">Retry in approximately {retryAfter} seconds.</p>}
          </div>
        </div>
      )}
      {!snapshot && !loading && <p className="text-xs text-muted-foreground">No simulated quotes are displayed. <a className="text-primary underline" href="https://www.coingecko.com/">CoinGecko</a> will be the data provider when configured.</p>}
    </section>
  );
}
