import type { CSSProperties } from "react";
import { ClosingCta } from "@/components/home/closing-cta";
import { SocialSection } from "@/components/home/social-section";
import { WhyStatin } from "@/components/home/why-statin";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Eyebrow, SectionHeading } from "@/components/ui/typography";
import { principles, story } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Statin is a small, founder-led product engineering company building web apps, commerce systems, and backend, data, and AI integrations.",
  path: "/about",
});

const roles = [
  {
    role: "Lead",
    detail: "Owns the scope, the weekly review, and the release boundary.",
  },
  {
    role: "Design",
    detail: "Owns the narrative, the interface, and the system the pages are built from.",
  },
  {
    role: "Engineering",
    detail: "Owns production: the product, the integrations, and the handover.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Statin"
        title="We're early. We're focused."
        lede="Statin works with teams whose website, store, or software has to carry real weight: a buyer, a customer, an order. We stay small so the person who scopes the work is still in it when it ships."
      />

      <section aria-labelledby="story-heading" className="bg-white py-24 md:py-32">
        <Container className="grid gap-14 lg:grid-cols-12">
          <SectionHeading
            id="story-heading"
            eyebrow="Our story"
            title="Software that has to work, built properly."
            className="lg:col-span-5"
          />
          <dl className="space-y-10 lg:col-span-6 lg:col-start-7">
            {story.map((item, index) => (
              <div
                key={item.label}
                data-reveal
                style={{ "--d": index * 100 } as CSSProperties}
                className="border-t border-line pt-6"
              >
                <dt className="t-eyebrow text-mist">{item.label}</dt>
                <dd className="mt-4 text-lg leading-relaxed text-ink-soft">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="beliefs-title" className="bg-paper py-24 md:py-32">
        <Container>
          <SectionHeading id="beliefs-title" eyebrow="What we believe" title="Four principles we do not trade." />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2">
            {principles.map((item, index) => (
              <li
                key={item.index}
                data-reveal
                style={{ "--d": (index % 2) * 100 } as CSSProperties}
                className="bg-paper p-8 md:p-10"
              >
                <p className="font-mono text-xs text-cobalt">{item.index}</p>
                <h3 className="mt-8 text-2xl font-medium tracking-tight">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">{item.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="staffing-title" className="tone-dark bg-night text-white">
        <Container className="grid gap-12 py-24 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow className="text-signal">How we staff</Eyebrow>
            <h2 id="staffing-title" className="t-h2 mt-6 max-w-[14ch] text-balance">
              Every engagement has names, not a pool.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-fog">
              Statin is founder-led. You know who is designing, who is engineering, and who answers
              when the week goes sideways.
            </p>
          </div>
          <ul className="lg:col-span-6 lg:col-start-7">
            {roles.map((item) => (
              <li key={item.role} data-reveal className="border-t border-night-line py-6">
                <h3 className="text-2xl font-medium tracking-tight">{item.role}</h3>
                <p className="mt-2 text-base leading-relaxed text-fog">{item.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <WhyStatin />
      <SocialSection />
      <ClosingCta />
    </>
  );
}
