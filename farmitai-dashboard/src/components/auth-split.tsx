import Image from "next/image";
import type { ReactNode } from "react";

import fieldImage from "@/assets/farmit-hero-field.png";
import logo from "@/assets/farmit-logo.png";

export function AuthSplit({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#0e241c] lg:flex lg:flex-col">
        <Image
          src={fieldImage}
          alt="Farmer working in a green field at golden hour"
          fill
          priority
          className="object-cover object-[58%_18%]"
          sizes="50vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e241c]/92 via-[#0e241c]/55 to-[#0e241c]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e241c]/70 via-[#0e241c]/25 to-transparent" />
        <div className="relative z-10 flex h-12 items-center gap-2.5 px-8">
          <Image src={logo} alt="FarmIT" className="size-6 rounded-[5px]" />
          <p className="text-[13px] font-semibold tracking-[-0.03em] text-white">FarmIT</p>
        </div>
        <div className="relative z-10 mt-auto max-w-sm px-10 pb-10">
          <p className="text-[13px] text-white/70">Operations</p>
          <h1 className="mt-3 text-[1.75rem] font-semibold leading-snug tracking-[-0.03em] text-white">
            Review who gets in first.
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-white/80">
            Approve farmers and agronomists on the waiting list. One account, one API.
          </p>
        </div>
      </aside>

      <section className="flex items-center justify-center bg-background px-5 py-12 sm:px-8">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Image src={logo} alt="FarmIT" className="size-6 rounded-[5px]" />
            <p className="text-[13px] font-semibold tracking-[-0.03em]">FarmIT</p>
          </div>
          <p className="text-[13px] text-faint">{eyebrow ?? "Admin"}</p>
          <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.03em]">{title}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}
