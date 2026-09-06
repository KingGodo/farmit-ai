"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";

function HeaderSearchField() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    if (pathname === "/waiting-list") setQuery(searchParams.get("q") ?? "");
  }, [pathname, searchParams]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const search = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (pathname === "/waiting-list") {
      const next = new URLSearchParams(searchParams.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      next.delete("page");
      router.push(`/waiting-list?${next.toString()}`);
      return;
    }
    router.push(q ? `/waiting-list?q=${encodeURIComponent(q)}` : "/waiting-list");
  };

  return (
    <form onSubmit={search} className="hidden sm:block">
      <label className="relative block">
        <span className="sr-only">Search</span>
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          className="h-8 w-52 rounded-md border border-transparent bg-soft pr-8 pl-8 text-[12px] outline-none transition-[border-color,background-color,box-shadow] duration-150 ease-[var(--ease-craft)] placeholder:text-faint focus:border-border focus:bg-card focus:ring-2 focus:ring-ring/15"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 hidden h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded border border-border bg-card px-1 font-sans text-[10px] font-medium text-faint sm:inline-flex">
          /
        </kbd>
      </label>
    </form>
  );
}

export function HeaderSearch() {
  return (
    <Suspense fallback={<div className="hidden h-8 w-52 sm:block" />}>
      <HeaderSearchField />
    </Suspense>
  );
}
