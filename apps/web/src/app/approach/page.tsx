import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { method } from "@/lib/site";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "How a Statin engagement runs: a written brief, a weekly demo, one named lead, and a launch the founder can operate.",
};

const rules = [
  {
    title: "A weekly review, forty-five minutes",
    detail:
      "Working software or a decision that unblocks it. We do not spend the meeting rereading last week’s notes.",
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
  "A founder, or one person who can decide, in the weekly review.",
  "Access to the current site, product, or store, and to the people who fulfill orders or support users.",
  "The commercial facts: who pays, what the first release must do, and what can wait.",
  "A willingness to cut. The date depends on the boundary.",
];

export default function ApproachPage() {
  return (
    <>
      <PageHero
        eyebrow="Approach"
        title="How an engagement actually runs."
        lede="Statin is a small studio on purpose. The method is there so a founder can see the work, change it in time, and leave with something the company can operate."
      />
      <section className="border-b border-line">
        <Container className="py-16 md:py-24">
          <ol className="border-l border-line">
            {method.map((step) => (
              <li key={step.index} className="relative grid gap-3 py-8 pl-8 md:grid-cols-12 md:py-10">
                <span className="absolute top-10 left-0 h-3 w-3 -translate-x-1/2 border border-brass-line bg-paper" />
                <div className="md:col-span-3">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-brass uppercase">
                    {step.index} · {step.time}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl tracking-tight">{step.name}</h2>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-ink-soft md:col-span-7">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="border-b border-line">
        <Container className="grid gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              Working rules
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight">
              The cadence is part of the product.
            </h2>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {rules.map((rule) => (
              <li key={rule.title} className="py-5">
                <h3 className="font-medium">{rule.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{rule.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section>
        <Container className="grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              From you
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight text-balance">
              We can move quickly when the decisions have an owner.
            </h2>
            <div className="mt-8">
              <ButtonLink href="/contact">Bring the brief</ButtonLink>
            </div>
          </div>
          <ul className="space-y-4 md:col-span-6 md:col-start-7">
            {needs.map((item, index) => (
              <li key={item} className="flex gap-4 border border-line bg-white p-5">
                <span className="font-mono text-xs text-brass">0{index + 1}</span>
                <span className="text-sm leading-relaxed text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
