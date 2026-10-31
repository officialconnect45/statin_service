import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { Photo, PhotoChip } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/typography";
import { keyDifferentiators } from "@/lib/content";
import { photos } from "@/lib/photos";

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
            <Photo
              {...photos.pairProgramming}
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="mt-10 hidden aspect-[4/5] shadow-[0_40px_90px_-45px_rgb(46_35_140/0.6)] lg:block"
            >
              <PhotoChip className="bottom-5 left-5">Working software every week</PhotoChip>
            </Photo>
          </div>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {keyDifferentiators.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ "--d": (index % 2) * 100 } as CSSProperties}
              className="card-premium group relative overflow-hidden rounded-3xl p-7 md:p-9"
            >
              <span
                aria-hidden="true"
                className="bg-brand absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <p className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight">
                <span className="text-gradient">{String(index + 1).padStart(2, "0")}</span>
              </p>
              <h3 className="mt-8 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-[15px]">{item.detail}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
