"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;

export function SheetContent({ className, children, ...props }: React.ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/55 data-[state=open]:animate-in" />
      <Dialog.Content
        className={cn("fixed inset-y-0 left-0 z-50 w-[min(19rem,90vw)] overflow-y-auto border-r border-border bg-sidebar p-0 text-sidebar-foreground shadow-2xl focus:outline-none", className)}
        {...props}
      >
        {children}
        <Dialog.Close aria-label="Close navigation" className="absolute right-4 top-5 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          <X size={18} aria-hidden="true" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
