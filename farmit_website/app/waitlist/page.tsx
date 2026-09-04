import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/landing/sections/nav";
import Footer from "@/components/landing/sections/footer";
import WaitlistForm from "@/components/landing/WaitlistForm";
import fieldImage from "@/assets/hero-farmer-whatsapp.png";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Join the waiting list — ${site.name}`,
  description:
    "Join the FarmIT waiting list on this website. Share your details and we will contact you.",
};

const points = [
  { step: "01", text: "Join the waiting list on this website" },
  { step: "02", text: "We reach you by phone or email" },
  { step: "03", text: "Crop advice comes later, on WhatsApp" },
];

export default function WaitlistPage() {
  return (
    <div className="min-h-dvh bg-white text-ink">
      <Navbar />
      <main className="lg:grid lg:grid-cols-2">
        <aside className="relative flex min-h-[18.5rem] flex-col justify-end overflow-hidden sm:min-h-[22rem] lg:sticky lg:top-0 lg:h-dvh lg:min-h-0">
          <Image
            src={fieldImage}
            alt="Farmer checking a phone in a maize field"
            fill
            priority
            className="object-cover object-[62%_center] lg:object-[68%_center]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/45 to-forest-deep/30 lg:bg-gradient-to-r lg:from-forest-deep/90 lg:via-forest-deep/50 lg:to-forest-deep/20" />

          <div className="relative z-10 px-5 pb-5 pt-20 text-white sm:px-8 sm:pb-6 sm:pt-24 lg:flex lg:h-full lg:flex-col lg:justify-end lg:px-10 lg:pb-10 lg:pt-28 xl:px-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime">
              FarmIT AI
            </p>
            <p className="mt-3 max-w-sm text-lg font-semibold leading-snug tracking-[-0.03em] sm:text-xl lg:mt-4 lg:text-2xl">
              Hold a place for your district on this website.
            </p>
            <ul className="mt-5 max-w-sm border-t border-white/15 sm:mt-7 lg:mt-10">
              {points.map((item) => (
                <li
                  key={item.step}
                  className="grid grid-cols-[2.25rem_1fr] items-baseline gap-2 border-b border-white/15 py-2.5 sm:grid-cols-[2.5rem_1fr] sm:gap-3 sm:py-3.5"
                >
                  <span className="font-mono text-[11px] tabular-nums text-lime sm:text-[12px]">
                    {item.step}
                  </span>
                  <span className="text-[13px] text-white/80 sm:text-sm">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="flex items-start justify-center px-5 py-8 sm:px-8 sm:py-12 lg:min-h-dvh lg:items-center lg:px-10 lg:py-24 xl:px-12">
          <div className="w-full max-w-[440px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              Waiting list
            </p>
            <h1 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.03em] text-ink sm:mt-4 sm:text-[1.75rem] lg:text-[2rem]">
              Request access
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              FarmIT serves farmers in Zimbabwe. The waiting list is only on
              this website — not WhatsApp. Leave your district and crop. We’ll
              contact you by phone or email.
            </p>

            <div className="mt-8 sm:mt-10">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>
      <Footer showWaitlistCta={false} />
    </div>
  );
}
