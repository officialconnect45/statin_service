import type { CSSProperties } from "react";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/typography";
import { getPublishedTestimonials } from "@/lib/testimonials";

/** Published testimonials from /admin/testimonials. Hidden when there are none. */
export async function Testimonials() {
  const testimonials = await getPublishedTestimonials();
  if (testimonials.length === 0) return null;

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
            <li key={item.id} data-reveal style={{ "--d": (index % 3) * 100 } as CSSProperties}>
              <TestimonialCard item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
