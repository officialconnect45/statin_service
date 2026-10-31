"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { TestimonialCard, type TestimonialCardData } from "@/components/testimonials/testimonial-card";
import { ArrowIcon } from "@/components/ui/icons";

const INTERVAL_MS = 5000;
const DRAG_THRESHOLD = 50;

/**
 * Coverflow carousel along the x-axis. Auto-advances while visible; pauses on
 * hover, focus, or drag. Swipe/drag, arrow buttons, keyboard arrows, the dots,
 * or clicking a side card all move it. Wraps around in both directions.
 */
export function TestimonialCarousel({ items }: { items: (TestimonialCardData & { id: string })[] }) {
  const count = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number) => setActive(((next % count) + count) % count), [count]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      query.removeEventListener("change", update);
      io.disconnect();
    };
  }, []);

  const running = count > 1 && !paused && visible && !reduced && !dragging;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(active + 1), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [running, active, go]);

  if (count === 0) return null;

  /** Signed distance from the active card, wrapped so the ring has no end. */
  const offsetOf = (index: number) => {
    let offset = (((index - active) % count) + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onPointerEnter={(event) => event.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(active + 1);
        if (event.key === "ArrowLeft") go(active - 1);
      }}
    >
      <div
        className="relative mx-auto grid touch-pan-y [perspective:1400px] select-none"
        onPointerDown={(event) => {
          if (count < 2) return;
          dragStart.current = event.clientX;
          setDragging(true);
          (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragStart.current !== null) setDrag(event.clientX - dragStart.current);
        }}
        onPointerUp={() => {
          if (dragStart.current === null) return;
          if (drag <= -DRAG_THRESHOLD) go(active + 1);
          else if (drag >= DRAG_THRESHOLD) go(active - 1);
          dragStart.current = null;
          setDragging(false);
          setDrag(0);
        }}
        onPointerCancel={() => {
          dragStart.current = null;
          setDragging(false);
          setDrag(0);
        }}
      >
        {items.map((item, index) => {
          const offset = offsetOf(index);
          const distance = Math.abs(offset);
          const current = offset === 0;
          const hidden = distance > 2;
          return (
            <div
              key={item.id}
              aria-hidden={!current}
              onClick={() => !current && Math.abs(drag) < 5 && go(index)}
              className={`col-start-1 row-start-1 mx-auto w-[min(600px,86vw)] transition-[transform,opacity,filter] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                dragging ? "duration-0" : "duration-700"
              } ${current ? "" : "cursor-pointer"}`}
              style={
                {
                  transform: `translateX(calc(${offset * 68}% + ${drag}px)) scale(${1 - distance * 0.12}) rotateY(${offset * -10}deg)`,
                  opacity: hidden ? 0 : 1 - distance * 0.35,
                  filter: current ? "none" : `blur(${distance * 1.5}px) saturate(0.8)`,
                  zIndex: 10 - distance,
                  pointerEvents: hidden ? "none" : undefined,
                } as CSSProperties
              }
            >
              <div
                className={`h-full rounded-[1.75rem] transition-shadow duration-700 ${
                  current ? "shadow-[0_40px_90px_-40px_rgb(79_70_229/0.55)]" : ""
                }`}
              >
                <TestimonialCard item={item} />
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 ? (
        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(active - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-[border-color,color,translate] hover:-translate-x-0.5 hover:border-cobalt/40 hover:text-cobalt"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" />
            <span className="sr-only">Previous testimonial</span>
          </button>

          <div className="flex items-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(index)}
                aria-label={`Show testimonial ${index + 1} of ${count}`}
                aria-current={index === active ? "true" : undefined}
                className={`relative h-2 overflow-hidden rounded-full bg-cobalt/15 transition-[width] duration-500 ${
                  index === active ? "w-10" : "w-2 hover:bg-cobalt/30"
                }`}
              >
                {index === active ? (
                  <span
                    key={`${active}-${running}`}
                    className="bg-brand absolute inset-y-0 left-0 rounded-full"
                    style={
                      running
                        ? { animation: `testimonial-progress ${INTERVAL_MS}ms linear forwards` }
                        : { width: "100%" }
                    }
                  />
                ) : null}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(active + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-[border-color,color,translate] hover:translate-x-0.5 hover:border-cobalt/40 hover:text-cobalt"
          >
            <ArrowIcon className="h-4 w-4" />
            <span className="sr-only">Next testimonial</span>
          </button>
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        Testimonial {active + 1} of {count}: {items[active]?.name}
      </p>
    </div>
  );
}
