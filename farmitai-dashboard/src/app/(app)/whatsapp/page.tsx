"use client";

import { Badge } from "@/components/ui/badge";
import { LiveDirectory } from "@/components/live-directory";
import { formatDateTime } from "@/lib/format";
import type { AdminConversation } from "@/lib/types";

export default function WhatsAppPage() {
  return (
    <LiveDirectory<AdminConversation>
      path="conversations"
      countNoun="threads"
      filterKey="channel"
      searchPlaceholder="Phone"
      filters={[
        { id: "", label: "All" },
        { id: "WHATSAPP", label: "WhatsApp" },
        { id: "APP", label: "App" },
      ]}
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
        { header: "Last message", cell: (row) => <span className="text-[13px]">{row.lastMessage || "—"}</span> },
        {
          header: "Channel",
          cell: (row) => <Badge variant="outline">{row.channel === "APP" ? "App" : "WhatsApp"}</Badge>,
        },
        {
          header: "Updated",
          cell: (row) => (
            <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
              {formatDateTime(row.lastMessageAt)}
            </span>
          ),
        },
      ]}
    />
  );
}
