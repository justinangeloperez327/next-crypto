import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  CircleCheck,
  Database,
  Layers3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Explore markets",
    description: "Find assets and compare prices, volume and market capitalization once a verified provider is connected.",
    tag: "Market intelligence",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Understand the chart",
    description: "Historical price movements with explicit timestamps, quote currencies and transparent data provenance.",
    tag: "Price history",
  },
  {
    icon: Wallet,
    title: "Track your portfolio",
    description: "Record trades manually and understand allocations, holdings and cost basis without custody.",
    tag: "Portfolio accounting",
  },
  {
    icon: Layers3,
    title: "Follow a watchlist",
    description: "Save interesting assets and revisit them in one organized place once accounts are available.",
    tag: "Personal workspace",
  },
] as const;

const principles = [
  "No invented or unlabeled market prices",
  "Server-side provider access and rate-limit handling",
  "Non-custodial by design",
  "Decimal-safe portfolio calculations",
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line/70">
        <div className="pointer-events-none absolute -right-56 -top-60 -z-10 h-[640px] w-[640px] rounded-full bg-accent/8 blur-[130px]" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-20 sm:px-8 md:pt-28 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-16 lg:pb-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-3 py-2 text-xs font-semibold tracking-wide text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              GROUP 01 · FOUNDATION
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Crypto, without <span className="text-accent">the noise.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg">
              An open, non-custodial workspace for understanding cryptocurrency markets and keeping your portfolio in focus. Built with trust, clarity and reliable data in mind.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/markets" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground transition hover:bg-[#8cf1d7]">
                Explore markets <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link href="#roadmap" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-panel px-5 text-sm font-semibold transition hover:border-accent/60">
                View roadmap <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-6 text-xs leading-6 text-muted">Development preview · Live prices, accounts and real-money trading are not enabled.</p>
          </div>
          <div className="rounded-3xl border border-line bg-panel p-5 shadow-[0_32px_90px_-55px_#000] sm:p-7" aria-label="Application status preview">
            <div className="mb-7 flex items-center justify-between border-b border-line pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Workspace</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">System readiness</h2>
              </div>
              <span className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">Initial setup</span>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-background/60 p-4">
                <Database size={21} className="mb-4 text-accent" aria-hidden="true" />
                <p className="text-xs text-muted">Market data</p>
                <p className="mt-1 text-base font-semibold">Not connected</p>
              </div>
              <div className="rounded-2xl border border-line bg-background/60 p-4">
                <LockKeyhole size={21} className="mb-4 text-accent" aria-hidden="true" />
                <p className="text-xs text-muted">User accounts</p>
                <p className="mt-1 text-base font-semibold">Not enabled</p>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-background/35 px-5 py-12 text-center">
              <Activity size={30} className="mx-auto mb-4 text-muted" strokeWidth={1.4} aria-hidden="true" />
              <p className="text-sm font-semibold">Waiting for the first data source</p>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-muted">Live charts and asset snapshots will appear here after provider integration.</p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs leading-6 text-muted">
              <ShieldCheck size={16} className="shrink-0 text-accent" aria-hidden="true" />
              No placeholder numbers are presented as real prices.
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24" id="capabilities">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Capabilities · planned</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Everything essential. Nothing distracting.</h2>
          <p className="mt-4 text-base leading-8 text-muted">These capabilities form the roadmap and will be implemented in independently testable phases.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description, tag }) => (
            <article key={title} className="rounded-2xl border border-line bg-panel p-6 sm:p-7">
              <div className="mb-7 flex items-center justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <span className="text-xs text-muted">{tag}</span>
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-t border-line bg-panel/35" id="roadmap">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Build roadmap</p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">Reliability is a feature.</h2>
            <p className="mt-4 max-w-md text-sm leading-8 text-muted">Start with the framework, establish a verified market-data layer, then add authenticated watchlists and portfolio accounting.</p>
            <a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline" href="https://github.com/justinangeloperez327/next-crypto#roadmap" target="_blank" rel="noopener noreferrer">
              Full implementation plan <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
            {[
              { number: "01", name: "Foundation and design", status: "In progress", active: true },
              { number: "02", name: "Market data and discovery", status: "Planned", active: false },
              { number: "03", name: "Authentication and personal data", status: "Planned", active: false },
              { number: "04", name: "Portfolio insights and release", status: "Planned", active: false },
            ].map((step) => (
              <div key={step.number} className="flex items-center gap-4 px-5 py-5 sm:px-7">
                <span className="text-sm font-semibold tabular-nums text-accent">{step.number}</span>
                <span className="flex-1 text-sm font-medium">{step.name}</span>
                <span className={step.active ? "text-xs font-semibold text-accent" : "text-xs text-muted"}>{step.status}</span>
                {step.active ? <CircleCheck size={17} className="text-accent" aria-label="Phase started" /> : <span className="h-[17px] w-[17px]" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-10 rounded-3xl border border-line bg-panel p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Designed around dependable data.</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-muted">Transparent sources, safe defaults and clearly labeled states before additional features.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {principles.map((principle) => (
              <div className="flex max-w-xs items-start gap-2 text-xs leading-6 text-muted" key={principle}>
                <CircleCheck size={17} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                <span>{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
