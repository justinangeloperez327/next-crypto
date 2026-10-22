import { NextResponse } from "next/server";
import { getMarket } from "@/lib/market/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getMarket();
  const responseStatus = result.status === "unavailable"
    ? result.reason === "rate_limited" ? 429
      : result.reason === "authentication_error" ? 502
      : 503
    : 200;

  const response = NextResponse.json(result, {
    status: responseStatus,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });

  if (result.status === "unavailable" && result.retryAfterSeconds) {
    response.headers.set("Retry-After", String(result.retryAfterSeconds));
  }
  return response;
}
