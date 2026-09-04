import type { ReactNode } from "react";
import Navbar from "@/components/landing/sections/nav";
import Footer from "@/components/landing/sections/footer";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-ink">
      <Navbar />
      <main>
        <article className="page-container max-w-2xl pt-28 pb-20 sm:pt-32 sm:pb-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
            Legal
          </p>
          <h1 className="mt-4 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2rem]">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated {updated}
          </p>
          <div className="mt-10 space-y-8">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
