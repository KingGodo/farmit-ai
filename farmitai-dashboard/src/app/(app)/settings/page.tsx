import { PageFrame, SampleMark, SampleNote } from "@/components/page-frame";
import { dummySettings } from "@/lib/dummy";

const groups = [...new Set(dummySettings.map((row) => row.group))];

export default function SettingsPage() {
  return (
    <PageFrame>
      <div className="flex items-center justify-between gap-3">
        <SampleNote />
        <SampleMark />
      </div>

      {groups.map((group) => (
        <section key={group} className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex h-10 items-center border-b border-border px-4">
            <p className="text-[13px] font-semibold tracking-[-0.02em]">{group}</p>
          </div>
          <ul>
            {dummySettings
              .filter((row) => row.group === group)
              .map((row, index) => (
                <li
                  key={row.key}
                  className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                    index !== 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div>
                    <p className="font-mono text-[12px]">{row.key}</p>
                    <p className="text-[12px] text-muted-foreground">{row.description}</p>
                  </div>
                  <p className="font-mono text-[13px] tabular-nums">{row.value}</p>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </PageFrame>
  );
}
