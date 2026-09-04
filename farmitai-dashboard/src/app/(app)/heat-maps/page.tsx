import Link from "next/link";

import { PageFrame, SampleMark, SampleNote } from "@/components/page-frame";
import { dummyHeatDistricts, dummyHeatProvinces } from "@/lib/dummy";
import { formatNumber } from "@/lib/format";

export default function HeatMapsPage() {
  return (
    <PageFrame>
      <div className="flex items-center justify-between gap-3">
        <SampleNote />
        <SampleMark />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {dummyHeatProvinces.map((province) => (
          <div key={province.name} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold tracking-[-0.02em]">{province.name}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {formatNumber(province.diagnoses)} diagnoses · {formatNumber(province.demand)} input demand
                </p>
              </div>
              <p className="font-mono text-[13px] tabular-nums text-muted-foreground">
                {Math.round(province.intensity * 100)}
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round(province.intensity * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center justify-between border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Hottest districts</p>
          <Link
            href="/intelligence"
            className="text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            Open reports
          </Link>
        </div>
        <ul>
          {dummyHeatDistricts.map((row, index) => (
            <li
              key={row.district}
              className={`flex items-center justify-between gap-4 px-4 py-3 ${index !== 0 ? "border-t border-border" : ""}`}
            >
              <div>
                <p className="text-[13px] font-medium">{row.district}</p>
                <p className="text-[12px] text-muted-foreground">
                  {row.crop} · {row.issue}
                </p>
              </div>
              <p className="font-mono text-[13px] tabular-nums">{row.count}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
