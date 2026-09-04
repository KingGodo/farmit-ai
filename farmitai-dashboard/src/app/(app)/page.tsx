"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SampleMark } from "@/components/page-frame";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWaitingList } from "@/lib/client-api";
import { dummyInsights, platformStats } from "@/lib/dummy";
import { queryKeys } from "@/lib/query-keys";
import { formatDate, formatNumber, statusVariant } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function OverviewPage() {
  const pending = useQuery({
    queryKey: queryKeys.waitingList({ status: "PENDING", size: 1 }),
    queryFn: () => fetchWaitingList({ status: "PENDING", size: 1 }),
  });
  const approved = useQuery({
    queryKey: queryKeys.waitingList({ status: "APPROVED", size: 1 }),
    queryFn: () => fetchWaitingList({ status: "APPROVED", size: 1 }),
  });
  const rejected = useQuery({
    queryKey: queryKeys.waitingList({ status: "REJECTED", size: 1 }),
    queryFn: () => fetchWaitingList({ status: "REJECTED", size: 1 }),
  });
  const farmers = useQuery({
    queryKey: queryKeys.waitingList({ applicantType: "FARMER", size: 1 }),
    queryFn: () => fetchWaitingList({ applicantType: "FARMER", size: 1 }),
  });
  const agronomists = useQuery({
    queryKey: queryKeys.waitingList({ applicantType: "AGRONOMIST", size: 1 }),
    queryFn: () => fetchWaitingList({ applicantType: "AGRONOMIST", size: 1 }),
  });
  const recent = useQuery({
    queryKey: queryKeys.waitingList({ size: 8 }),
    queryFn: () => fetchWaitingList({ size: 8 }),
  });

  const loading = pending.isLoading || recent.isLoading;
  const error = pending.error ?? recent.error;
  const total =
    (pending.data?.totalItems ?? 0) +
    (approved.data?.totalItems ?? 0) +
    (rejected.data?.totalItems ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}

      <section className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <Link
          href="/waiting-list?status=PENDING"
          className="rounded-lg border border-border bg-card p-4 transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-muted/40"
        >
          <p className="text-[13px] text-muted-foreground">Needs review</p>
          {loading ? (
            <Skeleton className="mt-3 h-10 w-20" />
          ) : (
            <p className="mt-3 font-mono text-[32px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
              {pending.data?.totalItems ?? 0}
            </p>
          )}
          <p className="mt-3 text-[13px] text-muted-foreground">
            Pending applicants in the first Zimbabwe cohort.
          </p>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Approved", value: approved.data?.totalItems, href: "/waiting-list?status=APPROVED" },
            { label: "Rejected", value: rejected.data?.totalItems, href: "/waiting-list?status=REJECTED" },
            { label: "Farmers", value: farmers.data?.totalItems, href: "/waiting-list?type=FARMER" },
            { label: "Agronomists", value: agronomists.data?.totalItems, href: "/waiting-list?type=AGRONOMIST" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-lg border border-border bg-card p-4 transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-muted/40"
            >
              <p className="text-[13px] text-muted-foreground">{stat.label}</p>
              {loading ? (
                <Skeleton className="mt-3 h-7 w-10" />
              ) : (
                <p className="mt-3 font-mono text-xl font-semibold tracking-[-0.04em] tabular-nums">
                  {stat.value ?? 0}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center justify-between border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">
            Recent applicants
            <span className="ml-2 font-normal text-muted-foreground">
              {loading ? "" : `${total} total`}
            </span>
          </p>
          <Link
            href="/waiting-list"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors duration-150 ease-[var(--ease-craft)] hover:text-foreground"
          >
            Open queue
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : recent.data?.items.length ? (
          <ul>
            {recent.data.items.map((item, index) => (
              <li
                key={item.id}
                className={cn(
                  "flex items-center justify-between gap-4 px-4 py-3",
                  index !== 0 && "border-t border-border"
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{item.name}</p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    {item.location ?? "—"} ·{" "}
                    {item.applicantType === "AGRONOMIST" ? "Agronomist" : "Farmer"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden font-mono text-[12px] tabular-nums text-muted-foreground sm:block">
                    {formatDate(item.createdAt)}
                  </span>
                  <Badge variant={statusVariant(item.status)}>{item.status.toLowerCase()}</Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-10 text-center text-[13px] text-muted-foreground">
            No applicants yet.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Platform snapshot</p>
          <SampleMark />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Active farmers", value: platformStats.activeFarmers, href: "/farmers" },
            { label: "Agro businesses", value: platformStats.agroBusinesses, href: "/agro-businesses" },
            { label: "Diagnoses · 7d", value: platformStats.diagnosesThisWeek, href: "/diagnoses" },
            { label: "WhatsApp open", value: platformStats.whatsappOpen, href: "/whatsapp" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-lg border border-border bg-card p-4 transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-muted/40"
            >
              <p className="text-[13px] text-muted-foreground">{stat.label}</p>
              <p className="mt-3 font-mono text-xl font-semibold tracking-[-0.04em] tabular-nums">
                {formatNumber(stat.value)}
              </p>
            </Link>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex h-10 items-center justify-between border-b border-border px-4">
            <p className="text-[13px] font-semibold tracking-[-0.02em]">Intelligence</p>
            <Link
              href="/intelligence"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors duration-150 ease-[var(--ease-craft)] hover:text-foreground"
            >
              All reports
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <ul>
            {dummyInsights.slice(0, 3).map((row, index) => (
              <li
                key={row.id}
                className={cn(
                  "flex items-center justify-between gap-4 px-4 py-3",
                  index !== 0 && "border-t border-border"
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{row.title}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {row.kind} · {row.window}
                  </p>
                </div>
                <span className="hidden text-[12px] text-muted-foreground sm:block">{row.action}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
