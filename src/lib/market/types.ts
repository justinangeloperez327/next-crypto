/**
 * Values in this contract originate from a real upstream market feed.
 * All monetary amounts are USD; unknown values remain null, never zero-filled.
 */
export type MarketAsset = {
  id: string;
  symbol: string;
  name: string;
  rank: number | null;
  priceUsd: number | null;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  change24hPercent: number | null;
  sourceUpdatedAt: string | null;
};

export type MarketSnapshot = {
  provider: "CoinGecko";
  currency: "USD";
  fetchedAt: string;
  assets: MarketAsset[];
};

export type MarketFailureReason =
  | "not_configured"
  | "rate_limited"
  | "authentication_error"
  | "provider_unavailable"
  | "invalid_response"
  | "timeout";

export type MarketResult =
  | {
      status: "fresh" | "stale";
      snapshot: MarketSnapshot;
      warning?: MarketFailureReason;
    }
  | {
      status: "unavailable";
      reason: MarketFailureReason;
      retryAfterSeconds?: number;
    };
