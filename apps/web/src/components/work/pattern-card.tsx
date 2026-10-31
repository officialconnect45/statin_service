import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import { Specimen } from "@/components/work/specimens";
import type { Pattern } from "@/lib/content";

/**
 * Editorial card for a build pattern. `detailed` adds the full situation,
 * deliverables, and handover used on the Work page.
 */
export function PatternCard({
  pattern,
  flip = false,
  detailed = false,
  headingLevel = "h3",
}: {
  pattern: Pattern;
  flip?: boolean;
  detailed?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const href = detailed ? `/services/${pattern.service}` : `/work#${pattern.slug}`;

  return (
    <article
      id={detailed ? pattern.slug : undefined}
      className="group grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:items-center lg:gap-14"
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        data-cursor="View"
        data-reveal
        className={`relative block overflow-hidden rounded-3xl bg-night lg:col-span-7 ${
          flip ? "lg:order-2" : ""
        }`}
      >
        <div
          aria-hidden="true"
          className="bg-grid absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(91_70_240/0.35),transparent_55%)] opacity-60 transition-opacity duration-700 group-hover:opacity-100"
        />
        <p
          aria-hidden="true"
          className="absolute -bottom-6 right-4 text-[9rem] leading-none font-semibold tracking-[-0.06em] text-transparent sm:text-[12rem]"
          style={{ WebkitTextStroke: "1px rgb(255 255 255 / 0.1)" }}
        >
          {pattern.index}
        </p>
        <div className="relative px-6 py-10 sm:px-12 sm:py-14 lg:px-14 lg:py-16">
          <div className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.015]">
            <Specimen variant={pattern.specimen} className="mx-auto max-w-[520px]" />
          </div>
        </div>
      </Link>

      <div
        data-reveal
        style={{ "--d": 120 } as CSSProperties}
        className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}
      >
        <p className="t-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-cobalt">
          <span>Pattern {pattern.index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
          <span>{pattern.eyebrow}</span>
        </p>
        <Heading className="mt-5 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance">
          <Link href={href} className="link-line">
            {pattern.title}
          </Link>
        </Heading>
        <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-mist uppercase">
          Fits · {pattern.fit}
        </p>

        <dl className="mt-7 space-y-5 border-t border-line pt-6 text-sm leading-relaxed">
          <div>
            <dt className="font-medium text-ink">Challenge</dt>
            <dd className="mt-1.5 text-ink-soft">{pattern.situation}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">What we build</dt>
            <dd className="mt-1.5">
              <ul className="space-y-1.5 text-ink-soft">
                {(detailed ? pattern.build : pattern.build.slice(0, 2)).map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1 w-3 shrink-0 bg-cobalt" />
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          {detailed ? (
            <div>
              <dt className="font-medium text-ink">What you receive</dt>
              <dd className="mt-1.5">
                <ul className="space-y-1.5 text-ink-soft">
                  {pattern.receives.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-1 w-3 shrink-0 bg-ink/30" />
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Typical technologies">
          {pattern.stack.map((item) => (
            <li key={item} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-soft">
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={href}
          className="group/cta mt-8 inline-flex items-center gap-3 text-sm font-medium text-ink"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-[background-color,translate] duration-300 group-hover/cta:translate-x-1 group-hover/cta:bg-cobalt">
            <ArrowIcon className="h-4 w-4" />
          </span>
          {detailed ? "Explore the solution" : "Read the full pattern"}
          <span className="sr-only">: {pattern.title}</span>
        </Link>
      </div>
    </article>
  );
}
