import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Specimen } from "@/components/specimens";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website systems, SaaS development, and ecommerce for startup founders. Design and engineering in one engagement.",
};

const specimens = {
  websites: "site",
  saas: "saas",
  ecommerce: "commerce",
} as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we build with founders."
        lede="Three practices. Each one is a system the company can run after the launch week, not a file that waits for the next contractor."
      />
      {services.map((service, index) => (
        <section
          key={service.slug}
          className={index % 2 === 1 ? "border-b border-line bg-paper-deep" : "border-b border-line"}
        >
          <Container className="grid items-center gap-10 py-16 md:py-24 lg:grid-cols-12">
            <div className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
              <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
                {service.index} / {service.short}
              </p>
              <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
                {service.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-soft">
                {service.lede}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-mist">{service.timeline}</p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-6 inline-flex text-sm font-medium tracking-wide underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                Read the practice
              </Link>
            </div>
            <div className="lg:col-span-6">
              <Specimen variant={specimens[service.slug as keyof typeof specimens]} />
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
