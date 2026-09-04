"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyFarms, type DummyFarm } from "@/lib/dummy";
import { statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "ACTIVE", label: "Active", match: (row: DummyFarm) => row.status === "ACTIVE" },
  { id: "PENDING", label: "Pending", match: (row: DummyFarm) => row.status === "PENDING" },
];

function search(row: DummyFarm) {
  return [row.name, row.farmerName, row.district, row.crop];
}

export default function FarmsPage() {
  return (
    <SampleDirectory
      data={dummyFarms}
      search={search}
      filters={filters}
      href={(row) => `/farms/${row.id}`}
      countNoun="farms"
      columns={[
        {
          header: "Farm",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">{row.farmerName}</span>
            </>
          ),
        },
        { header: "District", cell: (row) => <span className="text-[13px]">{row.district}</span> },
        { header: "Crop", cell: (row) => <span className="text-[13px]">{row.crop}</span> },
        {
          header: "Hectares",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{row.hectares.toFixed(1)}</span>,
        },
        {
          header: "Health",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{row.health}</span>,
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
      ]}
    />
  );
}
