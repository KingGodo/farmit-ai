import { ArrowRight } from "lucide-react";
import Link from "next/link";
import WhatsAppPreview from "@/components/landing/WhatsAppPreview";
import { site } from "@/lib/site";

const steps = [
  {
    step: "01",
    title: "Join on this website",
    description:
      "Share your name, phone, email, district, and main crop. The waiting list is not on WhatsApp.",
  },
  {
    step: "02",
    title: "We contact you",
    description:
      "When your district opens, we reach you by phone or email — not through a WhatsApp signup chat.",
  },
  {
    step: "03",
    title: "Crop advice on WhatsApp",
    description:
      "Later, send a leaf photo in WhatsApp and get a clear diagnosis with chemical or organic next steps.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-forest py-20 text-white sm:py-24">
      <div className="page-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime">
            How it works
          </p>
          <h2 className="section-heading mt-3">
            Help that feels like a normal chat.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65">
            FarmIT crop advice will live in WhatsApp. The waiting list itself
            is only on this website. Join here, then we contact you.
          </p>

          <ol className="mt-10 space-y-0 border-t border-white/10">
            {steps.map((item) => (
              <li
                key={item.step}
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-5"
              >
                <span className="font-mono text-sm font-medium tabular-nums text-lime">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href={site.waitlistPath}
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-lime px-5 text-sm font-semibold text-ink transition-[background-color,transform] duration-200 ease-[var(--ease-craft)] hover:bg-lime-dark active:scale-[0.98]"
          >
            Join the waiting list
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex justify-center lg:justify-end">
          <WhatsAppPreview />
        </div>
      </div>
    </section>
  );
}
