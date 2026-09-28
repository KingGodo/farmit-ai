"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import logo from "@/assets/farmit-logo.png";
import { site } from "@/lib/site";

const NAV_ITEMS = [
  { label: "Home", href: "top" },
  { label: "About", href: "about" },
  { label: "How it works", href: "how-it-works" },
  { label: "Impact", href: "impact" },
  { label: "Stories", href: "testimonials" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = NAV_ITEMS.map((item) => item.href).filter(
      (href) => href !== "top"
    );

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (y < 120) {
        setActive("top");
        return;
      }

      let current = "top";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) {
          current = id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const go = (id: string) => {
    if (!isHome) return;
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActive("top");
      setOpen(false);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActive(id);
    setOpen(false);
  };

  const solid = scrolled || open || !isHome;

  const linkClass = (href: string) => {
    const isActive = isHome && active === href;
    return `rounded-md px-3 py-1.5 text-[13px] font-medium transition-[color,background-color] duration-150 ease-[var(--ease-craft)] ${
      isActive
        ? "bg-lime text-ink"
        : solid
          ? "text-ink/70 hover:bg-soft hover:text-ink"
          : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;
  };

  const mobileLinkClass = (href: string) => {
    const isActive = isHome && active === href;
    return `rounded-md px-3 py-2.5 text-left text-sm font-medium transition-[color,background-color] duration-150 ease-[var(--ease-craft)] ${
      isActive
        ? "bg-lime text-ink"
        : solid
          ? "text-ink/80 hover:bg-soft"
          : "text-white/85 hover:bg-white/10"
    }`;
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full pt-3 transition-[background-color,border-color,color,backdrop-filter] duration-200 ease-[var(--ease-craft)] sm:pt-4 ${
        solid
          ? "border-b border-border bg-background/90 text-ink backdrop-blur-xl"
          : "border-b border-transparent bg-transparent text-white"
      }`}
    >
      <div className="page-container relative flex h-12 items-center justify-between sm:h-14">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="relative z-10 flex items-center gap-1"
        >
          <Image
            src={logo}
            alt={site.name}
            width={34}
            height={34}
            unoptimized
            style={{ width: 34, height: 34 }}
            className="object-contain"
            priority
          />
          <span className="text-[15px] font-bold tracking-tight">{site.name}</span>
        </Link>

        <div
          className={`absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 lg:flex ${
            solid
              ? ""
              : "rounded-lg border border-white/15 bg-black/35 px-1.5 py-1 backdrop-blur-md"
          }`}
        >
          {NAV_ITEMS.map((item) =>
            isHome ? (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                aria-current={active === item.href ? "page" : undefined}
                className={linkClass(item.href)}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href === "top" ? "/" : `/#${item.href}`}
                className={linkClass(item.href)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="relative z-10 hidden items-center gap-3 md:flex">
          <Link
            href={site.waitlistPath}
            className="inline-flex h-9 items-center rounded-lg bg-lime px-4 text-[13px] font-semibold text-ink transition-[background-color] duration-150 ease-[var(--ease-craft)] hover:bg-lime-dark"
          >
            Join the waiting list
          </Link>
        </div>

        <button
          type="button"
          className="relative z-10 rounded-md p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-6 pb-5 sm:px-8 md:hidden">
          <div className="flex flex-col gap-0.5 pt-2">
            {NAV_ITEMS.map((item) =>
              isHome ? (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => go(item.href)}
                  aria-current={active === item.href ? "page" : undefined}
                  className={mobileLinkClass(item.href)}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href === "top" ? "/" : `/#${item.href}`}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass(item.href)}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href={site.waitlistPath}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-lime text-sm font-semibold text-ink"
            >
              Join the waiting list
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
