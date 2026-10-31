import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Rounded photo with a slow zoom on hover and a soft brand tint at the
 * bottom. Size it with `className` (it fills its box); `children` render on
 * top, e.g. a caption chip.
 */
export function Photo({
  src,
  alt,
  sizes,
  className = "",
  preload = false,
  eager = false,
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Preload as a likely LCP image (Next 16 replacement for `priority`). */
  preload?: boolean;
  /** Load immediately instead of lazily, for photos at or near the fold. */
  eager?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`group/photo relative overflow-hidden rounded-[2rem] bg-paper-deep ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={!preload && eager ? "eager" : undefined}
        className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/photo:scale-[1.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(30_20_90/0.55)_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/20 ring-inset" />
      {children}
    </div>
  );
}

/** Small frosted label that sits on a photo. */
export function PhotoChip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`absolute flex items-center gap-2.5 rounded-2xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md ${className}`}
    >
      <span aria-hidden="true" className="relative flex h-2 w-2">
        <span className="ping-soft absolute inset-0 rounded-full bg-emerald-300" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-300" />
      </span>
      {children}
    </span>
  );
}
