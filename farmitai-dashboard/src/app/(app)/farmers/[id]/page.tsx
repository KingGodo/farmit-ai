import Link from "next/link";
import { notFound } from "next/navigation";

import { PageFrame, SampleMark, SampleNote } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { diagnosesForFarmerName, farmsForFarmer, getFarmer } from "@/lib/dummy";
import { formatDate, formatDateTime, statusVariant } from "@/lib/format";

export default async function FarmerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const farmer = getFarmer(id);
  if (!farmer) notFound();

  const farms = farmsForFarmer(farmer.id);
  const diagnoses = diagnosesForFarmerName(farmer.name);

  return (
    <PageFrame>
      <div className="flex items-center justify-between gap-3">
        <Link href="/farmers" className="text-[13px] text-muted-foreground hover:text-foreground">
          ← Farmers
        </Link>
        <SampleMark />
      </div>
      <SampleNote />

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[12px] text-faint">Farmer</p>
            <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.03em]">{farmer.name}</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {farmer.district}, {farmer.province}
            </p>
          </div>
          <Badge variant={statusVariant(farmer.status)}>{farmer.status.toLowerCase()}</Badge>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-[12px] text-faint">Phone</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{farmer.phone}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Email</dt>
            <dd className="mt-1 text-[13px]">{farmer.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Joined</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{formatDate(farmer.joinedAt)}</dd>
          </div>
        </dl>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Farms</p>
        </div>
        {farms.length ? (
          <ul>
            {farms.map((farm, index) => (
              <li
                key={farm.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${index !== 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <Link href={`/farms/${farm.id}`} className="text-[13px] font-medium hover:text-forest">
                    {farm.name}
                  </Link>
                  <p className="text-[12px] text-muted-foreground">
                    {farm.crop} · {farm.hectares.toFixed(1)} ha
                  </p>
                </div>
                <p className="font-mono text-[13px] tabular-nums">{farm.health}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">No farms in this sample.</p>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Recent diagnoses</p>
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
                  <p className="text-[12px] text-muted-foreground">{row.crop}</p>
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
