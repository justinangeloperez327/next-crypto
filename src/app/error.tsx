"use client";

import { useEffect } from "react";
import { DataState } from "@/components/data-state";
import { Card } from "@/components/ui/card";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // No personal data or exception details are rendered to the user.
    // Integrate a controlled, privacy-aware error logger in a later phase.
    void error;
  }, [error]);
  return (
    <Card className="mx-auto max-w-2xl">
      <DataState state="error" title="This view could not be loaded" description="An unexpected error occurred. Please try loading the page again." onRetry={reset} />
    </Card>
  );
}
