import Link from "next/link";
import { notFound } from "next/navigation";

import { PageFrame } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { farmitAuthed } from "@/lib/farmit";
import { statusVariant } from "@/lib/format";
import { FarmitApiError, type AdminFarmDetail } from "@/lib/types";

export default async function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let farm: AdminFarmDetail;
  try {
    farm = (await farmitAuthed<AdminFarmDetail>(`/api/v1/admin/farms/${id}`)).data;
  } catch (error) {
    if (error instanceof FarmitApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <PageFrame>
      <Link href="/farms" className="text-[13px] text-muted-foreground hover:text-foreground">
        ← Farms
      </Link>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[12px] text-faint">Farm</p>
            <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.03em]">{farm.name}</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">{farm.district ?? "—"}</p>
          </div>
          <Badge variant={statusVariant(farm.status)}>{farm.status.toLowerCase()}</Badge>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-4">
          <div>
            <dt className="text-[12px] text-faint">Farmer</dt>
            <dd className="mt-1">
              <Link href={`/farmers/${farm.farmerId}`} className="text-[13px] font-medium hover:text-forest">
                {farm.farmerName}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Hectares</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">
              {farm.hectares == null ? "—" : Number(farm.hectares).toFixed(1)}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Province</dt>
            <dd className="mt-1 text-[13px]">{farm.province ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Fields</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{farm.fields.length}</dd>
          </div>
        </dl>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Fields</p>
        </div>
        {farm.fields.length ? (
          <ul>
            {farm.fields.map((field, index) => (
              <li
                key={field.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${index !== 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <p className="text-[13px] font-medium">{field.name}</p>
                  <p className="text-[12px] text-muted-foreground">{field.soilType ?? "No soil type"}</p>
                </div>
                <span className="font-mono text-[13px] tabular-nums">
                  {field.hectares == null ? "—" : `${Number(field.hectares).toFixed(1)} ha`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">No fields yet.</p>
        )}
      </section>
    </PageFrame>
  );
}
