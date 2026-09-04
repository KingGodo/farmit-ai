import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <p className="text-[13px] text-faint">Not found</p>
      <h1 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em]">This page is not in FarmIT</h1>
      <p className="mt-2 text-[13px] text-muted-foreground">
        The route does not exist, or this sample record is missing.
      </p>
      <Link href="/" className="mt-6 text-[13px] font-medium text-primary hover:text-primary/80">
        Back to overview
      </Link>
    </div>
  );
}
