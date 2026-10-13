"use client";

import { useEffect, useRef } from "react";
import { Eyebrow, SplitText } from "@/components/ui/typography";
import { processSteps } from "@/lib/content";

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Desktop: the section pins and the stages scroll horizontally with the page.
 * Tablet and mobile: a vertical timeline. Reduced motion: a static grid.
 * Layout is CSS-driven; JS only sets the scroll distance and offset.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const query = window.matchMedia(PIN_QUERY);
    let distance = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!query.matches) return;
      const rect = section.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const measure = () => {
      if (!query.matches) {
        section.style.height = "";
        track.style.transform = "";
        return;
      }
      const viewport = track.parentElement?.clientWidth ?? window.innerWidth;
      distance = Math.max(0, track.scrollWidth - viewport);
      section.style.height = `${distance + window.innerHeight}px`;
      update();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    query.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      query.removeEventListener("change", measure);
      section.style.height = "";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-title"
      className="relative bg-paper-deep"
    >
      <div className="py-24 md:py-32 lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden lg:py-0 motion-reduce:lg:static motion-reduce:lg:h-auto motion-reduce:lg:py-32">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>How we work</Eyebrow>
              <SplitText
                id="process-title"
                text="A written plan before any code."
                className="t-h2 mt-6 max-w-[14ch] text-balance"
              />
            </div>
            <p data-reveal className="t-lede text-ink-soft lg:col-span-5">
              Six stages, one lead, and a scope you can read. You see the plan before anyone
              designs a screen, and working software every week after that.
            </p>
          </div>
        </div>

        <div className="mt-14 lg:mt-16">
          <ol
            ref={trackRef}
            className="relative mx-auto flex max-w-[1320px] flex-col px-5 will-change-transform sm:px-8 lg:mx-0 lg:w-max lg:max-w-none lg:flex-row lg:gap-5 lg:pr-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))] lg:pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))] motion-reduce:lg:mx-auto motion-reduce:lg:grid motion-reduce:lg:w-auto motion-reduce:lg:max-w-[1320px] motion-reduce:lg:grid-cols-3 motion-reduce:lg:px-10"
          >
            {/* Mobile timeline spine */}
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[27px] w-px bg-ink/15 sm:left-[39px] lg:hidden" />

            {processSteps.map((step) => (
              <li
                key={step.index}
                className="group relative pb-10 pl-12 last:pb-0 lg:w-[min(400px,30vw)] lg:shrink-0 lg:pb-0 lg:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 left-[3px] h-[9px] w-[9px] rounded-full border-2 border-cobalt bg-paper-deep lg:hidden"
                />
                <article className="relative h-full overflow-hidden lg:rounded-3xl lg:border lg:border-line lg:bg-white lg:p-8 lg:transition-[border-color,box-shadow] lg:duration-500 lg:hover:border-cobalt/40 lg:hover:shadow-[0_30px_60px_-30px_rgb(42_79_246/0.35)]">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-mono text-xs text-cobalt">{step.index}</p>
                    <p
                      aria-hidden="true"
                      className="hidden text-[5.5rem] leading-none font-semibold tracking-[-0.06em] text-transparent transition-[-webkit-text-stroke-color] duration-500 lg:block"
                      style={{ WebkitTextStroke: "1px rgb(10 13 24 / 0.12)" }}
                    >
                      {step.index}
                    </p>
                  </div>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight lg:mt-6 lg:text-3xl">
                    {step.name}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-soft">{step.detail}</p>
                  <p className="mt-6 flex items-center gap-3 border-t border-line pt-4 font-mono text-[11px] tracking-[0.12em] text-mist uppercase lg:mt-10">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cobalt" />
                    {step.output}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop progress */}
        <div className="mx-auto mt-12 hidden w-full max-w-[1320px] px-10 lg:block motion-reduce:lg:hidden">
          <div className="h-px w-full bg-ink/10">
            <span
              ref={barRef}
              className="block h-px origin-left scale-x-0 bg-cobalt"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
