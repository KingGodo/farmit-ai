import Link from "next/link";
import {
  waitlistDistrictCount,
  waitlistPassLine,
  waitlistSuccessCopy,
  type WaitlistSuccessInput,
} from "@/lib/waitlist";

type WaitlistSuccessProps = WaitlistSuccessInput & {
  onAddAnother: () => void;
};

export default function WaitlistSuccess({ onAddAnother, ...input }: WaitlistSuccessProps) {
  const copy = waitlistSuccessCopy(input);
  const passLine = waitlistPassLine(input);
  const districtCount = waitlistDistrictCount(input);

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
        {copy.kicker}
      </p>
      <h2 className="mt-3 text-[1.375rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.5rem]">
        {copy.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.body}</p>

      <div className="mt-8 rounded-lg border border-border bg-soft p-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            District pass
          </p>
          <p className="font-mono text-[11px] tabular-nums text-forest">{districtCount}</p>
        </div>
        <p className="mt-4 text-base font-semibold tracking-[-0.02em] text-ink">{input.fullName}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">{passLine}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">Joined on</p>
            <p className="mt-1 text-[13px] font-medium text-ink">This website</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">We reach you</p>
            <p className="mt-1 text-[13px] font-medium text-ink">Phone or email</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 min-[400px]:flex-row min-[400px]:flex-wrap">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-lime px-4 text-[13px] font-semibold text-ink transition-[background-color] duration-150 ease-[var(--ease-craft)] hover:bg-lime-dark"
        >
          Back to home
        </Link>
        <button
          type="button"
          onClick={onAddAnother}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-white px-4 text-[13px] font-medium text-ink transition-[background-color] duration-150 ease-[var(--ease-craft)] hover:bg-soft"
        >
          Add another person
        </button>
      </div>
    </div>
  );
}
