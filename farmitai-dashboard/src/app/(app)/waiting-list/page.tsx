"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { fetchWaitingList, reviewWaitingList } from "@/lib/client-api";
import { formatDate, statusVariant } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import type { ApplicantType, WaitingListFilters, WaitingListStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statuses: { id: "" | WaitingListStatus; label: string }[] = [
  { id: "", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

const types: { id: "" | ApplicantType; label: string }[] = [
  { id: "", label: "Everyone" },
  { id: "FARMER", label: "Farmers" },
  { id: "AGRONOMIST", label: "Agronomists" },
];

function parseStatus(value: string | null): WaitingListStatus | "" {
  return value === "PENDING" || value === "APPROVED" || value === "REJECTED" ? value : "";
}

function parseApplicantType(value: string | null): ApplicantType | "" {
  return value === "FARMER" || value === "AGRONOMIST" ? value : "";
}

function WaitingListView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(searchParams.get("q") ?? "");

  const filters = useMemo((): WaitingListFilters => {
    return {
      status: parseStatus(searchParams.get("status")),
      applicantType: parseApplicantType(searchParams.get("type")),
      q: searchParams.get("q") ?? "",
      page: Number(searchParams.get("page") ?? "0"),
      size: 20,
    };
  }, [searchParams]);

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
    router.replace(`/waiting-list?${next.toString()}`);
  };

  const list = useQuery({
    queryKey: queryKeys.waitingList(filters),
    queryFn: () => fetchWaitingList(filters),
  });

  const review = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED";
    }) => reviewWaitingList(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waiting-list"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.waitingListCounts });
    },
  });

  const start = (list.data?.page ?? 0) * (list.data?.size ?? 20);
  const shown = list.data?.items.length ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-px">
          {statuses.map((item) => (
            <button
              key={item.id || "all"}
              type="button"
              onClick={() => setParams({ status: item.id })}
              className={cn(
                "h-7 rounded-md px-2.5 text-[13px] transition-colors duration-150 ease-[var(--ease-craft)]",
                filters.status === item.id
                  ? "bg-lime font-semibold text-ink"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
          <span className="mx-2 hidden h-4 w-px bg-border sm:block" />
          {types.map((item) => (
            <button
              key={item.id || "everyone"}
              type="button"
              onClick={() => setParams({ type: item.id })}
              className={cn(
                "h-7 rounded-md px-2.5 text-[13px] transition-colors duration-150 ease-[var(--ease-craft)]",
                filters.applicantType === item.id
                  ? "bg-lime font-semibold text-ink"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form
          className="sm:w-56"
          onSubmit={(event) => {
            event.preventDefault();
            setParams({ q: draft });
          }}
        >
          <label className="relative block">
            <span className="sr-only">Search name or phone</span>
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
            <input
              value={draft}
              placeholder="Name or phone"
              className="h-8 w-full rounded-md border border-transparent bg-muted/70 pr-3 pl-8 text-[13px] outline-none transition-[border-color,background-color] duration-150 ease-[var(--ease-craft)] placeholder:text-faint focus:border-border focus:bg-card"
              onChange={(event) => setDraft(event.target.value)}
            />
          </label>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center justify-between border-b border-border px-4">
          <p className="text-[13px] font-medium">
            {list.isLoading ? "Loading queue" : `${list.data?.totalItems ?? 0} applicants`}
          </p>
          {filters.q && (
            <p className="text-[12px] text-muted-foreground">
              Matching “{filters.q}”
            </p>
          )}
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Farming</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.data?.items.length ? (
                list.data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="text-[13px] font-medium">{item.name}</p>
                      <p className="text-[12px] text-muted-foreground">{item.email ?? "—"}</p>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {item.applicantType === "AGRONOMIST" ? "Agronomist" : "Farmer"}
                    </TableCell>
                    <TableCell className="font-mono text-[12px] tabular-nums">{item.phone}</TableCell>
                    <TableCell className="text-[13px]">{item.location ?? "—"}</TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {item.farmingType ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(item.status)}>
                        {item.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-[12px] tabular-nums text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === "PENDING" ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            disabled={review.isPending}
                            onClick={() => review.mutate({ id: item.id, status: "APPROVED" })}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={review.isPending}
                            onClick={() => review.mutate({ id: item.id, status: "REJECTED" })}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[12px] text-faint">Reviewed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-[13px] text-muted-foreground">
                    No matching applicants.
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

      {review.error && (
        <p className="text-sm text-destructive">{(review.error as Error).message}</p>
      )}
    </div>
  );
}

export default function WaitingListPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <WaitingListView />
    </Suspense>
  );
}
