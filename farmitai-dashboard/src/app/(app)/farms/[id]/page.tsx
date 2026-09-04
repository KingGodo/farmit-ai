import Link from "next/link";
import { notFound } from "next/navigation";

import { PageFrame, SampleMark, SampleNote } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { diagnosesForFarm, getFarm } from "@/lib/dummy";
import { formatDateTime, statusVariant } from "@/lib/format";

export default async function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const farm = getFarm(id);
  if (!farm) notFound();

  const diagnoses = diagnosesForFarm(farm.id);

  return (
    <PageFrame>
      <div className="flex items-center justify-between gap-3">
        <Link href="/farms" className="text-[13px] text-muted-foreground hover:text-foreground">
          ← Farms
        </Link>
        <SampleMark />
      </div>
      <SampleNote />

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[12px] text-faint">Farm</p>
            <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.03em]">{farm.name}</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">{farm.district}</p>
          </div>
          <Badge variant={statusVariant(farm.status)}>{farm.status.toLowerCase()}</Badge>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-4">
          <div>
            <dt className="text-[12px] text-faint">Farmer</dt>
            <dd className="mt-1">
              <Link href={`/farmers/${farm.farmerId}`} className="text-[13px] font-medium hover:text-primary">
                {farm.farmerName}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Crop</dt>
            <dd className="mt-1 text-[13px]">{farm.crop}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Hectares</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{farm.hectares.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Health</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{farm.health}</dd>
          </div>
        </dl>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Diagnoses on this farm</p>
        </div>
        {diagnoses.length ? (
          <ul>
            {diagnoses.map((row, index) => (
              <li
                key={row.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${index !== 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <p className="text-[13px] font-medium">{row.problem}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {row.kind.toLowerCase()} · {Math.round(row.confidence * 100)}%
                  </p>
                </div>
                <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
                  {formatDateTime(row.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">No diagnoses in this sample.</p>
        )}
      </section>
    </PageFrame>
  );
}
