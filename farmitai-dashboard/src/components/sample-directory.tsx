"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { PageFrame, SampleMark, SampleNote } from "@/components/page-frame";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { matchesQuery } from "@/lib/format";
import { cn } from "@/lib/utils";

export type DirectoryColumn<T> = {
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
};

export type DirectoryFilter<T> = {
  id: string;
  label: string;
  match: (row: T) => boolean;
};

export function SampleDirectory<T extends { id: string }>({
  data,
  columns,
  search,
  filters,
  href,
  empty = "No matching rows.",
  countNoun = "records",
}: {
  data: T[];
  columns: DirectoryColumn<T>[];
  search: (row: T) => (string | null | undefined)[];
  filters?: DirectoryFilter<T>[];
  href?: (row: T) => string;
  empty?: string;
  countNoun?: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(filters?.[0]?.id ?? "");

  const rows = useMemo(() => {
    const active = filters?.find((item) => item.id === filter);
    return data.filter((row) => {
      if (active && !active.match(row)) return false;
      return matchesQuery(search(row), query);
    });
  }, [data, filter, filters, query, search]);

  return (
    <PageFrame>
      <div className="flex items-center justify-between gap-3">
        <SampleNote />
        <SampleMark />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {filters && filters.length > 0 ? (
          <div className="flex flex-wrap gap-px">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "h-7 rounded-md px-2.5 text-[13px] transition-colors duration-150 ease-[var(--ease-craft)]",
                  filter === item.id
                    ? "bg-muted font-medium text-foreground"
                    : "font-normal text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}
        <label className="relative block sm:w-56">
          <span className="sr-only">Filter</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter"
            className="h-8 w-full rounded-md border border-transparent bg-muted/70 pr-3 pl-8 text-[13px] outline-none transition-[border-color,background-color] duration-150 ease-[var(--ease-craft)] placeholder:text-faint focus:border-border focus:bg-card"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center justify-between border-b border-border px-4">
          <p className="text-[13px] text-muted-foreground">
            <span className="font-medium text-foreground">{rows.length}</span> {countNoun}
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column, index) => (
                    <TableCell key={column.header} className={column.className}>
                      {index === 0 && href ? (
                        <Link
                          href={href(row)}
                          className="font-medium text-foreground transition-colors duration-150 hover:text-primary"
                        >
                          {column.cell(row)}
                        </Link>
                      ) : (
                        column.cell(row)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12 text-center text-[13px] text-muted-foreground">
                  {empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </PageFrame>
  );
}
