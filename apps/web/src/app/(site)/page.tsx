import { Suspense, type CSSProperties } from "react";
import Link from "next/link";
import { Capabilities } from "@/components/home/capabilities";
import { ClosingCta } from "@/components/home/closing-cta";
import { Credibility } from "@/components/home/credibility";
import { Hero } from "@/components/home/hero";
import { ProblemStory } from "@/components/home/problem-story";
import { Process } from "@/components/home/process";
import { StartupStory } from "@/components/home/startup-story";
import { Testimonials } from "@/components/home/testimonials";
import { WhyStatin } from "@/components/home/why-statin";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/typography";
import { patterns } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({ description: site.description, path: "/" });

export default function Home() {
  return (
    <>
      {/* 1. Hero: who we are and what we build */}
      <Hero />

      {/* 2. The problem we solve, in four steps */}
      <ProblemStory />

      {/* 3. Services */}
      <section id="capabilities" aria-labelledby="capabilities-title" className="bg-paper py-24 md:py-32">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading
              id="capabilities-title"
              eyebrow="What we build"
              title="Six ways we put systems to work."
              className="lg:col-span-7"
            />
            <p data-reveal className="t-lede text-ink-soft lg:col-span-5">
              Each one is scoped, designed, and engineered as a system the team can run after launch, not a file waiting
              for the next contractor.
            </p>
          </div>
          <div className="mt-16">
            <Capabilities />
          </div>
        </Container>
      </section>

      {/* 4. Who we work with, and the technology we use */}
      <Credibility />

      {/* 5. Work: short previews; the full detail lives on /work */}
      <section aria-labelledby="work-title" className="bg-white py-22 md:py-30">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading
              id="work-title"
              eyebrow="Work"
              title="What we build for businesses."
              className="lg:col-span-7"
            />
            <p data-reveal className="t-lede text-ink-soft lg:col-span-5">
              The types of projects we deliver. Pick the one closest to you to see what we build and what you get.
            </p>
          </div>

          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((pattern, index) => (
              <li key={pattern.slug} data-reveal style={{ "--d": (index % 3) * 90 } as CSSProperties}>
                <Link
                  href={`/work#${pattern.slug}`}
                  className="card-premium group relative flex h-full flex-col overflow-hidden rounded-3xl p-7"
                >
                  <span
                    aria-hidden="true"
                    className="bg-brand absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  />
                  <span className="t-eyebrow text-cobalt">{pattern.eyebrow}</span>
                  <span className="mt-4 block font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-ink">
                    {pattern.title}
                  </span>
                  <span className="mt-3 block text-sm text-mist">For {pattern.fit}</span>
                  <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-medium text-cobalt">
                    See the details
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
            <li data-reveal style={{ "--d": 180 } as CSSProperties}>
              <Link
                href="/work"
                className="bg-brand group relative flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-3xl p-7 text-white shadow-[0_30px_60px_-30px_rgb(79_70_229/0.7)]"
              >
                <span aria-hidden="true" className="bg-grid absolute inset-0 opacity-40" />
                <span className="relative font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
                  See all our work
                </span>
                <span className="relative flex items-center gap-2 text-sm font-medium">
                  Explore every project type
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      {/* 6. How we work: strategy first */}
      <Process />

      {/* 7. Testimonials */}
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      {/* 8. Why Statin */}
      <WhyStatin />

      {/* 9. About: a short intro; the full story is on /about */}
      <StartupStory />

      {/* 10. Contact */}
      <ClosingCta />
    </>
  );
}
