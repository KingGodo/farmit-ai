"use client";

import { LogOut } from "lucide-react";
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
        className="flex h-8 items-center gap-2 rounded-md border border-border bg-card pr-2.5 pl-1 transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-soft"
      >
        <span className="flex size-6 items-center justify-center rounded-[5px] bg-forest text-[10px] font-semibold tracking-[0.02em] text-white">
          {initials}
        </span>
        <span className="hidden max-w-[120px] truncate text-[12px] font-medium sm:block">{name}</span>
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
