import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Markets",
  description: "Cryptocurrency markets explorer — pending verified market data integration.",
};

export default function MarketsPage() {
  return (
    <EmptyState
      eyebrow="Markets · Group 3–5"
      title="Real market data comes next."
      description="This page will offer searchable cryptocurrency rankings, asset details, and historical charts. Before showing prices, we will implement a rate-limited server-side provider with source attribution and freshness indicators."
    />
  );
}
