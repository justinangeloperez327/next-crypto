"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight, ChartNoAxesCombined, Compass, Github, LayoutDashboard,
  Menu, ShieldCheck, Wallet, Star, CandlestickChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", title: "Overview", icon: LayoutDashboard },
  { href: "/markets", title: "Markets", icon: Compass },
  { href: "/watchlist", title: "Watchlist", icon: Star },
  { href: "/portfolio", title: "Portfolio", icon: Wallet },
] as const;

const titles: Record<string, string> = {
  "/": "Overview",
  "/markets": "Markets",
  "/watchlist": "Watchlist",
  "/portfolio": "Portfolio",
};

function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-ring">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <CandlestickChart size={21} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-[-0.035em]">next<span className="text-primary">crypto</span></span>
    </Link>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full min-h-[520px] flex-col">
      <div className="flex min-h-20 items-center border-b border-border px-6"><Brand /></div>
      <nav className="flex-1 space-y-1 px-3 pt-8" aria-label="Main navigation">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Workspace</p>
        {links.map(({ href, title, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              href={href}
              key={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{title}</span>
              {active && <span className="ml-auto size-1.5 rounded-full bg-primary" aria-hidden="true" />}
            </Link>
          );
        })}
        <div className="mt-7 border-t border-border px-3 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Information</p>
          <a
            className="mt-3 flex min-h-10 items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
            href="https://github.com/justinangeloperez327/next-crypto#roadmap"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ChartNoAxesCombined size={18} aria-hidden="true" /> Project roadmap
            <ArrowUpRight size={13} className="ml-auto" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </nav>
      <div className="m-4 rounded-xl border border-border bg-background/60 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck size={17} className="text-primary" aria-hidden="true" /> Development mode
        </div>
        <p className="text-xs leading-5 text-muted-foreground">Market data and personal accounts are not yet connected.</p>
        <Badge variant="outline" className="mt-3">Group 2 · UI foundation</Badge>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const title = titles[pathname] ?? "Workspace";
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-border bg-sidebar text-sidebar-foreground lg:block">
        <SidebarContent pathname={pathname} />
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-8">
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open navigation" type="button">
                    <Menu size={20} aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Next-Crypto / Workspace</p>
              <p className="truncate text-base font-semibold tracking-tight">{title}</p>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex"><span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" /> Preview</Badge>
            <ThemeToggle />
            <a
              className="hidden size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted sm:inline-flex"
              href="https://github.com/justinangeloperez327/next-crypto"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository (opens in a new tab)"
              title="View source on GitHub"
            >
              <Github size={19} aria-hidden="true" />
            </a>
          </div>
        </header>
        <main id="main-content" className="w-full flex-1 px-4 pb-16 pt-8 sm:px-8 sm:pt-10 xl:px-10">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
        <footer className="border-t border-border px-4 py-5 text-xs leading-6 text-muted-foreground sm:px-8 xl:px-10">
          <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} Next-Crypto</span>
            <span>Information only · No live data, custody or trading</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
