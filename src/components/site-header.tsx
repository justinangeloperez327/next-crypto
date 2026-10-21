import Link from "next/link";
import { ArrowUpRight, CandlestickChart } from "lucide-react";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/markets", label: "Markets" },
  { href: "/portfolio", label: "Portfolio" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-line/80">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <CandlestickChart size={22} aria-hidden="true" />
          </span>
          <span className="text-lg">next<span className="text-accent">crypto</span></span>
        </Link>
        <nav aria-label="Main navigation" className="order-3 flex w-full flex-wrap items-center gap-6 text-sm font-medium text-muted sm:order-2 sm:w-auto">
          {navigation.map((item) => (
            <Link className="transition-colors hover:text-foreground" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href="https://github.com/justinangeloperez327/next-crypto"
          rel="noopener noreferrer"
          target="_blank"
          className="order-2 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent/70 sm:order-3"
        >
          GitHub <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </header>
  );
}
