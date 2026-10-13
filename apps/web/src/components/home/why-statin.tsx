import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/typography";
import { differentiators } from "@/lib/content";

export function WhyStatin() {
  return (
    <section aria-labelledby="why-title" className="bg-paper py-24 md:py-32">
      <Container className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="why-title"
              eyebrow="Why Statin"
              title="What working with us is like."
              lede="No bench of anonymous specialists and no six-week reveal. These are the working rules every engagement runs on."
            />
          </div>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:col-span-8">
          {differentiators.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ "--d": (index % 2) * 100 } as CSSProperties}
              className="group relative bg-paper p-7 transition-colors duration-500 hover:bg-white md:p-9"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-0.5 w-0 bg-cobalt transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
              />
              <p className="font-mono text-xs text-mist transition-colors group-hover:text-cobalt">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-10 text-xl font-medium tracking-tight md:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-[15px]">{item.detail}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
