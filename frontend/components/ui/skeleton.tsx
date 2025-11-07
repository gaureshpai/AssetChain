import { cn } from "@/lib/utils";
import * as React from "react";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-700/50", className)}
      {...props}
    />
  );
}