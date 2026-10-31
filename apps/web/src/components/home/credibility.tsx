import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { TechIcon } from "@/components/ui/tech-icon";
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
          <p data-reveal style={{ "--d": 120 } as CSSProperties} className="t-lede text-ink-soft lg:col-span-5">
            Statin is a product engineering company. We work with the teams whose revenue runs through a website, a
            store, or a product, and who need it built to hold up.
          </p>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ "--d": index * 90 } as CSSProperties}
              className="card-premium group relative overflow-hidden rounded-3xl p-7"
            >
              <span
                aria-hidden="true"
                className="bg-brand absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <span className="bg-brand flex h-11 w-11 items-center justify-center rounded-2xl font-[family-name:var(--font-display)] text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(91_70_240/0.8)]">
                0{index + 1}
              </span>
              <h3 className="mt-7 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{item.detail}</p>
            </li>
          ))}
        </ul>
      </Container>

      {/* Stack marquee: two rows drifting in opposite directions */}
      <div className="relative mt-20 overflow-hidden border-y border-line bg-white/70 py-10 backdrop-blur md:mt-24">
        <Container>
          <p className="t-eyebrow text-center text-mist">Engineering with</p>
        </Container>
        <div className="marquee-host mask-fade-x mt-7 space-y-4">
          {[stack, [...stack].reverse()].map((row, rowIndex) => (
            <div key={rowIndex} className="overflow-hidden">
              <ul
                className={`marquee ${rowIndex === 1 ? "[animation-direction:reverse]" : ""}`}
                style={{ animationDuration: "60s" }}
                aria-label={rowIndex === 0 ? "Technologies we work with" : undefined}
                aria-hidden={rowIndex === 1 ? true : undefined}
              >
                {[...row, ...row].map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    aria-hidden={index >= row.length ? true : undefined}
                    className="group mr-4 flex shrink-0 items-center gap-3 rounded-2xl border border-line bg-white py-3 pr-5 pl-3 shadow-[0_8px_24px_-16px_rgb(79_70_229/0.35)] transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-cobalt/30 hover:shadow-[0_16px_34px_-16px_rgb(79_70_229/0.5)]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper transition-transform duration-300 group-hover:scale-110">
                      <TechIcon name={item} className="h-5 w-5" />
                    </span>
                    <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Container className="flex flex-col gap-3 py-8 text-sm text-mist md:flex-row md:items-center md:justify-between">
        <p>Remote engineering, focused on teams across Scandinavia and the Baltics.</p>
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase">{markets.join(" · ")}</p>
      </Container>
    </section>
  );
}
