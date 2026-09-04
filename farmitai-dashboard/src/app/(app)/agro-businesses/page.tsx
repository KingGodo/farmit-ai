"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyBusinesses, type DummyBusiness } from "@/lib/dummy";
import { formatNumber, statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "ACTIVE", label: "Active", match: (row: DummyBusiness) => row.status === "ACTIVE" },
  { id: "PENDING", label: "Pending", match: (row: DummyBusiness) => row.status === "PENDING" },
];

function search(row: DummyBusiness) {
  return [row.name, row.district, row.province, row.email];
}

export default function AgroBusinessesPage() {
  return (
    <SampleDirectory
      data={dummyBusinesses}
      search={search}
      filters={filters}
      href={(row) => `/agro-businesses/${row.id}`}
      countNoun="businesses"
      columns={[
        {
          header: "Business",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">{row.province}</span>
            </>
          ),
        },
        { header: "District", cell: (row) => <span className="text-[13px]">{row.district}</span> },
        {
          header: "SKUs",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{formatNumber(row.skuCount)}</span>,
        },
        {
          header: "Catchment",
          cell: (row) => (
            <span className="font-mono text-[13px] tabular-nums">{formatNumber(row.catchmentFarmers)}</span>
          ),
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
      ]}
    />
  );
}
