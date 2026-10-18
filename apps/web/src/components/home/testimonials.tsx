import Image from "next/image";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/typography";
import { initials, testimonials } from "@/lib/testimonials";

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-paper-deep py-24 md:py-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="testimonials-title"
            eyebrow="Testimonials"
            title="What teams say about Statin."
            className="lg:col-span-7"
          />
          <p data-reveal className="t-lede text-ink-soft lg:col-span-5">
            Businesses across SaaS, commerce, media, and fintech run their links and campaigns on
            Statin.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <li
              key={item.name}
              data-reveal
              style={{ "--d": (index % 3) * 100 } as CSSProperties}
            >
              <figure
                className={`flex h-full flex-col rounded-3xl border bg-white p-7 md:p-8 ${
                  item.highlight ? "border-cobalt/40 shadow-[0_0_0_1px_rgb(42_79_246/0.12)]" : "border-line"
                }`}
              >
                <figcaption className="flex items-center gap-4">
                  {item.logo ? (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-line bg-white">
                      <Image src={item.logo} alt={`${item.name} logo`} fill sizes="48px" className="object-contain p-1" />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cobalt/10 text-sm font-semibold text-cobalt"
                    >
                      {initials(item.name)}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block font-medium tracking-tight">{item.name}</span>
                    <span className="block text-sm text-mist">{item.description}</span>
                  </span>
                </figcaption>
                <blockquote className="mt-6 text-[15px] leading-relaxed text-ink-soft">
                  <p>&ldquo;{item.quote}&rdquo;</p>
                </blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
