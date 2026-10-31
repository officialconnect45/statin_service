"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Card that tilts toward the pointer in 3D with a soft moving glare. Mouse
 * only; touch and reduced-motion users get a flat card.
 */
export function TiltCard({
  children,
  className = "",
  max = 8,
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glare", "0");
  };

  return (
    <div
      ref={ref}
      style={style}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        el.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
        el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
        el.style.setProperty("--glare", "1");
      }}
      onPointerLeave={reset}
      className={`tilt-card relative [perspective:900px] ${className}`}
    >
      <div className="tilt-card-inner relative h-full">
        {children}
        <span aria-hidden="true" className="tilt-card-glare pointer-events-none absolute inset-0 rounded-[inherit]" />
      </div>
    </div>
  );
}
