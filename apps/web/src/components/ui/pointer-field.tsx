"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Exposes pointer position to CSS as --px / --py (pixels, for spotlights)
 * and --mx / --my (-1 to 1, for parallax). Updates are batched per frame
 * and skipped for touch devices and reduced motion.
 */
export function PointerField({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const px = event.clientX - rect.left;
        const py = event.clientY - rect.top;
        el.style.setProperty("--px", `${px}px`);
        el.style.setProperty("--py", `${py}px`);
        el.style.setProperty("--mx", ((px / rect.width) * 2 - 1).toFixed(3));
        el.style.setProperty("--my", ((py / rect.height) * 2 - 1).toFixed(3));
      });
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
