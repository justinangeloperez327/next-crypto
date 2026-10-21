import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Non-custodial crypto portfolio tracking — planned for a later phase.",
};

export default function PortfolioPage() {
  return (
    <EmptyState
      eyebrow="Portfolio · Group 6–10"
      title="Your portfolio, your records."
      description="Authenticated portfolio tracking will let you enter your transactions manually, then review decimal-safe holdings, allocation and returns. We will not collect private keys or send trades to exchanges."
    />
  );
}
