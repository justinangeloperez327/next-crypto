import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { DataState } from "@/components/data-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "A future feature for saving personal cryptocurrency watchlists.",
};

export default function WatchlistPage() {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 text-sm text-primary"><Star size={17} aria-hidden="true" /> Personal workspace · planned</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Your watchlist</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Keep your favorite assets in one place after user accounts and database persistence are introduced.
        </p>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Saved assets</CardTitle>
          <CardDescription>Your selected cryptocurrencies will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <DataState state="empty" title="No watchlist available" description="Watchlist saving is scheduled for Group 8. You can browse the static asset catalog now." />
          <div className="flex justify-center"><Button variant="outline" asChild><Link href="/markets">Explore catalog <ArrowRight size={16} aria-hidden="true" /></Link></Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
