# Next-Crypto

A responsive, non-custodial cryptocurrency market workspace, built with Next.js App Router.

**Group 2 implemented:** minimal dashboard shell, light/dark mode, mobile navigation, reusable shadcn-style UI primitives, search/sort/pagination tables, chart containers, accessible loading/error/empty states, unit/component tests and browser smoke tests.

> **Important:** This is a UI-development preview, **not** a live cryptocurrency market data service. No crypto quotes, simulated price histories, authenticated user data, wallets, or trading are implemented yet.

## Technology

- Next.js 16 App Router + React 19 + strict TypeScript
- Node.js 24, Tailwind CSS 4, shadcn-style local UI components backed by Radix Primitives
- `next-themes` for system-preference-aware, persisted light/dark theming
- Vitest + React Testing Library, Playwright Chromium smoke tests
- PostgreSQL + Prisma and Auth.js planned for later phases

## Setup

Requires Node.js 24.x and npm.

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

```bash
npm run lint
npm run typecheck
npm test
npm run build

# browser tests
npx playwright install chromium
npm run test:e2e
```

**Reproducible installation follow-up:** the scaffold currently does not include `package-lock.json`. Generate and commit it from a network-enabled checkout (`npm install --package-lock-only`), then switch the CI workflows from `npm install` to `npm ci`. Until then, the CI verifies compatible dependency ranges rather than a fully locked dependency tree.

## Navigation

| Route | UI | Data availability |
| --- | --- | --- |
| `/` | KPI cards, chart placeholder, watchlist empty state, asset preview | No live data |
| `/markets` | Searchable/sortable catalog, chart container | Names/categories are static preview entries; quotes unavailable |
| `/watchlist` | Personal watchlist empty state | Account storage not implemented |
| `/portfolio` | Holdings, transaction and performance placeholders | Account storage not implemented |

### Component architecture

- `src/components/dashboard-shell.tsx` — responsive sidebar and main workspace
- `src/components/theme-provider.tsx`, `theme-toggle.tsx` — theme persistence and toggle
- `src/components/ui/*` — local, themeable shadcn-style component sources
- `src/components/data-table.tsx` — generic searchable, sortable, paginated table
- `src/components/chart-panel.tsx` — accessible chart/empty/loading/error wrapper
- `src/components/data-state.tsx` — consistent accessible data states
- `src/lib/market-preview.ts` — explicitly static asset catalog
- `src/components/*.test.tsx` — interaction and accessibility contract tests
- `e2e/dashboard.spec.ts` — browser smoke tests

These UI primitives are versioned as source files, as in the shadcn/ui copy-to-project model. Configure or regenerate components carefully if running the shadcn CLI later.

## Roadmap

| Group | Goal | Status |
| --- | --- | --- |
| 1 | Foundation: Next.js 16, TypeScript, Tailwind, CI | Complete |
| 2 | UI: dashboard shell, themes, reusable tables/charts, states, tests | Complete |
| 3 | Market provider adapter with provenance, cache, rate-limit handling | Planned |
| 4 | Live market explorer, search and pagination | Planned |
| 5 | Verified coin details and historical charts | Planned |
| 6 | Authentication, sessions and security | Planned |
| 7 | PostgreSQL, Prisma schema and persistence | Planned |
| 8 | Personal watchlists | Planned |
| 9 | Manual portfolio ledger, fees, safe decimal arithmetic | Planned |
| 10 | Analytics, performance and exports | Planned |
| 11 | Broad coverage: accessibility, security, reliability, performance | Planned |
| 12 | Final audit and manual production release | Planned |

### Data and safety principles

- Never show mock financial values as live market prices.
- Preserve provider, quote currency, source timestamp and data-freshness status.
- Keep provider credentials server-only, with caching and rate-limit recovery.
- Do not request or store wallet seed phrases or private keys.
- Model transactions with decimal-safe amounts and well-defined return/cost-basis formulas.
- Features must communicate when they are only planned or data is unavailable.

## Deployment

**Manual Vercel deployment only.** No CI job deploys to Vercel. A separate Vercel Git integration may still deploy automatically unless its auto-deployment behavior is disabled in Vercel project settings. CI uses `contents: read`.

## Notice

This project is for informational research and personal record-keeping. Crypto prices are volatile, external feeds can be delayed, and this is not investment advice.
