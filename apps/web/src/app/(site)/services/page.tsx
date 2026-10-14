import Link from "next/link";
import type { CSSProperties } from "react";
import { ClosingCta } from "@/components/home/closing-cta";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { Specimen } from "@/components/work/specimens";
import { pageMetadata } from "@/lib/metadata";
import { services } from "@/lib/services";

export const metadata = pageMetadata({
  title: "Solutions",
  description:
    "Web apps and SaaS platforms, commerce systems, backend, data, and AI integrations, business websites, and white-label agency delivery, designed and engineered by Statin.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="What we build, and how it holds up."
        lede="Six practices, one engineering standard. Each is a system the team can run after launch week, with security, performance, and measurement designed in."
      />
      {services.map((service, index) => (
        <section
          key={service.slug}
          aria-labelledby={`${service.slug}-title`}
          className={index % 2 === 1 ? "bg-white" : "bg-paper"}
        >
          <Container className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
            <div className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : ""}`} data-reveal>
              <p className="t-eyebrow text-cobalt">
                {service.index} / {service.short}
              </p>
              <h2
                id={`${service.slug}-title`}
                className="t-h2 mt-5 max-w-[14ch] text-balance"
              >
                {service.title}
              </h2>
              <p className="t-lede mt-6 text-ink-soft">{service.lede}</p>
              <p className="mt-5 text-sm leading-relaxed text-mist">{service.scoping}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.stack.map((item) => (
                  <li key={item} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${service.slug}`}
                data-cursor="Explore"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-medium"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-[background-color,translate] duration-300 group-hover:translate-x-1 group-hover:bg-cobalt">
                  <ArrowIcon className="h-4 w-4" />
                </span>
                Read the practice<span className="sr-only">: {service.title}</span>
              </Link>
            </div>
            <div
              data-reveal
              style={{ "--d": 150 } as CSSProperties}
              className={`relative overflow-hidden rounded-3xl bg-night p-6 sm:p-12 lg:col-span-6 ${
                index % 2 === 1 ? "lg:order-1" : ""
              }`}
            >
              <div aria-hidden="true" className="bg-grid absolute inset-0" />
              <Specimen variant={service.specimen} className="relative" />
            </div>
          </Container>
        </section>
      ))}
      <ClosingCta />
    </>
  );
}
