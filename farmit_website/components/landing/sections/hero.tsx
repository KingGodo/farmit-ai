"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/farmit-hero-field.png";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88svh] flex-col overflow-hidden text-white lg:min-h-[100dvh]">
      <div className="absolute inset-0 bg-forest-deep">
        <Image
          src={heroImage}
          alt="Farmer working in a green field at golden hour"
          fill
          priority
          className="object-cover object-[72%_4%] sm:object-[68%_8%] md:object-[62%_14%] lg:object-[58%_18%]"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/88 via-forest-deep/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/75 via-transparent to-forest-deep/30" />
      </div>

      <div className="page-container relative flex w-full flex-1 flex-col justify-end pb-10 pt-32 sm:pb-14 sm:pt-36 lg:pb-16">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <div className="max-w-xl">
            <p className="animate-rise inline-flex items-center rounded-md border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-semibold tracking-[0.04em] text-white/95 backdrop-blur-sm">
              FarmIT AI · Farming for Zimbabwe
            </p>
            <h1 className="animate-rise-delay mt-4 text-[clamp(1.5rem,3.8vw,2.35rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
              Crop advice on your WhatsApp.
            </h1>
            <p className="animate-rise-delay-2 mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-[15px]">
              Diagnose maize diseases from a leaf photo and get clear treatment
              steps. Join the waiting list on this website — not WhatsApp.
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

          <aside className="animate-rise-delay-3 w-full max-w-sm justify-self-start rounded-xl border border-white/15 bg-black/35 p-5 backdrop-blur-md sm:p-6 lg:justify-self-end">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lime">
              Our Mission
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Give Zimbabwean farmers fast, local crop advice on the phone they
              already use — so disease doesn’t wait for an extension visit.
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
