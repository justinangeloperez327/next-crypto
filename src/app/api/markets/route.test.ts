import { describe, expect, it, vi } from "vitest";

const { getMarket } = vi.hoisted(() => ({ getMarket: vi.fn() }));
vi.mock("@/lib/market/service", () => ({ getMarket }));
import { GET } from "./route";

describe("GET /api/markets", () => {
  it("uses no-store and never leaks credentials in error responses", async () => {
    getMarket.mockResolvedValueOnce({ status: "unavailable", reason: "not_configured" });
    const response = await GET();
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");
    expect(await response.json()).toEqual({ status: "unavailable", reason: "not_configured" });
  });

  it("forwards safe retry guidance on throttling", async () => {
    getMarket.mockResolvedValueOnce({ status: "unavailable", reason: "rate_limited", retryAfterSeconds: 65 });
    const response = await GET();
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("65");
  });

  it("returns cached stale data successfully with visible status", async () => {
    getMarket.mockResolvedValueOnce({
      status: "stale", warning: "provider_unavailable",
      snapshot: { provider: "CoinGecko", currency: "USD", fetchedAt: "2026-10-22T08:00:00.000Z", assets: [] },
    });
    const response = await GET();
    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe("stale");
  });
});
