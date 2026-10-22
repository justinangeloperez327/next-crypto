import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { createMarketService, MARKET_CACHE_MS, MARKET_STALE_WINDOW_MS } from "./service";

const NOW = Date.parse("2026-10-22T08:00:00.000Z");

const validAsset = {
  id: "bitcoin", symbol: "btc", name: "Bitcoin", market_cap_rank: 1,
  current_price: 40000, market_cap: 800000000000, total_volume: 25000000000,
  price_change_percentage_24h: -1.25, last_updated: "2026-10-22T07:59:00Z",
};

function response(status: number, payload: unknown, retryAfter: string | null = null): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (key: string) => key.toLowerCase() === "retry-after" ? retryAfter : null },
    json: async () => payload,
  } as unknown as Response;
}

function fixture() {
  let now = NOW;
  let key: string | undefined = "test-key";
  const fetcher = vi.fn(async () => response(200, [validAsset]));
  const service = createMarketService({ apiKey: () => key, fetcher, now: () => now });
  return { service, fetcher, setTime: (value: number) => { now = value; }, setKey: (value: string | undefined) => { key = value; } };
}

describe("CoinGecko market adapter", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("does not call the provider without a server API key", async () => {
    const f = fixture();
    f.setKey(undefined);
    expect(await f.service.getMarket()).toEqual({ status: "unavailable", reason: "not_configured" });
    expect(f.fetcher).not.toHaveBeenCalled();
  });

  it("returns validated prices, provenance, and a server-only auth header", async () => {
    const f = fixture();
    const result = await f.service.getMarket();
    expect(result.status).toBe("fresh");
    if (result.status === "unavailable") throw new Error("Expected snapshot");
    expect(result.snapshot.assets[0]).toMatchObject({ id: "bitcoin", priceUsd: 40000, change24hPercent: -1.25, sourceUpdatedAt: "2026-10-22T07:59:00.000Z" });
    expect(result.snapshot).toMatchObject({ provider: "CoinGecko", currency: "USD", fetchedAt: new Date(NOW).toISOString() });
    const [url, options] = f.fetcher.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/coins/markets?vs_currency=usd");
    expect(url).not.toContain("test-key");
    expect(options.headers).toMatchObject({ "x-cg-demo-api-key": "test-key" });
    expect(options.cache).toBe("no-store");
  });

  it("reuses the snapshot during TTL and refreshes when due", async () => {
    const f = fixture();
    await f.service.getMarket();
    f.setTime(NOW + MARKET_CACHE_MS - 1);
    expect((await f.service.getMarket()).status).toBe("fresh");
    expect(f.fetcher).toHaveBeenCalledTimes(1);
    f.setTime(NOW + MARKET_CACHE_MS + 1);
    await f.service.getMarket();
    expect(f.fetcher).toHaveBeenCalledTimes(2);
  });

  it("honors 429 Retry-After, serves stale data, and limits repeated requests", async () => {
    const f = fixture();
    await f.service.getMarket();
    f.setTime(NOW + MARKET_CACHE_MS + 1);
    f.fetcher.mockResolvedValueOnce(response(429, {}, "180"));
    const stale = await f.service.getMarket();
    expect(stale).toMatchObject({ status: "stale", warning: "rate_limited" });
    expect((await f.service.getMarket()).status).toBe("stale");
    expect(f.fetcher).toHaveBeenCalledTimes(2);
    f.setTime(NOW + MARKET_STALE_WINDOW_MS + 1);
    f.fetcher.mockResolvedValueOnce(response(429, {}, "180"));
    const expired = await f.service.getMarket();
    expect(expired).toMatchObject({ status: "unavailable", reason: "rate_limited" });
    expect(f.fetcher).toHaveBeenCalledTimes(3);
  });

  it("discards stale data once the allowed age is exceeded", async () => {
    const f = fixture();
    await f.service.getMarket();
    f.setTime(NOW + MARKET_STALE_WINDOW_MS + 60_000);
    f.fetcher.mockResolvedValueOnce(response(503, {}));
    expect(await f.service.getMarket()).toMatchObject({ status: "unavailable", reason: "provider_unavailable" });
  });

  it("rejects malformed and negative-price responses without treating them as a success", async () => {
    const f = fixture();
    f.fetcher.mockResolvedValueOnce(response(200, [{ ...validAsset, current_price: -50 }]));
    expect(await f.service.getMarket()).toMatchObject({ status: "unavailable", reason: "invalid_response" });
  });

  it("does not leak malformed authorization errors or secrets to clients", async () => {
    const f = fixture();
    f.fetcher.mockResolvedValueOnce(response(401, { error: "test-key" }));
    const result = await f.service.getMarket();
    expect(result).toMatchObject({ status: "unavailable", reason: "authentication_error" });
    expect(JSON.stringify(result)).not.toContain("test-key");
  });

  it("normalizes transport timeouts to a safe failure reason", async () => {
    const f = fixture();
    f.fetcher.mockRejectedValueOnce(Object.assign(new Error("secret request"), { name: "TimeoutError" }));
    expect(await f.service.getMarket()).toMatchObject({ status: "unavailable", reason: "timeout" });
  });

  it("deduplicates concurrent requests", async () => {
    let resolve!: (value: Response) => void;
    const fetcher = vi.fn(() => new Promise<Response>((done) => { resolve = done; }));
    const service = createMarketService({ apiKey: () => "key", fetcher, now: () => NOW });
    const first = service.getMarket();
    const second = service.getMarket();
    expect(fetcher).toHaveBeenCalledTimes(1);
    resolve(response(200, [validAsset]));
    const [a, b] = await Promise.all([first, second]);
    expect(a.status).toBe("fresh");
    expect(b).toEqual(a);
  });

  it("preserves nullable fields instead of manufacturing zeroes", async () => {
    const f = fixture();
    f.fetcher.mockResolvedValueOnce(response(200, [{ ...validAsset, current_price: null, market_cap: null, total_volume: null, price_change_percentage_24h: null }]));
    const result = await f.service.getMarket();
    expect(result.status).toBe("fresh");
    if (result.status === "unavailable") throw new Error("Expected snapshot");
    expect(result.snapshot.assets[0]).toMatchObject({ priceUsd: null, marketCapUsd: null, volume24hUsd: null, change24hPercent: null });
  });
});
