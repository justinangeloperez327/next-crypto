import Link from "next/link";
import { ArrowLeft, DatabaseZap } from "lucide-react";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function EmptyState({ eyebrow, title, description }: EmptyStateProps) {
  return (
    <section className="mx-auto flex min-h-[64vh] max-w-5xl items-center px-5 py-20 sm:px-8">
      <div className="w-full rounded-3xl border border-line bg-panel p-8 sm:p-12">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
          <DatabaseZap size={27} aria-hidden="true" />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-muted">{description}</p>
        <div className="mt-8 rounded-xl border border-line bg-background/70 px-4 py-3 text-sm text-muted" role="status">
          No live financial data or personal holdings are stored or displayed yet.
        </div>
        <Link href="/" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
          <ArrowLeft size={16} aria-hidden="true" /> Back to overview
        </Link>
      </div>
    </section>
  );
}
