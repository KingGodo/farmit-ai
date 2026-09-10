import Link from "next/link";
import { notFound } from "next/navigation";

import { PageFrame } from "@/components/page-frame";
import { Badge } from "@/components/ui/badge";
import { farmitAuthed } from "@/lib/farmit";
import { statusVariant } from "@/lib/format";
import { FarmitApiError, type AdminAgroBusinessDetail } from "@/lib/types";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let business: AdminAgroBusinessDetail;
  try {
    business = (await farmitAuthed<AdminAgroBusinessDetail>(`/api/v1/admin/agro-businesses/${id}`)).data;
  } catch (error) {
    if (error instanceof FarmitApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <PageFrame>
      <Link href="/agro-businesses" className="text-[13px] text-muted-foreground hover:text-foreground">
        ← Agro businesses
      </Link>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[12px] text-faint">Agro business</p>
            <h2 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.03em]">{business.name}</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">{business.description ?? "—"}</p>
          </div>
          <Badge variant={statusVariant(business.status)}>{business.status.toLowerCase()}</Badge>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <dt className="text-[12px] text-faint">Phone</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{business.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Email</dt>
            <dd className="mt-1 text-[13px]">{business.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-faint">Locations</dt>
            <dd className="mt-1 font-mono text-[13px] tabular-nums">{business.locations.length}</dd>
          </div>
        </dl>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex h-10 items-center border-b border-border px-4">
          <p className="text-[13px] font-semibold tracking-[-0.02em]">Locations</p>
        </div>
        {business.locations.length ? (
          <ul>
            {business.locations.map((location, index) => (
              <li
                key={location.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${index !== 0 ? "border-t border-border" : ""}`}
              >
                <div>
                  <p className="text-[13px] font-medium">{location.name}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {[location.address, location.district, location.province].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">No shop locations yet.</p>
        )}
      </section>
    </PageFrame>
  );
}
