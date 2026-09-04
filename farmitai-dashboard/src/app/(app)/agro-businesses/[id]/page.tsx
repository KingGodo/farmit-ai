import Link from "next/link";
import { notFound } from "next/navigation";

import { PageFrame, SampleMark, SampleNote } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { dummyHeatDistricts, dummyInputs, getBusiness } from "@/lib/dummy";
import { formatNumber, statusVariant } from "@/lib/format";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = getBusiness(id);
  if (!business) notFound();

  return (
    <PageFrame>
      <div className="flex items-center justify-between gap-3">
        <Link href="/agro-businesses" className="text-[13px] text-muted-foreground hover:text-foreground">
          ← Agro businesses
        </Link>
        <SampleMark />
      </div>
      <SampleNote />

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[12px] text-faint">Agro business</p>
            <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.03em]">{business.name}</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {business.district}, {business.province}
            </p>
          </div>
          <Badge variant={statusVariant(business.status)}>{business.status.toLowerCase()}</Badge>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-[12px] text-faint">Catchment</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">
              {formatNumber(business.catchmentFarmers)} farmers
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Catalogue</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{formatNumber(business.skuCount)} SKUs</dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Contact</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{business.phone}</dd>
          </div>
        </dl>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Nearby demand</p>
        </div>
        <ul>
          {dummyHeatDistricts.slice(0, 4).map((row, index) => (
            <li
              key={row.district}
              className={`flex items-center justify-between gap-4 px-4 py-3 ${index !== 0 ? "border-t border-border" : ""}`}
            >
              <div>
                <p className="text-[13px] font-medium">{row.issue}</p>
                <p className="text-[12px] text-muted-foreground">
                  {row.district} · {row.crop}
                </p>
              </div>
              <p className="font-mono text-[13px] tabular-nums">{row.count}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Stocked inputs</p>
        </div>
        <ul>
          {dummyInputs.slice(0, 5).map((row, index) => (
            <li
              key={row.id}
              className={`flex items-center justify-between gap-4 px-4 py-3 ${index !== 0 ? "border-t border-border" : ""}`}
            >
              <div>
                <p className="text-[13px] font-medium">{row.name}</p>
                <p className="text-[12px] text-muted-foreground">{row.treats}</p>
              </div>
              <Badge variant={statusVariant(row.status)}>{row.status.replaceAll("_", " ").toLowerCase()}</Badge>
            </li>
          ))}
        </ul>
      </section>
    </PageFrame>
  );
}
