import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <div className="w-full overflow-x-auto"><table data-slot="table" className={cn("w-full caption-bottom text-left text-sm", className)} {...props} /></div>;
}
export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("border-b border-border bg-muted/40", className)} {...props} />;
}
export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}
export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("border-b border-border transition-colors hover:bg-muted/30", className)} {...props} />;
}
export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th data-slot="table-head" scope="col" className={cn("h-11 whitespace-nowrap px-5 text-left text-xs font-medium text-muted-foreground", className)} {...props} />;
}
export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("whitespace-nowrap px-5 py-4 align-middle", className)} {...props} />;
}
