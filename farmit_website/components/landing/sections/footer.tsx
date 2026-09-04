import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/farmit-logo.png";
import { site } from "@/lib/site";

const productLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Waiting list", href: "/waitlist" },
];

const companyLinks = [
  { label: "About", href: "/#about" },
  { label: "Impact", href: "/#impact" },
  { label: "Stories", href: "/#testimonials" },
];

const legalLinks = [
  { label: "Privacy Policy", href: site.privacyPath },
  { label: "Terms of Use", href: site.termsPath },
];

const socialIcons: Record<(typeof site.socials)[number]["name"], ReactNode> = {
  Facebook: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 1.8H8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8a3.2 3.2 0 0 0 3.2-3.2V8A3.2 3.2 0 0 0 16 4.8ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm4.55-2.85a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95Z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M6.5 9H3.7v11.2h2.8V9ZM5.1 3.8A1.65 1.65 0 1 0 5.12 7.1 1.65 1.65 0 0 0 5.1 3.8ZM20.3 13.05c0-3.3-1.76-4.84-4.11-4.84a3.54 3.54 0 0 0-3.18 1.6h-.08V9H10.2v11.2h2.8v-6.04c0-1.59.3-3.13 2.27-3.13 1.94 0 1.97 1.81 1.97 3.23v5.94h2.8v-6.31Z" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M18.24 3H21l-6.5 7.43L22 21h-6.17l-4.81-6.29L5.3 21H2.52l6.96-7.95L2 3h6.32l4.35 5.75L18.24 3Zm-2.16 16.2h1.7L7.98 4.7H6.15l9.93 14.5Z" />
    </svg>
  ),
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {title}
      </h4>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 transition-colors duration-150 ease-[var(--ease-craft)] hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({
  showWaitlistCta = true,
}: {
  showWaitlistCta?: boolean;
}) {
  return (
    <footer className="bg-forest-deep text-white">
      <div className="page-container pt-16 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src={logo}
                alt={site.name}
                width={34}
                height={34}
                unoptimized
                style={{ width: 34, height: 34 }}
                className="object-contain"
              />
              <span className="text-lg font-bold tracking-tight">{site.name}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
              AI crop advice for Zimbabwean farmers. Join the waiting list on
              this website. Treatment guidance on WhatsApp comes later.
            </p>
            {showWaitlistCta && (
              <Link
                href={site.waitlistPath}
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-lime px-4 text-sm font-semibold text-ink transition-[background-color] duration-150 ease-[var(--ease-craft)] hover:bg-lime-dark"
              >
                Join the waiting list
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <ul className="mt-8 flex items-center gap-2">
              {site.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 text-white/70 transition-[background-color,color,border-color] duration-150 ease-[var(--ease-craft)] hover:border-lime hover:bg-lime hover:text-ink"
                  >
                    {socialIcons[social.name]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <FooterColumn title="Product" links={productLinks} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Company" links={companyLinks} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} FarmIT AI. All rights reserved.
          </p>
          <p className="text-xs font-medium text-white/40">Zimbabwe</p>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <p
          aria-hidden
          className="w-full select-none whitespace-nowrap text-center font-extrabold leading-[0.8] tracking-[-0.07em] text-lime"
          style={{ fontSize: "calc(100vw / 6.15)" }}
        >
          FarmIT AI
        </p>
      </div>
    </footer>
  );
}
