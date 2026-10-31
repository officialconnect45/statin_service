"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { buttonClass } from "@/components/ui/button-link";
import { ArrowIcon } from "@/components/ui/icons";
import { SocialLinks } from "@/components/ui/social-links";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

const primary = [
  { href: "/services", label: "Solutions" },
  { href: "/work", label: "Work" },
  { href: "/approach", label: "Approach" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const toggle = document.querySelector<HTMLButtonElement>('[aria-controls="mobile-nav"]');
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        toggle?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    firstLink.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-nav"
      inert={!open}
      className={`fixed inset-0 z-50 overflow-y-auto bg-night transition-[opacity,visibility] duration-500 lg:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div aria-hidden="true" className="aurora">
        <span
          className="orb -top-24 -left-24 h-80 w-80 bg-indigo-500"
          style={{ "--o": 0.45, "--dx": "60px", "--dy": "40px" } as CSSProperties}
        />
        <span
          className="orb -right-24 bottom-0 h-96 w-96 bg-fuchsia-500"
          style={{ "--o": 0.3, "--dx": "-50px", "--dy": "-60px", "--delay": "-5s" } as CSSProperties}
        />
        <div className="bg-grid mask-radial absolute inset-0" />
      </div>
      <nav
        aria-label="Mobile"
        className="relative flex min-h-full flex-col px-5 pt-24 pb-10 sm:px-8"
      >
        <ul>
          {primary.map((item, index) => (
            <li
              key={item.href}
              className={`border-b border-night-line transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + index * 55}ms` : "0ms" } as CSSProperties}
            >
              <Link
                ref={index === 0 ? firstLink : undefined}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between py-4 font-[family-name:var(--font-display)] text-[2.2rem] leading-none font-semibold tracking-[-0.04em] text-white"
              >
                {item.label}
                <ArrowIcon className="h-5 w-5 text-signal" />
              </Link>
            </li>
          ))}
        </ul>

        <div
          className={`mt-10 transition-opacity delay-300 duration-700 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="t-eyebrow text-fog">Solutions</p>
          <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  onClick={onClose}
                  className="flex gap-3 py-2.5 text-[15px] text-white/85"
                >
                  <span className="t-eyebrow pt-1 text-signal">{service.index}</span>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-12 text-white">
          <Link href="/contact" onClick={onClose} className={buttonClass("solid", "w-full")}>
            Let&apos;s talk
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
          <div className="mt-8 flex items-center justify-between gap-4">
            <a href={`mailto:${site.email}`} className="text-sm text-fog">
              {site.email}
            </a>
            <SocialLinks />
          </div>
        </div>
      </nav>
    </div>
  );
}
