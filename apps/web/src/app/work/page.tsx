import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Specimen } from "@/components/specimens";
import { patterns } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The three builds Statin makes with startup founders: a company site, a first SaaS, and a store that can take the order.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="The three builds founders ask for."
        lede="These are patterns, not borrowed logos. Each one is scoped, designed, and engineered as a system the founder can run after the weekly call ends."
      />
      {patterns.map((pattern) => (
        <section key={pattern.index} className="border-b border-line">
          <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
                {pattern.index} / {pattern.eyebrow}
              </p>
              <h2 className="mt-4 font-serif text-4xl tracking-tight text-balance md:text-5xl">
                {pattern.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-soft">
                {pattern.situation}
              </p>
              <p className="mt-6 font-mono text-[11px] tracking-[0.16em] text-mist uppercase">
                Shape · {pattern.shape}
              </p>
              <div className="mt-8">
                <Specimen variant={pattern.specimen} />
              </div>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:grid-cols-1">
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-brass uppercase">
                  What we make
                </p>
                <ul className="mt-4 space-y-4">
                  {pattern.build.map((item) => (
                    <li key={item} className="border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-brass uppercase">
                  What you leave with
                </p>
                <ul className="mt-4 space-y-4">
                  {pattern.receives.map((item) => (
                    <li key={item} className="border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>
      ))}
      <section>
        <Container className="flex flex-col items-start gap-6 py-16 md:flex-row md:items-end md:justify-between md:py-24">
          <h2 className="max-w-xl font-serif text-4xl tracking-tight text-balance">
            If your company is one of these shapes, start with the brief.
          </h2>
          <ButtonLink href="/contact">Start a project</ButtonLink>
        </Container>
      </section>
    </>
  );
}
