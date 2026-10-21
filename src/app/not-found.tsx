import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card className="mx-auto max-w-xl p-8 text-center sm:p-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">404 / Not found</p>
      <h1 className="mt-4 text-3xl font-semibold">We couldn’t find that page.</h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">The requested page may have moved or may not exist.</p>
      <Button asChild className="mt-6"><Link href="/">Return to overview</Link></Button>
    </Card>
  );
}
