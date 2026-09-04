import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto max-w-6xl space-y-4", className)}>{children}</div>;
}

export function SampleMark() {
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] text-faint">
      Sample
    </span>
  );
}

export function SampleNote() {
  return (
    <p className="text-[12px] text-faint">Preview data. Waiting list is live.</p>
  );
}
