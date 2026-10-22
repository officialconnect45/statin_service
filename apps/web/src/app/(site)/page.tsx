import { Suspense } from "react";
import Link from "next/link";
import { Architecture } from "@/components/home/architecture";
import { Capabilities } from "@/components/home/capabilities";
import { ClosingCta } from "@/components/home/closing-cta";
import { Credibility } from "@/components/home/credibility";
import { Hero } from "@/components/home/hero";
import { ProblemStory } from "@/components/home/problem-story";
import { Process } from "@/components/home/process";
import { SocialSection } from "@/components/home/social-section";
import { StartupStory } from "@/components/home/startup-story";
import { Testimonials } from "@/components/home/testimonials";
import { WhyStatin } from "@/components/home/why-statin";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/typography";
import { PatternCard } from "@/components/work/pattern-card";
import { patterns } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({ description: site.description, path: "/" });

export default function Home() {
  return (
    <>
      {/* 1. Who Statin is and what it builds */}
      <Hero />

      {/* 2. Who it is for, and with what */}
      <Credibility />

      {/* 3. The problem, then the approach */}
      <ProblemStory />

      {/* 4. Capabilities */}
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
              Each one is scoped, designed, and engineered as a system the team can run after
              launch, not a file waiting for the next contractor.
            </p>
          </div>
          <div className="mt-16">
            <Capabilities />
          </div>
        </Container>
      </section>

      {/* 5. How it works */}
      <Process />

      {/* 6. Work */}
      <section aria-labelledby="work-title" className="bg-white py-24 md:py-32">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading
              id="work-title"
              eyebrow="Work"
              title="Patterns, not borrowed logos."
              className="lg:col-span-7"
            />
            <div data-reveal className="lg:col-span-5">
              <p className="t-lede text-ink-soft">
                These are the builds we are set up to deliver: the situation, what we make, and
                what your team receives.
              </p>
              <Link href="/work" className="group mt-6 inline-flex items-center gap-3 text-sm font-medium">
                <span className="link-line">All {patterns.length} build patterns</span>
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="mt-20 space-y-24 md:space-y-32">
            {patterns.slice(0, 3).map((pattern, index) => (
              <PatternCard key={pattern.slug} pattern={pattern} flip={index % 2 === 1} />
            ))}
          </div>
        </Container>
      </section>

      {/* 7. Testimonials */}
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      {/* 8. Why Statin */}
      <WhyStatin />

      {/* 9. Technology / infrastructure */}
      <section aria-labelledby="architecture-title" className="tone-dark relative overflow-hidden bg-night py-24 text-white md:py-32">
        <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading
              id="architecture-title"
              tone="dark"
              eyebrow="Architecture"
              title="How a Statin system is layered."
              className="lg:col-span-7"
            />
            <p data-reveal className="t-lede text-fog lg:col-span-5">
              Every build, from a business website to a custom platform, is reasoned about in the
              same layers. Select a layer to see what lives there.
            </p>
          </div>
          <div className="mt-16">
            <Architecture />
          </div>
        </Container>
      </section>

      {/* 10. Startup story */}
      <StartupStory />

      {/* 11. Social */}
      <SocialSection />

      {/* 12. Closing CTA */}
      <ClosingCta />
    </>
  );
}
