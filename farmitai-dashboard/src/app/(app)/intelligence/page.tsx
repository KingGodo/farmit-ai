import Link from "next/link";

import { PageFrame, SampleMark, SampleNote } from "@/components/page-frame";
import { dummyInsights, platformStats } from "@/lib/dummy";
import { formatNumber } from "@/lib/format";

const kpis = [
  { label: "Diagnoses this week", value: platformStats.diagnosesThisWeek, href: "/diagnoses" },
  { label: "Farms mapped", value: platformStats.farmsMapped, href: "/farms" },
  { label: "Avg farm health", value: platformStats.avgHealth, href: "/farms" },
  { label: "Open WhatsApp", value: platformStats.whatsappOpen, href: "/whatsapp" },
];

export default function IntelligencePage() {
  return (
    <PageFrame>
      <div className="flex items-center justify-between gap-3">
        <SampleNote />
        <SampleMark />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="rounded-lg border border-border bg-card p-4 transition-colors duration-150 ease-[var(--ease-craft)] hover:bg-muted/40"
          >
            <p className="text-[13px] text-muted-foreground">{kpi.label}</p>
            <p className="mt-3 font-mono text-xl font-semibold tracking-[-0.04em] tabular-nums">
              {formatNumber(kpi.value)}
            </p>
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Extracted intelligence</p>
        </div>
        <ul>
          {dummyInsights.map((row, index) => (
            <li
              key={row.id}
              className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                index !== 0 ? "border-t border-border" : ""
              }`}
            >
              <div>
                <p className="text-[13px] font-medium">{row.title}</p>
                <p className="text-[12px] text-muted-foreground">
                  {row.kind} · last {row.window}
                </p>
              </div>
              <p className="text-[12px] font-medium text-muted-foreground">{row.action}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
