import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow, SplitText } from "@/components/ui/typography";
import { audiences, markets, stack } from "@/lib/content";

export function Credibility() {
  return (
    <section aria-labelledby="credibility-title" className="relative bg-paper pt-24 md:pt-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Who we build for</Eyebrow>
            <SplitText
              id="credibility-title"
              text="Built for teams that depend on every click."
              className="t-h2 mt-6 max-w-[16ch] text-balance"
            />
          </div>
          <p
            data-reveal
            style={{ "--d": 120 } as CSSProperties}
            className="t-lede text-ink-soft lg:col-span-5"
          >
            Statin is a product engineering company. We work with the teams whose revenue runs
            through a website, a store, or a product, and who need it built to hold up.
          </p>
        </div>

        <ul className="mt-16 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ "--d": index * 90 } as CSSProperties}
              className={`group relative border-b border-line py-8 sm:px-6 lg:border-b-0 ${
                index % 2 === 1 ? "sm:border-l" : ""
              } ${index % 2 === 0 ? "sm:pl-0" : ""} ${index > 0 ? "lg:border-l lg:pl-6" : "lg:pl-0"}`}
            >
              <span
                aria-hidden="true"
                className="absolute top-[-1px] left-0 h-px w-0 bg-cobalt transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
              />
              <p className="font-mono text-[11px] text-cobalt">0{index + 1}</p>
              <h3 className="mt-6 text-xl font-medium tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Container>

      {/* Stack marquee */}
      <div className="mt-20 border-y border-line bg-white py-6 md:mt-24">
        <Container className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
          <p className="t-eyebrow shrink-0 text-mist">Engineering with</p>
          <div className="marquee-host mask-fade-x relative min-w-0 flex-1 overflow-hidden">
            <ul className="marquee" aria-label="Technologies we work with">
              {[...stack, ...stack].map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  aria-hidden={index >= stack.length ? true : undefined}
                  className="flex items-center gap-10 pr-10 text-lg font-medium tracking-tight whitespace-nowrap text-ink/80"
                >
                  {item}
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cobalt/50" />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col gap-3 py-8 text-sm text-mist md:flex-row md:items-center md:justify-between">
        <p>Remote engineering, focused on teams across Scandinavia and the Baltics.</p>
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase">{markets.join(" · ")}</p>
      </Container>
    </section>
  );
}
