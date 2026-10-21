import * as React from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataState } from "@/components/data-state";
import { cn } from "@/lib/utils";

type ChartPanelProps = {
  title: string;
  description: string;
  status: "ready" | "empty" | "error" | "loading";
  summary?: string;
  children?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
};

export function ChartPanel({ title, description, status, summary, children, onRetry, className }: ChartPanelProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  return (
    <Card className={className}>
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle id={titleId}>{title}</CardTitle>
          <CardDescription id={descriptionId} className="mt-1">{description}</CardDescription>
        </div>
        <Badge variant="outline">{status === "ready" ? "Connected" : status === "loading" ? "Loading" : status === "error" ? "Unavailable" : "No data"}</Badge>
      </CardHeader>
      <CardContent className="pt-6">
        <div
          className={cn("relative min-h-[260px] overflow-hidden rounded-xl border border-border bg-background/55 sm:min-h-[310px]", status !== "ready" && "flex items-center justify-center")}
          role="region"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          {status === "ready" && children ? (
            <div className="h-full w-full" role="img" aria-label={summary ?? title}>{children}</div>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "64px 56px",
                  maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
                }}
              />
              <div className="relative z-10 w-full">
                {status === "loading" ? <DataState state="loading" /> : status === "error" ? (
                  <DataState state="error" title="Chart unavailable" onRetry={onRetry} description="The chart could not be loaded. Please retry when a data source is available." />
                ) : (
                  <div className="px-5 py-10 text-center">
                    <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-card text-primary">
                      <ChartNoAxesCombined size={22} aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold">Awaiting market data</p>
                    <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
                      Historical price visualization becomes available in Group 5.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {status !== "ready" && <p className="mt-3 text-xs text-muted-foreground">No prices or simulated chart series are shown.</p>}
      </CardContent>
    </Card>
  );
}
