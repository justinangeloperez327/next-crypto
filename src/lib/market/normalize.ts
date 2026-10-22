import type { MarketAsset } from "./types";

function nonnegative(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) && input >= 0 ? input : null;
}

function finite(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) ? input : null;
}

function timestamp(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const epoch = Date.parse(input);
  return Number.isFinite(epoch) ? new Date(epoch).toISOString() : null;
}

/** Reject structurally invalid entries; preserve genuinely missing optional values as null. */
export function normalizeMarketAssets(payload: unknown): MarketAsset[] {
  if (!Array.isArray(payload) || payload.length === 0 || payload.length > 250) {
    throw new Error("Invalid market asset response");
  }

  const seen = new Set<string>();
  const result: MarketAsset[] = [];

  for (const item of payload) {
    if (typeof item !== "object" || item === null || Array.isArray(item)) continue;
    const source = item as Record<string, unknown>;
    if (
      typeof source.id !== "string" || !/^[a-z0-9-]{1,100}$/.test(source.id) ||
      typeof source.name !== "string" || source.name.length === 0 || source.name.length > 120 ||
      typeof source.symbol !== "string" || !/^[a-zA-Z0-9.\-]{1,24}$/.test(source.symbol)
    ) continue;
    if (seen.has(source.id)) continue;

    // Malformed numbers must not silently become legitimate quote values.
    const numericKeys = ["current_price", "market_cap", "total_volume", "price_change_percentage_24h", "market_cap_rank"];
    if (numericKeys.some((key) => source[key] != null && (typeof source[key] !== "number" || !Number.isFinite(source[key])))) continue;
    if (["current_price", "market_cap", "total_volume"].some((key) => typeof source[key] === "number" && (source[key] as number) < 0)) continue;
    if (source.market_cap_rank != null && (typeof source.market_cap_rank !== "number" || !Number.isInteger(source.market_cap_rank) || source.market_cap_rank <= 0)) continue;

    seen.add(source.id);
    result.push({
      id: source.id,
      name: source.name,
      symbol: source.symbol.toUpperCase(),
      rank: typeof source.market_cap_rank === "number" ? source.market_cap_rank : null,
      priceUsd: nonnegative(source.current_price),
      marketCapUsd: nonnegative(source.market_cap),
      volume24hUsd: nonnegative(source.total_volume),
      change24hPercent: finite(source.price_change_percentage_24h),
      sourceUpdatedAt: timestamp(source.last_updated),
    });
  }
  if (result.length === 0) throw new Error("Market response contains no valid assets");
  return result;
}
