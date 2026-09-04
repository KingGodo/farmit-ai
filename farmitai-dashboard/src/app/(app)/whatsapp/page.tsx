"use client";

import { Badge } from "@/components/ui/badge";
import { SampleDirectory } from "@/components/sample-directory";
import { dummyThreads, type DummyThread } from "@/lib/dummy";
import { formatDateTime } from "@/lib/format";

const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "unread", label: "Unread", match: (row: DummyThread) => row.unread > 0 },
];

function search(row: DummyThread) {
  return [row.farmerName, row.phone, row.lastMessage];
}

export default function WhatsAppPage() {
  return (
    <SampleDirectory
      data={dummyThreads}
      search={search}
      filters={filters}
      countNoun="threads"
      columns={[
        {
          header: "Farmer",
          cell: (row) => (
            <>
              <span className="block text-[13px]">{row.farmerName}</span>
              <span className="block font-mono text-[12px] font-normal text-muted-foreground">{row.phone}</span>
            </>
          ),
        },
        { header: "Last message", cell: (row) => <span className="text-[13px]">{row.lastMessage}</span> },
        {
          header: "Unread",
          cell: (row) => (
            <span className="font-mono text-[13px] tabular-nums">{row.unread || "—"}</span>
          ),
        },
        {
          header: "Channel",
          cell: () => <Badge variant="outline">WhatsApp</Badge>,
        },
        {
          header: "Updated",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDateTime(row.updatedAt)}
            </span>
          ),
        },
      ]}
    />
  );
}
