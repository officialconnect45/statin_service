import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { principles } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Statin is a product studio for startup founders who need a website, a SaaS product, or a store built to a serious standard.",
};

const staff = [
  {
    role: "Product lead",
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
        eyebrow="About"
        title="A studio for the company, not the pitch."
        lede="Statin works with startup founders who need the website, the software, or the store to carry real weight: a buyer, a customer, an order. We stay small so the person who scopes the work is still in it when it ships."
      />
      <section className="border-b border-line">
        <Container className="grid gap-6 py-16 md:grid-cols-2 md:py-24">
          {principles.map((principle) => (
            <article key={principle.index} className="border border-line bg-white p-7 md:p-9">
              <p className="font-mono text-[11px] tracking-[0.18em] text-brass">
                {principle.index}
              </p>
              <h2 className="mt-4 font-serif text-3xl tracking-tight">{principle.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{principle.detail}</p>
            </article>
          ))}
        </Container>
      </section>
      <section className="border-b border-line bg-forest text-paper">
        <Container className="grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass-line uppercase">
              Staffing
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight text-balance">
              Every engagement has names, not a pool.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-paper/75">
              Statin is founder-led. We do not publish a bench of anonymous
              specialists. You know who is designing, who is engineering, and
              who answers when the week goes sideways.
            </p>
          </div>
          <ul className="md:col-span-6 md:col-start-7">
            {staff.map((item) => (
              <li key={item.role} className="border-t border-white/15 py-5">
                <h3 className="font-serif text-2xl">{item.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/75">{item.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section>
        <Container className="grid items-end gap-8 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-8">
            <h2 className="font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.98] tracking-[-0.03em] text-balance">
              If the company is ready to be taken seriously, start there.
            </h2>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <ButtonLink href="/contact">Talk to the studio</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
