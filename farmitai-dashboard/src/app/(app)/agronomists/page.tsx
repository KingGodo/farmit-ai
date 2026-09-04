"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyAgronomists, type DummyAgronomist } from "@/lib/dummy";
import { statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "ACTIVE", label: "Active", match: (row: DummyAgronomist) => row.status === "ACTIVE" },
  { id: "PENDING", label: "Pending", match: (row: DummyAgronomist) => row.status === "PENDING" },
];

function search(row: DummyAgronomist) {
  return [row.name, row.email, row.district, row.specialty];
}

export default function AgronomistsPage() {
  return (
    <SampleDirectory
      data={dummyAgronomists}
      search={search}
      filters={filters}
      countNoun="agronomists"
      columns={[
        {
          header: "Name",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">{row.email}</span>
            </>
          ),
        },
        { header: "Specialty", cell: (row) => <span className="text-[13px]">{row.specialty}</span> },
        { header: "Based", cell: (row) => <span className="text-[13px]">{row.district}</span> },
        {
          header: "Farmers",
          cell: (row) => (
            <span className="font-mono text-[13px] tabular-nums">{row.farmersSupported}</span>
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
