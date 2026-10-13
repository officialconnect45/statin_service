import type { CSSProperties } from "react";
import { ClosingCta } from "@/components/home/closing-cta";
import { Process } from "@/components/home/process";
import { Container } from "@/components/ui/container";
import { Faq } from "@/components/ui/faq";
import { PageHero } from "@/components/ui/page-hero";
import { Eyebrow, SectionHeading } from "@/components/ui/typography";
import { faqs } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Our approach",
  description:
    "How a Statin engagement runs: discovery, a written scope with milestones and acceptance criteria, weekly working software, and a handover your team can operate.",
  path: "/approach",
});

const rules = [
  {
    title: "A weekly review, forty-five minutes",
    detail:
      "Working software or a decision that unblocks it. We do not spend the meeting rereading last week's notes.",
  },
  {
    title: "One decision log",
    detail:
      "Scope, open questions, and changes live in a record. If it is not written, it is not in the build.",
  },
  {
    title: "You approve the words",
    detail:
      "The offer is yours. We draft structure and interface copy. You approve anything a customer will read.",
  },
  {
    title: "No six-week reveal",
    detail:
      "You see the work while it can still change. A surprise at the end is a missed week, not a presentation.",
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

      <section aria-labelledby="rules-title" className="bg-white py-24 md:py-32">
        <Container className="grid gap-14 lg:grid-cols-12">
          <SectionHeading
            id="rules-title"
            eyebrow="Working rules"
            title="The cadence is part of the product."
            className="lg:col-span-5"
          />
          <ul className="border-t border-line lg:col-span-6 lg:col-start-7">
            {rules.map((rule, index) => (
              <li
                key={rule.title}
                data-reveal
                style={{ "--d": index * 80 } as CSSProperties}
                className="border-b border-line py-6"
              >
                <h3 className="text-lg font-medium tracking-tight">{rule.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">{rule.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="needs-title" className="bg-paper py-24 md:py-32">
        <Container className="grid gap-14 lg:grid-cols-12">
          <SectionHeading
            id="needs-title"
            eyebrow="From you"
            title="We move quickly when decisions have an owner."
            className="lg:col-span-5"
          />
          <ol className="space-y-3 lg:col-span-6 lg:col-start-7">
            {needs.map((item, index) => (
              <li
                key={item}
                data-reveal
                style={{ "--d": index * 80 } as CSSProperties}
                className="flex gap-5 rounded-2xl border border-line bg-white p-6"
              >
                <span className="font-mono text-xs text-cobalt">0{index + 1}</span>
                <span className="text-base leading-relaxed text-ink-soft">{item}</span>
              </li>
            ))}
          </ol>
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
