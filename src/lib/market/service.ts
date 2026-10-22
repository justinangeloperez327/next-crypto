import "server-only";

import { normalizeMarketAssets } from "./normalize";
import type { MarketFailureReason, MarketResult, MarketSnapshot } from "./types";

export const MARKET_CACHE_MS = 120_000;
export const MARKET_STALE_WINDOW_MS = 30 * 60_000;
const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const FETCH_TIMEOUT_MS = 8_000;

type Fetcher = (input: string, init: RequestInit) => Promise<Response>;
type Dependencies = {
  apiKey: () => string | undefined;
  fetcher: Fetcher;
  now: () => number;
};

function secondsToRetry(value: string | null, now: number): number {
  if (value) {
    const seconds = Number(value);
    if (Number.isFinite(seconds) && seconds > 0) return Math.min(3600, Math.ceil(seconds));
    const retryDate = Date.parse(value);
    if (Number.isFinite(retryDate) && retryDate > now) {
      return Math.min(3600, Math.ceil((retryDate - now) / 1000));
    }
  }
  return 60;
}

class ProviderFailure extends Error {
  constructor(
    readonly reason: MarketFailureReason,
    readonly retryAfterSeconds = 60,
  ) {
    super(reason);
  }
}

/** Server-only, instance-local cache. No durable cross-instance cache is assumed. */
export function createMarketService(deps: Dependencies) {
  let cached: MarketSnapshot | null = null;
  let refreshAt = 0;
  let cooldownUntil = 0;
  let lastReason: MarketFailureReason = "provider_unavailable";
  let pending: Promise<MarketResult> | null = null;

  function fallback(reason: MarketFailureReason, retryAfterSeconds?: number): MarketResult {
    const now = deps.now();
    if (cached && now - Date.parse(cached.fetchedAt) <= MARKET_STALE_WINDOW_MS) {
      return { status: "stale", snapshot: cached, warning: reason };
    }
    return {
      status: "unavailable",
      reason,
      ...(retryAfterSeconds !== undefined ? { retryAfterSeconds } : {}),
    };
  }

  async function refresh(apiKey: string): Promise<MarketResult> {
    try {
      const url = new URL(API_URL);
      url.searchParams.set("vs_currency", "usd");
      url.searchParams.set("order", "market_cap_desc");
      url.searchParams.set("per_page", "20");
      url.searchParams.set("page", "1");
      url.searchParams.set("sparkline", "false");
      url.searchParams.set("price_change_percentage", "24h");

      let response: Response;
      try {
        response = await deps.fetcher(url.toString(), {
          headers: { Accept: "application/json", "x-cg-demo-api-key": apiKey },
          cache: "no-store",
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
      } catch (error) {
        const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
        throw new ProviderFailure(timedOut ? "timeout" : "provider_unavailable");
      }

      if (response.status === 429) {
        throw new ProviderFailure("rate_limited", secondsToRetry(response.headers.get("retry-after"), deps.now()));
      }
      if (response.status === 401 || response.status === 403) {
        throw new ProviderFailure("authentication_error", 300);
      }
      if (!response.ok) throw new ProviderFailure("provider_unavailable");

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new ProviderFailure("invalid_response", 120);
      }

      let assets: MarketSnapshot["assets"];
      try {
        assets = normalizeMarketAssets(payload);
      } catch {
        throw new ProviderFailure("invalid_response", 120);
      }

      const snapshot: MarketSnapshot = {
        provider: "CoinGecko",
        currency: "USD",
        fetchedAt: new Date(deps.now()).toISOString(),
        assets,
      };
      cached = snapshot;
      refreshAt = deps.now() + MARKET_CACHE_MS;
      cooldownUntil = 0;
      return { status: "fresh", snapshot };
    } catch (error) {
      const failure = error instanceof ProviderFailure
        ? error
        : new ProviderFailure("provider_unavailable");
      lastReason = failure.reason;
      cooldownUntil = deps.now() + failure.retryAfterSeconds * 1000;
      return fallback(failure.reason, failure.retryAfterSeconds);
    }
  }

  async function getMarket(): Promise<MarketResult> {
    const apiKey = deps.apiKey()?.trim();
    if (!apiKey) return { status: "unavailable", reason: "not_configured" };

    const now = deps.now();
    if (cached && now < refreshAt) return { status: "fresh", snapshot: cached };

    // Single flight prevents concurrent browser requests multiplying provider calls.
    if (pending) return pending;
    if (now < cooldownUntil) {
      return fallback(lastReason, Math.ceil((cooldownUntil - now) / 1000));
    }

    pending = refresh(apiKey).finally(() => { pending = null; });
    return pending;
  }

  return { getMarket };
}

const marketService = createMarketService({
  apiKey: () => process.env.COINGECKO_DEMO_API_KEY,
  fetcher: (url, init) => fetch(url, init),
  now: () => Date.now(),
});

export const getMarket = marketService.getMarket;
