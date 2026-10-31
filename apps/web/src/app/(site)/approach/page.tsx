import type { CSSProperties } from "react";
import { ClosingCta } from "@/components/home/closing-cta";
import { Process } from "@/components/home/process";
import { Container } from "@/components/ui/container";
import { Faq } from "@/components/ui/faq";
import { PageHero } from "@/components/ui/page-hero";
import { ReadinessChecklist } from "@/components/ui/readiness-checklist";
import { TiltCard } from "@/components/ui/tilt-card";
import { Eyebrow, SectionHeading } from "@/components/ui/typography";
import { faqs } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Our approach",
  description:
    "How a Statin engagement runs: discovery, an agreed strategy and plan, weekly working software, and a handover your team can run.",
  path: "/approach",
});

const rules = [
  {
    icon: <path d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 6.5V10l2.5 1.5" />,
    title: "A weekly review, forty-five minutes",
    detail: "Working software or a decision that unblocks it. We do not spend the meeting rereading last week's notes.",
  },
  {
    icon: <path d="M5 3h8l3 3v11H5V3ZM8 8h5M8 11h5M8 14h3" />,
    title: "One decision log",
    detail: "Scope, open questions, and changes live in a record. If it is not written, it is not in the build.",
  },
  {
    icon: <path d="M4 16l1-4 8-8 3 3-8 8-4 1ZM11.5 5.5l3 3" />,
    title: "You approve the words",
    detail: "The offer is yours. We draft structure and interface copy. You approve anything a customer will read.",
  },
  {
    icon: (
      <path d="M2.5 10s3-5.5 7.5-5.5S17.5 10 17.5 10s-3 5.5-7.5 5.5S2.5 10 2.5 10ZM10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    ),
    title: "No six-week reveal",
    detail: "You see the work while it can still change. A surprise at the end is a missed week, not a presentation.",
  },
];

const needs = [
  "One person who can make decisions, in the weekly review.",
  "Access to the current site, store, or system, and to the people who fulfill orders or support users.",
  "The commercial facts: who pays, what the first release must do, and what can wait.",
  "A willingness to cut. The date depends on the boundary.",
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function ApproachPage() {
  return (
    <>
      <PageHero
        eyebrow="Our approach"
        title="How an engagement actually runs."
        lede="The method exists so you can see the work, change it in time, and leave with something your team can operate. It starts with the problem, not a tool list."
      />

      <Process />

      <section aria-labelledby="rules-title" className="relative overflow-hidden bg-white py-24 md:py-32">
        <div aria-hidden="true" className="aurora">
          <span
            className="orb top-[10%] -right-24 h-96 w-96 bg-violet-200"
            style={{ "--o": 0.5, "--dx": "-60px", "--dy": "40px" } as CSSProperties}
          />
        </div>
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading
              id="rules-title"
              eyebrow="Working rules"
              title="The cadence is part of the product."
              className="lg:col-span-7"
            />
            <p data-reveal className="t-lede text-ink-soft lg:col-span-5">
              Four habits that keep every project visible, on track, and easy to steer.
            </p>
          </div>
          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {rules.map((rule, index) => (
              <li key={rule.title} data-reveal style={{ "--d": (index % 2) * 100 } as CSSProperties}>
                <TiltCard className="h-full rounded-[2rem]">
                  <div className="card-premium group h-full overflow-hidden rounded-[2rem] p-8">
                    <div className="flex items-center justify-between">
                      <span className="bg-brand flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_12px_28px_-10px_rgb(91_70_240/0.8)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                        <svg
                          viewBox="0 0 20 20"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          {rule.icon}
                        </svg>
                      </span>
                      <span className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight">
                        <span className="text-gradient">0{index + 1}</span>
                      </span>
                    </div>
                    <h3 className="mt-8 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
                      {rule.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-soft">{rule.detail}</p>
                  </div>
                </TiltCard>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="needs-title" className="bg-paper py-24 md:py-32">
        <Container className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              id="needs-title"
              eyebrow="From you"
              title="We move quickly when decisions have an owner."
              lede="Four things that make a project run smoothly. Tick the ones you already have."
            />
          </div>
          <div data-reveal className="lg:col-span-6 lg:col-start-7">
            <ReadinessChecklist items={needs} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-title" className="bg-white py-24 md:py-32">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 id="faq-title" className="t-h2 mt-6 max-w-[12ch]">
              What teams ask first.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Faq items={faqs} />
          </div>
        </Container>
      </section>

      <ClosingCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
