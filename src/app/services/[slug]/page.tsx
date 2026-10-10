import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { getService, services } from "@/lib/site";

export const instant = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <header className="border-b border-line">
        <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              {service.index} / Practice
            </p>
            <ul className="mt-8 hidden space-y-3 lg:block">
              {services.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/services/${item.slug}`}
                    className={`text-sm ${
                      item.slug === service.slug
                        ? "text-ink"
                        : "text-mist hover:text-ink"
                    }`}
                    aria-current={item.slug === service.slug ? "page" : undefined}
                  >
                    {item.short}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <h1 className="font-serif text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.95] tracking-[-0.03em] text-balance">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {service.lede}
            </p>
          </div>
        </Container>
      </header>

      <section className="border-b border-line">
        <Container className="grid gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              Who it is for
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{service.audience}</p>
            <p className="mt-6 text-sm leading-relaxed text-ink">{service.timeline}</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              Included
            </p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {service.includes.map((item) => (
                <li key={item} className="py-4 text-sm leading-relaxed text-ink-soft">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-forest text-paper">
        <Container className="grid gap-8 py-16 md:grid-cols-3 md:py-20">
          {service.phases.map((phase, index) => (
            <article key={phase.name}>
              <p className="font-mono text-[11px] tracking-[0.18em] text-brass-line uppercase">
                0{index + 1}
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight">{phase.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-paper/75">{phase.detail}</p>
            </article>
          ))}
        </Container>
      </section>

      <section>
        <Container className="grid gap-10 py-16 md:grid-cols-12 md:items-end md:py-24">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              After launch
            </p>
            <p className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-balance">
              {service.outcome}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-mist">
              Typical stack: {service.stack.join(" · ")}. The tools follow the
              product. We do not force a platform that makes the company harder
              to run.
            </p>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <ButtonLink href="/contact">Start with this practice</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
