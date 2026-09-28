import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-shade" aria-hidden />

      <div className="page-container landing-hero-copy">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,20rem)] lg:gap-12">
          <div className="max-w-xl">
            <p className="animate-rise inline-flex items-center rounded-md border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-semibold tracking-[0.04em] text-white/95 backdrop-blur-sm">
              FarmIt AI · Farming for Zimbabwe
            </p>
            <h1 className="animate-rise-delay landing-hero-title mt-4 text-white">
              Crop advice on your WhatsApp.
            </h1>
            <p className="animate-rise-delay-2 mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-[15px]">
              Diagnose maize diseases from a leaf photo and get clear treatment
              steps. Join the waiting list on this website, not WhatsApp.
            </p>
            <div className="animate-rise-delay-3 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={site.waitlistPath}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-lime px-5 text-sm font-semibold text-ink transition-[background-color,transform] duration-200 ease-[var(--ease-craft)] hover:bg-lime-dark active:scale-[0.98]"
              >
                Join the waiting list
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-11 items-center rounded-lg border border-white/25 px-5 text-sm font-medium text-white transition-[background-color] duration-200 ease-[var(--ease-craft)] hover:bg-white/10"
              >
                See how it works
              </a>
            </div>
          </div>

          <aside className="animate-rise-delay-3 w-full rounded-xl border border-white/15 bg-black/35 p-5 backdrop-blur-md sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lime">
              Our Mission
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Give Zimbabwean farmers fast, local crop advice on the phone they
              already use. Disease should not wait for an extension visit.
            </p>
            <a
              href="#about"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime transition-[gap] duration-150 ease-[var(--ease-craft)] hover:gap-3"
            >
              Learn more
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
