import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { ArrowIcon, ArrowUpRightIcon, SocialIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { services } from "@/lib/services";
import { footerNav, site, social } from "@/lib/site";

export function Footer() {
  return (
    <footer className="tone-dark relative overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="aurora">
        <span
          className="orb -top-48 left-[10%] h-96 w-[520px] bg-indigo-600"
          style={{ "--o": 0.35, "--dx": "80px", "--dy": "30px", "--dur": "20s" } as CSSProperties}
        />
        <span
          className="orb -top-40 right-[5%] h-80 w-[420px] bg-fuchsia-600"
          style={{ "--o": 0.22, "--dx": "-60px", "--dy": "40px", "--dur": "17s", "--delay": "-6s" } as CSSProperties}
        />
      </div>
      {/* Content area; the giant wordmark sits behind it, above the copyright bar */}
      <div className="relative">
        <p
          aria-hidden="true"
          className="footer-wordmark pointer-events-none absolute inset-x-0 bottom-[-0.08em] text-center font-[family-name:var(--font-display)] text-[clamp(5.5rem,27vw,26rem)] leading-[0.8] font-extrabold tracking-[-0.06em] select-none"
        >
          STATIN
        </p>
        <Container className="relative z-10 pb-[clamp(5.5rem,14vw,14rem)]">
          <div className="flex flex-col gap-6 border-b border-night-line py-14 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl font-[family-name:var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-balance">
              Have a problem worth solving? <span className="text-fog">Tell us what has to be true on launch day.</span>
            </p>
            <Link href="/contact" className="group inline-flex items-center gap-3 text-base text-white">
              <span className="link-line">Talk to Statin</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cobalt transition-transform duration-300 group-hover:translate-x-1">
                <ArrowIcon className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="grid gap-12 py-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <Logo />
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-fog">{site.short}</p>
              <a href={`mailto:${site.email}`} className="mt-6 inline-block text-sm text-white link-line">
                {site.email}
              </a>
              <address className="mt-2 text-sm not-italic text-fog">
                {site.address.street}, {site.address.city}, {site.address.country}
              </address>
              <p className="mt-2 text-sm text-fog">Remote engagements</p>
              <a
                href="https://www.hostinger.com"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Open"
                aria-label="Statin is an official Hostinger Partner (opens in a new tab)"
                className="mt-8 inline-block opacity-90 transition-opacity hover:opacity-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/hostinger-partner-badge.svg"
                  alt="Official Hostinger Partner"
                  width={160}
                  height={60}
                  className="h-[60px] w-[160px]"
                />
              </a>
            </div>

            <FooterColumn title="Solutions" className="md:col-span-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="text-white/80 transition-colors hover:text-white">
                    {service.title}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Company" className="md:col-span-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/80 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Follow" className="md:col-span-3">
              {social.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="Open"
                    aria-label={`Statin on ${item.label} (opens in a new tab)`}
                    className="group inline-flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                  >
                    <SocialIcon id={item.id} className="h-4 w-4" />
                    <span>{item.label}</span>
                    <span className="text-fog">{item.handle}</span>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </FooterColumn>
          </div>
        </Container>
      </div>

      <div className="relative z-10 border-t border-night-line bg-night/80 backdrop-blur">
        <Container className="flex flex-col gap-3 py-6 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.year} Statin. All rights reserved.</p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/privacy#cookies" className="hover:text-white">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className, children }: { title: string; className: string; children: ReactNode }) {
  return (
    <div className={className}>
      <p className="t-eyebrow text-fog">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
