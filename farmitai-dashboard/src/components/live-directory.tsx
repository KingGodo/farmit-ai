"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAdminPage } from "@/lib/client-api";
import type { DirectoryFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

export type LiveColumn<T> = {
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
};

export type LiveFilter = {
  id: string;
  label: string;
  param?: "status" | "role" | "channel";
};

export function LiveDirectoryView<T extends { id: string }>({
  path,
  countNoun,
  columns,
  filters = [],
  href,
  searchPlaceholder = "Search",
  filterKey = "status",
  action,
}: {
  path: string;
  countNoun: string;
  columns: LiveColumn<T>[];
  filters?: LiveFilter[];
  href?: (row: T) => string;
  searchPlaceholder?: string;
  filterKey?: "status" | "role" | "channel";
  action?: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState(searchParams.get("q") ?? "");
  const filterParam = filterKey;

  const query = useMemo((): DirectoryFilters => {
    return {
      status: filterParam === "status" ? searchParams.get("status") ?? "" : "",
      role: filterParam === "role" ? searchParams.get("role") ?? "" : "",
      channel: filterParam === "channel" ? searchParams.get("channel") ?? "" : "",
      q: searchParams.get("q") ?? "",
      page: Number(searchParams.get("page") ?? "0"),
      size: 20,
    };
  }, [filterParam, searchParams]);

  useEffect(() => {
    setDraft(searchParams.get("q") ?? "");
  }, [searchParams]);

  const setParams = (patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
    }
    if (!("page" in patch)) next.delete("page");
    router.replace(`?${next.toString()}`);
  };

  const list = useQuery({
    queryKey: ["admin", path, query],
    queryFn: () => fetchAdminPage<T>(path, query),
  });

  const start = (list.data?.page ?? 0) * (list.data?.size ?? 20);
  const shown = list.data?.items.length ?? 0;
  const activeFilter =
    filterParam === "role" ? query.role : filterParam === "channel" ? query.channel : query.status;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {filters.length ? (
          <div className="flex min-w-0 flex-wrap items-center gap-px">
            {filters.map((item) => (
              <button
                key={item.id || "all"}
                type="button"
                onClick={() => setParams({ [filterParam]: item.id })}
                className={cn(
                  "h-7 rounded-md px-2.5 text-[13px] transition-colors duration-150 ease-[var(--ease-craft)]",
                  activeFilter === item.id
                    ? "bg-lime font-semibold text-ink"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}
        <div className="flex flex-wrap items-center justify-end gap-2">
        <form
          className="sm:w-56"
          onSubmit={(event) => {
            event.preventDefault();
            setParams({ q: draft });
          }}
        >
          <label className="relative block">
            <span className="sr-only">{searchPlaceholder}</span>
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
            <input
              value={draft}
              placeholder={searchPlaceholder}
              className="h-8 w-full rounded-md border border-transparent bg-muted/70 pr-3 pl-8 text-[13px] outline-none transition-[border-color,background-color] duration-150 ease-[var(--ease-craft)] placeholder:text-faint focus:border-border focus:bg-card"
              onChange={(event) => setDraft(event.target.value)}
            />
          </label>
        </form>
        {action}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center justify-between border-b border-border px-4">
          <p className="text-[13px] font-medium">
            {list.isLoading ? "Loading" : `${list.data?.totalItems ?? 0} ${countNoun}`}
          </p>
        </div>
        {list.isLoading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : list.error ? (
          <p className="p-5 text-sm text-destructive">{(list.error as Error).message}</p>
        ) : (
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
              {list.data?.items.length ? (
                list.data.items.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column, index) => (
                      <TableCell key={column.header} className={column.className}>
                        {index === 0 && href ? (
                          <Link
                            href={href(row)}
                            className="font-medium text-foreground transition-colors duration-150 hover:text-forest"
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
                    No matching rows.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {!!list.data && list.data.totalPages > 1 && (
          <div className="flex h-12 items-center justify-between border-t border-border px-4 text-[13px] text-muted-foreground">
            <p>
              {shown ? `${start + 1}–${start + shown}` : "0"} of {list.data.totalItems}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={list.data.page === 0}
                onClick={() => setParams({ page: list.data!.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={list.data.page + 1 >= list.data.totalPages}
                onClick={() => setParams({ page: list.data!.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function LiveDirectory<T extends { id: string }>(props: {
  path: string;
  countNoun: string;
  columns: LiveColumn<T>[];
  filters?: LiveFilter[];
  href?: (row: T) => string;
  searchPlaceholder?: string;
  filterKey?: "status" | "role" | "channel";
  action?: ReactNode;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <LiveDirectoryView {...props} />
    </Suspense>
  );
}
