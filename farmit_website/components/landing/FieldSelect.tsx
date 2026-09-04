"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/components/lib/utils";

type FieldSelectProps = {
  id?: string;
  label: string;
  value: string;
  placeholder: string;
  options: readonly string[];
  searchable?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export default function FieldSelect({
  id,
  label,
  value,
  placeholder,
  options,
  searchable = false,
  error,
  onChange,
}: FieldSelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = searchable
    ? options.filter((option) =>
        option.toLowerCase().includes(query.trim().toLowerCase())
      )
    : options;

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
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
  }, [open]);

  return (
    <div ref={rootRef} className="relative space-y-2">
      <label htmlFor={fieldId} className="block text-[13px] font-medium text-ink">
        {label}
      </label>
      <button
        id={fieldId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex h-11 w-full items-center justify-between gap-3 whitespace-nowrap rounded-lg border bg-white px-4 text-left text-sm transition-[border-color,box-shadow] duration-150 ease-[var(--ease-craft)]",
          error
            ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20"
            : "border-border focus-visible:border-forest/25 focus-visible:ring-2 focus-visible:ring-forest/10",
          value ? "text-ink" : "text-faint"
        )}
      >
        <span className="min-w-0 truncate">{value || placeholder}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-faint transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white">
          {searchable && (
            <div className="border-b border-border p-2">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search district"
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-ink outline-none placeholder:text-faint focus:border-forest/30"
              />
            </div>
          )}
          <ul
            role="listbox"
            className="max-h-[min(14rem,45vh)] overflow-y-auto py-1 sm:max-h-56"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-faint">No matches</li>
            )}
            {filtered.map((option) => {
              const selected = option === value;
              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex h-10 w-full items-center justify-between gap-3 px-3 text-left text-sm transition-colors duration-150",
                      selected
                        ? "bg-soft text-ink"
                        : "text-ink hover:bg-soft"
                    )}
                  >
                    <span className="truncate">{option}</span>
                    {selected && <Check className="h-3.5 w-3.5 text-forest" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error ? (
        <p className="text-[12px] text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
