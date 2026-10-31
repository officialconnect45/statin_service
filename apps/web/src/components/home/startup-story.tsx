import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { Eyebrow, SplitText } from "@/components/ui/typography";
import { photos } from "@/lib/photos";

/** Short "who we are" intro with a photo collage; the full story is on /about. */
export function StartupStory() {
  return (
    <section aria-labelledby="about-title" className="bg-white py-24 md:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-12">
        <div data-reveal className="relative pr-10 pb-16 sm:pr-16 lg:col-span-6">
          <Photo
            {...photos.teamWhiteboard}
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="aspect-[4/3] shadow-[0_40px_90px_-45px_rgb(46_35_140/0.6)]"
          />
          <Photo
            {...photos.codeOnLaptop}
            sizes="(min-width: 1024px) 22vw, 45vw"
            className="!absolute right-0 bottom-0 aspect-[4/3] w-[48%] rounded-3xl border-[6px] border-white shadow-[0_30px_60px_-30px_rgb(46_35_140/0.6)]"
          />
          <div className="float-y glass absolute top-6 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-8">
            <span className="bg-brand flex h-10 w-10 items-center justify-center rounded-xl text-white">
              <svg
                viewBox="0 0 20 20"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 6 3 10l4 4M13 6l4 4-4 4" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Built in-house</span>
              <span className="block text-xs text-mist">No hand-offs, no outsourcing</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <Eyebrow>About Statin</Eyebrow>
          <SplitText
            id="about-title"
            text="One team that builds software your business can rely on."
            accentFrom={6}
            className="t-h2 mt-6 max-w-[16ch] text-balance"
          />
          <p data-reveal style={{ "--d": 120 } as CSSProperties} className="t-lede mt-6 text-ink-soft">
            Statin is a product engineering company. We design, build, and look after websites, online stores, apps, and
            the systems behind them, for businesses whose revenue depends on them.
          </p>
          <div data-reveal style={{ "--d": 220 } as CSSProperties} className="mt-9">
            <ButtonLink href="/about" variant="line">
              More about Statin
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
