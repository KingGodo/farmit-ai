"use client";

import Link from "next/link";
import { ChevronDown, CircleUser, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { displayNameFromEmail, displayRole } from "@/lib/user";
import { cn } from "@/lib/utils";

export function UserMenu({
  email,
  roles,
  onSignOut,
}: {
  email: string | null | undefined;
  roles?: string[];
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const name = displayNameFromEmail(email);
  const role = displayRole(roles);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className={cn(
          "flex h-8 max-w-[220px] items-center gap-2 rounded-lg px-1.5 text-left transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-muted",
          open && "bg-muted"
        )}
      >
        <CircleUser className="size-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-medium leading-4 tracking-[-0.02em]">
            {name}
          </span>
          <span className="block truncate text-[11px] leading-4 text-muted-foreground">{role}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-faint transition-transform duration-150 ease-[var(--ease-craft)]",
            open && "rotate-180"
          )}
          strokeWidth={2}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-56 overflow-hidden rounded-lg border border-border bg-card py-1"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-[13px] font-medium">{name}</p>
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex h-9 w-full items-center gap-2 px-3 text-[13px] transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-soft"
          >
            <User className="size-3.5 text-faint" />
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            className="flex h-9 w-full items-center gap-2 px-3 text-[13px] transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-soft"
          >
            <LogOut className="size-3.5 text-faint" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
