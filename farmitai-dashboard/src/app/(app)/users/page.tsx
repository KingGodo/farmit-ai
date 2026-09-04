"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyUsers, type DummyUser } from "@/lib/dummy";
import { formatDateTime, statusVariant } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "ADMIN", label: "Admin", match: (row: DummyUser) => row.role === "ADMIN" },
  { id: "FARMER", label: "Farmers", match: (row: DummyUser) => row.role === "FARMER" },
  { id: "AGRONOMIST", label: "Agronomists", match: (row: DummyUser) => row.role === "AGRONOMIST" },
  { id: "AGRO_BUSINESS", label: "Agro business", match: (row: DummyUser) => row.role === "AGRO_BUSINESS" },
];

function search(row: DummyUser) {
  return [row.name, row.email, row.phone, row.role, row.status];
}

export default function UsersPage() {
  return (
    <SampleDirectory
      data={dummyUsers}
      search={search}
      filters={filters}
      countNoun="users"
      columns={[
        {
          header: "Name",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.name}</span>
              <span className="block text-[12px] font-normal text-muted-foreground">
                {row.email || "No email"}
              </span>
            </>
          ),
        },
        { header: "Role", cell: (row) => <span className="text-[13px]">{row.role.replaceAll("_", " ")}</span> },
        {
          header: "Phone",
          cell: (row) => <span className="font-mono text-[12px] tabular-nums">{row.phone}</span>,
        },
        {
          header: "Status",
          cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status.toLowerCase()}</Badge>,
        },
        {
          header: "Last login",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDateTime(row.lastLoginAt)}
            </span>
          ),
        },
      ]}
    />
  );
}
