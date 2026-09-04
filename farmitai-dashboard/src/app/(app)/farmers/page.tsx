"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyFarmers, type DummyFarmer } from "@/lib/dummy";
import { formatDate, statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "ACTIVE", label: "Active", match: (row: DummyFarmer) => row.status === "ACTIVE" },
  { id: "PENDING", label: "Pending", match: (row: DummyFarmer) => row.status === "PENDING" },
  { id: "SUSPENDED", label: "Suspended", match: (row: DummyFarmer) => row.status === "SUSPENDED" },
];

function search(row: DummyFarmer) {
  return [row.name, row.phone, row.district, row.province, row.farmingType];
}

export default function FarmersPage() {
  return (
    <SampleDirectory
      data={dummyFarmers}
      search={search}
      filters={filters}
      href={(row) => `/farmers/${row.id}`}
      countNoun="farmers"
      columns={[
        {
          header: "Farmer",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">{row.farmingType}</span>
            </>
          ),
        },
        { header: "District", cell: (row) => <span className="text-[13px]">{row.district}</span> },
        {
          header: "Phone",
          cell: (row) => <span className="font-mono text-[12px] tabular-nums">{row.phone}</span>,
        },
        {
          header: "Farms",
          cell: (row) => <span className="font-mono text-[13px] tabular-nums">{row.farms}</span>,
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
        {
          header: "Joined",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDate(row.joinedAt)}
            </span>
          ),
        },
      ]}
    />
  );
}
