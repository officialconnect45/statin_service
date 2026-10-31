import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Eyebrow, SplitText } from "@/components/ui/typography";
import { PatternCard } from "@/components/work/pattern-card";
import { Specimen } from "@/components/work/specimens";
import { patterns } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { getService, services } from "@/lib/services";

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
  if (!service) return { title: "Solution" };
  return pageMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const pattern = patterns.find((item) => item.service === service.slug);

  return (
    <>
      <header className="relative overflow-hidden">
        <div aria-hidden="true" className="aurora">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f3f1ff_70%,#f6f6ff_100%)]" />
          <span
            className="orb -top-40 -left-24 h-[440px] w-[440px] bg-indigo-400"
            style={{ "--o": 0.3, "--dx": "70px", "--dy": "50px", "--dur": "18s" } as CSSProperties}
          />
          <span
            className="orb top-[20%] right-[-6%] h-[420px] w-[420px] bg-violet-400"
            style={{ "--o": 0.3, "--dx": "-60px", "--dy": "40px", "--dur": "15s", "--delay": "-5s" } as CSSProperties}
          />
          <div className="bg-grid bg-grid-light mask-radial absolute inset-0" />
        </div>
        <Container className="relative grid gap-12 pt-40 pb-20 md:pt-48 md:pb-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="fade-load">
              <ol className="t-eyebrow inline-flex items-center gap-2 rounded-full border border-cobalt/15 bg-white/70 px-3.5 py-1.5 text-mist shadow-[0_8px_24px_-12px_rgb(91_70_240/0.45)] backdrop-blur">
                <li>
                  <Link href="/services" className="hover:text-ink">
                    Solutions
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-cobalt">
                  {service.index} {service.short}
                </li>
              </ol>
            </nav>
            <SplitText
              as="h1"
              load
              text={service.title}
              accentFrom={Math.max(0, service.title.split(" ").length - 1)}
              className="t-h1 mt-7 max-w-[14ch] text-balance text-ink"
            />
            <p className="fade-load t-lede mt-8 max-w-2xl text-ink-soft" style={{ "--d": 350 } as CSSProperties}>
              {service.lede}
            </p>
            <div className="fade-load mt-10" style={{ "--d": 500 } as CSSProperties}>
              <ButtonLink href="/contact">Start with this practice</ButtonLink>
            </div>
          </div>
          <div className="fade-load self-end lg:col-span-5" style={{ "--d": 400 } as CSSProperties}>
            <div className="float-y drop-shadow-[0_40px_60px_rgb(79_70_229/0.35)]" style={{ "--dur": "7s" } as CSSProperties}>
              <Specimen variant={service.specimen} />
            </div>
          </div>
        </Container>
      </header>

      <nav aria-label="Solutions" className="border-b border-line bg-white">
        <Container>
          <ul className="flex gap-6 overflow-x-auto py-4 text-sm whitespace-nowrap">
            {services.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/services/${item.slug}`}
                  aria-current={item.slug === service.slug ? "page" : undefined}
                  className={item.slug === service.slug ? "font-medium text-cobalt" : "text-mist hover:text-ink"}
                >
                  {item.short}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <section aria-label="Scope" className="bg-paper">
        <Container className="grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-4" data-reveal>
            <Eyebrow>Who it is for</Eyebrow>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">{service.audience}</p>
            <Eyebrow className="mt-10 text-cobalt">How it is scoped</Eyebrow>
            <p className="mt-5 text-base leading-relaxed text-ink">{service.scoping}</p>
          </div>
          <div className="md:col-span-7 md:col-start-6" data-reveal style={{ "--d": 120 } as CSSProperties}>
            <Eyebrow>Included</Eyebrow>
            <ul className="mt-5 border-t border-line">
              {service.includes.map((item, index) => (
                <li key={item} className="flex gap-5 border-b border-line py-5 text-base text-ink-soft">
                  <span className="font-mono text-xs text-cobalt">{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section aria-label="Phases" className="tone-dark bg-night text-white">
        <Container className="grid gap-px py-20 md:grid-cols-3 md:py-24">
          {service.phases.map((phase, index) => (
            <article
              key={phase.name}
              data-reveal
              style={{ "--d": index * 100 } as CSSProperties}
              className="border-t border-night-line pt-6 md:pr-10"
            >
              <p className="font-mono text-xs text-signal">0{index + 1}</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight">{phase.name}</h2>
              <p className="mt-3 text-base leading-relaxed text-fog">{phase.detail}</p>
            </article>
          ))}
        </Container>
      </section>

      {pattern ? (
        <section aria-label="Build pattern" className="bg-white py-20 md:py-28">
          <Container>
            <PatternCard pattern={pattern} headingLevel="h2" />
          </Container>
        </section>
      ) : null}

      <section className="bg-paper-deep">
        <Container className="grid gap-10 py-20 md:grid-cols-12 md:items-end md:py-24">
          <div className="md:col-span-8">
            <Eyebrow>After launch</Eyebrow>
            <p className="mt-5 text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
              {service.outcome}
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-mist">
              Typical stack: {service.stack.join(" · ")}. The tools follow the problem. We do not
              force a platform that makes the company harder to run.
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <ButtonLink href="/contact">Talk to Statin</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
