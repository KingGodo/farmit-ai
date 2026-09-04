"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { displayNameFromEmail, initialsFromEmail } from "@/lib/user";

export function UserMenu({
  email,
  onSignOut,
}: {
  email: string | null | undefined;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const initials = initialsFromEmail(email);
  const name = displayNameFromEmail(email);

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
        className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-[140px] truncate text-sm font-medium">{name}</span>
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-56 rounded-md border border-border bg-card py-1"
        >
          <div className="border-b border-border px-3 py-2">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-muted"
          >
            <LogOut className="size-4 text-muted-foreground" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
