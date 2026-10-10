import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { Specimen } from "@/components/specimens";
import {
  engagements,
  fit,
  method,
  services,
  standards,
} from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="border-b border-line">
        <Container className="grid items-end gap-14 py-16 md:py-24 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7">
            <p className="rise font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              Product studio for startup founders
            </p>
            <h1 className="rise rise-delay-1 mt-6 font-serif text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.035em] text-balance">
              Websites, SaaS,
              <br />
              and commerce
              <br />
              <span className="italic text-forest">for founders.</span>
            </h1>
            <p className="rise rise-delay-2 mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
              Statin designs and engineers the systems a young company has to
              trust on day one: the site that explains the offer, the product
              customers can pay for, and the store that can take the order.
            </p>
            <div className="rise rise-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact">Start a project</ButtonLink>
              <ButtonLink href="/work" variant="line">
                See the builds
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Specimen variant="saas" />
            <p className="mt-3 font-mono text-[11px] tracking-[0.16em] text-mist uppercase">
              SaaS · accounts, billing, daily use
            </p>
          </div>
        </Container>
      </section>

      <section aria-label="How an engagement runs">
        <Container className="grid border-b border-line sm:grid-cols-2 lg:grid-cols-4">
          {standards.map((item, index) => (
            <div
              key={item.label}
              className={`px-0 py-6 lg:px-6 lg:py-8 ${
                index > 0 ? "lg:border-l lg:border-line" : "lg:pl-0"
              } ${index % 2 === 1 ? "sm:border-l sm:border-line sm:pl-6" : ""} ${
                index > 1 ? "border-t border-line sm:border-t-0" : ""
              }`}
            >
              <p className="font-medium">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.detail}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-20 md:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
                Practices
              </p>
              <h2 className="mt-4 max-w-xl font-serif text-4xl tracking-tight text-balance md:text-5xl">
                Three ways a founder company has to show up.
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-medium tracking-wide text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
            >
              All services
            </Link>
          </div>
          <div className="mt-12 border-t border-ink">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group grid gap-4 border-b border-line py-7 transition-colors hover:bg-paper-deep md:grid-cols-12 md:items-baseline md:gap-6 md:px-3"
              >
                <span className="font-mono text-xs text-brass md:col-span-1">
                  {service.index}
                </span>
                <span className="font-serif text-3xl tracking-tight md:col-span-4 md:text-4xl">
                  {service.title}
                </span>
                <span className="text-sm leading-relaxed text-ink-soft md:col-span-6">
                  {service.summary}
                </span>
                <span className="font-mono text-xs tracking-[0.16em] text-mist uppercase transition-transform group-hover:translate-x-1 md:col-span-1 md:text-right">
                  View
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-forest text-paper">
        <Container className="grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass-line uppercase">
              The standard
            </p>
            <p className="mt-6 font-serif text-[clamp(2.2rem,4.5vw,3.7rem)] leading-[1.05] tracking-[-0.03em] text-balance">
              A first version can be small. It cannot be careless.
            </p>
          </div>
          <div className="flex flex-col justify-end md:col-span-5">
            <p className="text-base leading-relaxed text-paper/80">
              Founders come to Statin when the deck is no longer the product.
              The website has to explain the offer. The software has to hold a
              customer. The store has to take payment. We build those systems
              so they belong to the same company.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="grid gap-12 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              A fit
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Built for the founder who is still in the work.
            </h2>
            <ul className="mt-8 space-y-4">
              {fit.yes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-forest" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-paper-deep p-7 md:p-10">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              Not a fit
            </p>
            <ul className="mt-6 space-y-4">
              {fit.no.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-ink-soft">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-ink">
              If the offer is specific and you can stay in a weekly review, we
              should talk.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              Method
            </p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight text-balance md:text-5xl">
              A plan you can read before a screen is designed.
            </h2>
          </div>
          <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {method.map((step) => (
              <li key={step.index} className="bg-paper p-6">
                <p className="font-mono text-[11px] text-brass">
                  {step.index} · {step.time}
                </p>
                <h3 className="mt-4 font-serif text-3xl tracking-tight">{step.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{step.detail}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/approach"
            className="mt-8 inline-flex text-sm font-medium tracking-wide underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            Read the approach
          </Link>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-20 md:py-28">
          <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
            Engagements
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl tracking-tight text-balance md:text-5xl">
            Scoped to the company you are actually building.
          </h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {engagements.map((engagement) => (
              <article
                key={engagement.name}
                className={`flex flex-col border p-7 md:p-8 ${
                  "featured" in engagement && engagement.featured
                    ? "border-forest bg-forest text-paper"
                    : "border-line bg-white text-ink"
                }`}
              >
                <h3 className="font-serif text-3xl tracking-tight">{engagement.name}</h3>
                <p
                  className={`mt-2 text-sm ${
                    "featured" in engagement && engagement.featured
                      ? "text-brass-line"
                      : "text-brass"
                  }`}
                >
                  {engagement.fit}
                </p>
                <p
                  className={`mt-5 flex-1 text-sm leading-relaxed ${
                    "featured" in engagement && engagement.featured
                      ? "text-paper/80"
                      : "text-ink-soft"
                  }`}
                >
                  {engagement.detail}
                </p>
                <ul className="mt-8 space-y-2 border-t border-current/15 pt-5 text-sm">
                  {engagement.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-mist">
            Investment is confirmed in a written proposal after the brief. We
            do not publish a rate card for work that has not been scoped.
          </p>
        </Container>
      </section>

      <section>
        <Container className="grid gap-8 py-20 md:grid-cols-12 md:items-end md:py-28">
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
              Next
            </p>
            <h2 className="mt-4 font-serif text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.96] tracking-[-0.03em] text-balance">
              Tell us what you are building.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              You will get a point of view, a proposed shape, and a clear no if
              we are the wrong studio.
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <ButtonLink href="/contact">Start a project</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
