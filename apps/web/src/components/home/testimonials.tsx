import type { CSSProperties } from "react";
import { TestimonialCarousel } from "@/components/testimonials/testimonial-carousel";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/typography";
import { getPublishedTestimonials } from "@/lib/testimonials";

/** Published testimonials from /admin/testimonials. Hidden when there are none. */
export async function Testimonials() {
  const testimonials = await getPublishedTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative overflow-hidden bg-paper-deep py-24 md:py-32"
    >
      <div aria-hidden="true" className="aurora">
        <span
          className="orb top-[30%] left-[10%] h-80 w-80 bg-indigo-300"
          style={{ "--o": 0.4, "--dx": "60px", "--dy": "40px" } as CSSProperties}
        />
        <span
          className="orb right-[8%] bottom-[5%] h-96 w-96 bg-fuchsia-200"
          style={{ "--o": 0.5, "--dx": "-50px", "--dy": "-30px", "--delay": "-6s" } as CSSProperties}
        />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            id="testimonials-title"
            eyebrow="Testimonials"
            title="What teams say about Statin."
            className="flex flex-col items-center [&_h2]:mx-auto"
          />
          <p data-reveal className="t-lede mx-auto mt-6 max-w-xl text-ink-soft">
            Founders and teams on what it is like to build with Statin.
          </p>
        </div>

        <div data-reveal className="mt-16">
          <TestimonialCarousel
            items={testimonials.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              quote: item.quote,
              logo: item.logo,
              highlight: item.highlight,
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
