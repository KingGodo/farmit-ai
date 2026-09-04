import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { AppShell } from "@/components/app-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AppShell>{children}</AppShell>
    </QueryProvider>
  );
}
