import Link from "next/link";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { nav, services, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <Container className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist">
            A product studio for startup founders. Websites, SaaS, and
            ecommerce, designed and engineered as one engagement.
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="font-mono text-[11px] tracking-[0.18em] text-brass uppercase font-semibold">
            Visit
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft hover:text-[#244df5] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="text-ink-soft hover:text-[#244df5] transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-[11px] tracking-[0.18em] text-brass uppercase font-semibold">
            Practices
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-ink-soft hover:text-[#244df5] transition-colors"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="font-mono text-[11px] tracking-[0.18em] text-brass uppercase font-semibold">
            Studio
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-ink-soft hover:text-[#244df5] transition-colors"
              >
                {site.email}
              </a>
            </li>
            <li className="text-mist">Remote engagements</li>
            <li>
              <Link href="/privacy" className="text-ink-soft hover:text-[#244df5] transition-colors">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-xs tracking-wide text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.name}. All rights reserved.
          </p>
          <p>Engagements begin with a written proposal.</p>
        </Container>
      </div>
    </footer>
  );
}
