import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import farmerImg from "@/assets/farmit-bento-farmer.png";
import cropImg from "@/assets/farmit-bento-crop.png";

export default function Features() {
  return (
    <section id="about" className="bg-background py-20 sm:py-24">
      <div className="page-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
              About
            </p>
            <h2 className="section-heading mt-3 text-ink">
              Farming help that meets farmers where they already are.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            FarmIt AI is an agritech platform for Zimbabwean farmers. Send a
            leaf photo on WhatsApp and get practical chemical and organic
            treatment advice — so disease doesn’t wait for an extension visit.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={farmerImg}
              alt="Farmer walking through maize"
              fill
              className="object-cover transition duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>

          <div className="flex aspect-square flex-col justify-between rounded-2xl bg-soft p-6">
            <div className="flex justify-end">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                24/7
              </p>
              <p className="mt-3 text-sm font-bold text-ink">
                WhatsApp crop assistance
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Ask a question or send a leaf photo any time — FarmIt AI replies in
                chat.
              </p>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={cropImg}
              alt="Healthy maize leaves"
              fill
              className="object-cover transition duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>

          <div className="flex aspect-square flex-col justify-between rounded-2xl bg-lime p-6">
            <div className="flex justify-end">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                AI
              </p>
              <p className="mt-3 text-sm font-bold text-ink">
                Maize disease detection
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Image analysis with chemical and organic treatment options for
                local farms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
