import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ctaImage from "@/assets/hero-farmer-whatsapp.png";
import { site } from "@/lib/site";

export default function CTA() {
  return (
    <section className="bg-background px-6 py-12 sm:px-8 sm:py-14 lg:px-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl">
        <Image
          src={ctaImage}
          alt="Farmer checking a phone in a maize field"
          fill
          className="object-cover object-[62%_center] sm:object-[70%_center]"
          sizes="(max-width: 1152px) 100vw, 1152px"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/92 via-forest-deep/58 to-forest-deep/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/55 via-transparent to-forest-deep/25" />

        <div className="relative flex min-h-[280px] flex-col justify-end gap-8 p-6 text-white sm:min-h-[320px] sm:p-8 lg:min-h-[360px] lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:p-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime">
              Waiting list
            </p>
            <h2 className="section-heading mt-3">
              Join the waiting list on this website.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
              Share your name, phone, email, district, and crop here — not on
              WhatsApp. We’ll contact you to complete registration.
            </p>
          </div>

          <Link
            href={site.waitlistPath}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-lime px-5 text-[13px] font-semibold text-ink transition-[background-color,transform] duration-200 ease-[var(--ease-craft)] hover:bg-lime-dark active:scale-[0.98]"
          >
            Join the waiting list
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
