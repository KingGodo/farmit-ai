"use client";

import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { HeaderSearch } from "@/components/header-search";
import { Sidebar } from "@/components/sidebar";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { fetchMe } from "@/lib/client-api";
import { resolvePage } from "@/lib/nav";
import { queryKeys } from "@/lib/query-keys";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const me = useQuery({ queryKey: queryKeys.me, queryFn: fetchMe });
  const page = resolvePage(pathname);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="relative z-50 flex h-full w-64 flex-col border-r border-border bg-card">
            <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{page.kicker}</p>
            <h1 className="truncate text-base font-semibold tracking-[-0.02em]">{page.title}</h1>
          </div>

          <HeaderSearch />
          <UserMenu email={me.data?.email} onSignOut={logout} />
        </header>

        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
