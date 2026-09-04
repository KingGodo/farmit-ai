"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyInputs, type DummyInput } from "@/lib/dummy";
import { statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "IN_STOCK", label: "In stock", match: (row: DummyInput) => row.status === "IN_STOCK" },
  { id: "LOW", label: "Low", match: (row: DummyInput) => row.status === "LOW" },
  { id: "OUT_OF_STOCK", label: "Out", match: (row: DummyInput) => row.status === "OUT_OF_STOCK" },
];

function search(row: DummyInput) {
  return [row.name, row.kind, row.treats];
}

export default function InputsPage() {
  return (
    <SampleDirectory
      data={dummyInputs}
      search={search}
      filters={filters}
      countNoun="products"
      columns={[
        {
          header: "Product",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">{row.kind}</span>
            </>
          ),
        },
        { header: "Treats", cell: (row) => <span className="text-[13px]">{row.treats}</span> },
        {
          header: "Shops",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{row.stockedAt}</span>,
        },
        {
          header: "Availability",
          cell: (row) => (
            <Badge variant={statusVariant(row.status)}>{row.status.replaceAll("_", " ").toLowerCase()}</Badge>
          ),
        },
      ]}
    />
  );
}
