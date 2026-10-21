# Next-Crypto

A non-custodial cryptocurrency market research and portfolio tracking application built with Next.js App Router.

> **Status:** Group 1 — foundation. Market feeds, accounts, and portfolio calculations are **not yet implemented**. Any previews are illustrative, not live prices or financial advice.

## Scope

Initial MVP:
- Explore cryptocurrency markets with trustworthy price, volume, and market-cap data.
- Search coins, open detail pages, and study historical charts.
- Save a personal watchlist.
- Track holdings through manual buy, sell, deposit, and withdrawal transactions.
- Review portfolio allocations and performance with explicit calculation methodology.

Out of scope for MVP: exchange execution, private-key custody, on-chain transfers, investment recommendations, leveraged derivatives, automatic trading bots.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict mode
- Node.js 24 LTS; Tailwind CSS 4; shadcn/ui-ready design tokens
- PostgreSQL + Prisma and Auth.js in later phases
- Zod validation; Vitest and Playwright planned for testing
- Manual Vercel deployment only — no push-triggered production deployment

## Local development

Requirements: Node.js 24.x and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other commands:

```bash
npm run lint
npm run typecheck
npm run build
```

**Important:** This repository was initialized through the GitHub connector rather than `create-next-app`; dependency installation and the production build need to be verified in a network-enabled environment. Commit the generated `package-lock.json` after the initial installation, then migrate CI from `npm install` to `npm ci`.

## Roadmap

| Group | Goal | Deliverables |
| --- | --- | --- |
| 1 | Foundation | Next.js scaffold, strict TS, Tailwind, accessible starter UI, documentation, CI |
| 2 | Design system | shadcn/ui integration, component primitives, navigation, responsive light/dark modes |
| 3 | Market data | Server-side provider adapter, env configuration, caching, retries, rate-limit and stale-data handling |
| 4 | Markets explorer | Search, sorting, pagination, gainers/losers and filters |
| 5 | Coin details | Verified price history, charts, market metrics and source timestamps |
| 6 | Authentication | Auth.js sessions, registration, login, protected routes, security boundaries |
| 7 | Persistence | PostgreSQL, Prisma migrations, users, watchlists and portfolio schema |
| 8 | Watchlists | Save coins, personalized views, robust optimistic updates |
| 9 | Portfolio ledger | Manual entries, decimal-safe quantities and cost basis, fees, currency handling |
| 10 | Analytics | Allocation, return calculations, chart history and downloadable exports |
| 11 | Quality | Vitest, Playwright, a11y, security, resilience and performance budgets |
| 12 | Release | CI hardening, operational documentation and manually initiated Vercel deployment |

### Data engineering principles

- Never present mock values as live market data.
- Store provider, currency, timestamp and freshness for displayed market quotes.
- Centralize external API calls server-side. Never expose service credentials to browser code.
- Treat provider failures and rate limits as expected states; show last-successful data clearly labelled.
- Use decimal-safe storage for monetary amounts, and document cost-basis/return calculation rules.
- No wallet private keys, recovery phrases, or exchange trading credentials in the MVP.

## Deployment

GitHub Actions is for validation only; deployment to Vercel is a separate **manual** action. Do not add a production auto-deploy workflow or enable Vercel's automatic Git deployments without an explicit change in requirements.

## Disclaimer

Next-Crypto is for informational and personal portfolio tracking purposes. Crypto prices are volatile and third-party data may be delayed or inaccurate. This is not personalized investment advice.
