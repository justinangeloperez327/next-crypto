# Next-Crypto

A minimal, responsive, **non-custodial** cryptocurrency market and portfolio workspace, built with Next.js App Router.

## Project status

- **Group 1:** Next.js, strict TypeScript and CI — complete
- **Group 2:** UI system, responsive sidebar, light/dark themes, reusable tables/chart shells, tests — complete
- **Group 3:** CoinGecko Demo adapter, server-only credentials, validated market snapshots, API route, two-minute in-memory caching, single-flight requests, stale fallback, throttling/error states and tests — implemented
- **Group 4:** full-featured live market explorer with advanced filters and pagination — planned
- **Group 5:** historical price charts and coin detail pages — planned
- **Groups 6–12:** authentication, PostgreSQL/Prisma, watchlists, ledger, analytics, quality, release — planned

No trading, account custody, portfolio calculations or historical price series have been implemented.

## Environment setup

Requires Node.js 24 and npm.

1. Create a free **CoinGecko Demo** API key at https://www.coingecko.com/en/api/pricing
2. Copy `.env.example` to `.env.local` and set:

   ```dotenv
   COINGECKO_DEMO_API_KEY=your_demo_key_here
   ```

3. Run:

   ```bash
   npm install
   npm run dev
   ```

Open http://localhost:3000.

**Never commit `.env.local` or put the key in a `NEXT_PUBLIC_` environment variable.** The secret is sent from the Next.js server to CoinGecko through the `x-cg-demo-api-key` header, never returned to the browser.

If the key is not configured, `/api/markets` returns a safe `503` response with `reason: "not_configured"` and the UI shows a labeled unavailable state. No mock or fictitious prices will be displayed. Demo usage is subject to CoinGecko rate limits and monthly quotas.

## Market-data architecture

- `src/lib/market/service.ts`: server-only CoinGecko adapter, request timeout, single-flight, TTL cache and bounded stale fallback.
- `src/lib/market/normalize.ts`: validates incoming payloads; rejects malformed and negative numeric fields.
- `src/lib/market/types.ts`: explicit USD, CoinGecko source, `fetchedAt`, provider `sourceUpdatedAt`, nullable market metrics and status.
- `src/app/api/markets/route.ts`: publicly readable, sanitized JSON response, always `Cache-Control: no-store`.
- `src/components/market-feed.tsx`: accessible loading/unavailable/stale indicators, verified price table, refresh and attribution.

### Request contract

`GET /api/markets`

- `200 { status: "fresh", snapshot }` — cached or newly fetched validated snapshot.
- `200 { status: "stale", snapshot, warning }` — last known good data, retained only up to **30 minutes** from fetch time, clearly labeled stale.
- `429 { status: "unavailable", reason: "rate_limited", retryAfterSeconds }` — throttled with a `Retry-After` header.
- `503 { status: "unavailable", reason: "not_configured" | "provider_unavailable" | "invalid_response" | "timeout" }` — no valid quote snapshot.
- `502 { status: "unavailable", reason: "authentication_error" }` — bad/unauthorized provider credentials.

Successful responses retain timestamps and CoinGecko attribution. The provider is queried for the **top 20 coins by market cap in USD**; this is not a complete global market snapshot. The Dashboard's global market cap, global volume, portfolio and watchlist summary cards intentionally remain unavailable until their own correctly scoped data sources are implemented.

### Caching and limitations

- Successful upstream data is cached **120 seconds** per runtime instance, and simultaneous requests are deduplicated.
- A provider failure starts a cooldown (60 seconds normally; `Retry-After` for 429), preventing immediate repeat requests.
- A last successful snapshot can be shown, explicitly marked **stale**, for at most 30 minutes. After that, errors are shown rather than outdated quotes.
- Cache is **per running server instance**, not shared between independent Vercel instances. A shared durable cache with a global quota/circuit breaker may be needed before a high-traffic release.
- Upstream price freshness may lag behind the app's fetch time; always consider the per-asset `sourceUpdatedAt` alongside the `fetchedAt` timestamp.
- Browser clients request the app's own `/api/markets` endpoint. There is no automatic polling and no request for a key in the browser.
- CoinGecko Demo data requires provider attribution and may be restricted for some commercial use cases. Review the provider terms before public monetization.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build

npx playwright install chromium
npm run test:e2e
```

CI uses Node.js 24 with GitHub Actions v6 and does not deploy. The project still needs a committed `package-lock.json` generated in a network-enabled checkout, followed by a switch from `npm install` to `npm ci` in workflows for reproducible installs.

## Navigation

| Route | Behavior |
| --- | --- |
| `/` | Market snapshot section, chart placeholder, unavailable account metrics and offline asset catalog |
| `/markets` | Verified CoinGecko price table when configured, searchable offline catalog and future chart placeholder |
| `/watchlist` | Account-backed feature placeholder |
| `/portfolio` | Ledger and allocation feature placeholder |

## Deployments

GitHub Actions only tests and builds. **No automatic Vercel deployment is configured in CI.** Disable Vercel's own Git-based automatic production deployments separately if a Vercel project has already been connected.

## Disclaimer

Prices may be delayed, stale or unavailable. This product provides informational tools only and is not financial advice.
