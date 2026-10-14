"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small contextual label that follows the pointer over elements with a
 * `data-cursor` attribute ("View", "Open", "Explore"). The native cursor is
 * never hidden. Disabled for touch devices and reduced motion.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (ref.current) {
          ref.current.style.transform = `translate3d(${x + 16}px, ${y + 18}px, 0)`;
        }
      });
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
    };

    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80] will-change-transform"
    >
      <span
        className={`t-eyebrow inline-flex items-center gap-1.5 rounded-full bg-cobalt px-3 py-1.5 !tracking-[0.16em] text-white shadow-lg shadow-cobalt/30 transition-[opacity,scale] duration-300 ${
          label ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <span className="h-1 w-1 rounded-full bg-white" />
        {label ?? ""}
      </span>
    </div>
  );
}
