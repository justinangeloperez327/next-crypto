import { AlertTriangle, DatabaseZap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type DataStateProps = {
  state: "empty" | "error" | "loading";
  title?: string;
  description?: string;
  onRetry?: () => void;
  compact?: boolean;
};

export function DataState({ state, title, description, onRetry, compact = false }: DataStateProps) {
  if (state === "loading") {
    return (
      <div role="status" aria-label="Loading data" className={compact ? "space-y-3 py-8" : "space-y-4 py-12"}>
        <span className="sr-only">Loading data</span>
        <Skeleton className="mx-auto h-4 w-40" />
        <Skeleton className="mx-auto h-3 w-64 max-w-full" />
        <Skeleton className="mx-auto h-3 w-52 max-w-full" />
      </div>
    );
  }
  const error = state === "error";
  const Icon = error ? AlertTriangle : DatabaseZap;
  return (
    <div role={error ? "alert" : "status"} className={compact ? "px-4 py-9 text-center" : "px-6 py-14 text-center"}>
      <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="text-sm font-semibold">{title ?? (error ? "Unable to load data" : "Nothing to show yet")}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description ?? (error ? "The request failed. Please try again." : "Your information will appear here when it is available.")}
      </p>
      {error && onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry} type="button">
          <RefreshCw size={15} aria-hidden="true" /> Try again
        </Button>
      )}
    </div>
  );
}
