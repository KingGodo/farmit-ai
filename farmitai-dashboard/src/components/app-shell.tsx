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
      <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 border-r border-border bg-background md:flex md:flex-col">
        <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/20"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="relative z-50 flex h-full w-56 flex-col border-r border-border bg-background">
            <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl md:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>

          <div className="flex min-w-0 flex-1 items-baseline gap-2">
            <h1 className="truncate text-[13px] font-semibold tracking-[-0.02em]">{page.title}</h1>
            <span className="hidden text-[12px] text-faint sm:inline">{page.kicker}</span>
          </div>

          <HeaderSearch />
          <div className="hidden h-5 w-px bg-border sm:block" />
          <UserMenu email={me.data?.email} onSignOut={logout} />
        </header>

        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
