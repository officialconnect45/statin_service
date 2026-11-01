import Image from "next/image";
import Link from "next/link";
import { useId, type CSSProperties } from "react";

/**
 * Statin mark: the same "ST" squircle used for the favicon and app icons.
 * Hovering the logo sweeps a light across it.
 */
export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`logo-mark relative inline-block shrink-0 overflow-hidden rounded-[24%] shadow-[0_8px_20px_-8px_rgb(33_71_238/0.8)] ${className}`}
    >
      <Image src="/icon-192.png" alt="" width={192} height={192} className="h-full w-full" />
      <span className="logo-shine pointer-events-none absolute inset-0" />
    </span>
  );
}

/** The "A" of the wordmark: a gradient chevron in the mark's stroke style. */
function Lambda({ index }: { index: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <span style={{ "--i": index } as CSSProperties} className="logo-letter logo-lambda inline-block">
      <svg viewBox="0 0 14 14" className="block h-[0.75em] w-[0.82em]" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2147ee" />
            <stop offset="1" stopColor="#5eb3ff" />
          </linearGradient>
        </defs>
        <path
          d="M1.6 12.65 7 1.35l5.4 11.3"
          fill="none"
          stroke={`url(#${id}-a)`}
          strokeWidth="2.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const WORD = ["S", "T", "A", "T", "I", "N"] as const;

export function Logo({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: () => void }) {
  const dark = tone === "dark";
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="Statin, home"
      className={`logo-link group/logo inline-flex items-center gap-2.5 ${dark ? "text-white" : "text-ink"}`}
    >
      <Mark className="h-9 w-9 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:scale-105 group-hover/logo:rotate-[-8deg]" />
      <span
        aria-hidden="true"
        className="flex items-baseline font-[family-name:var(--font-display)] text-[16px] leading-none font-bold tracking-[0.16em]"
      >
        {WORD.map((letter, index) =>
          letter === "A" ? (
            <Lambda key={index} index={index} />
          ) : (
            <span
              key={index}
              style={{ "--i": index } as CSSProperties}
              className={`logo-letter inline-block ${dark ? "group-hover/logo:text-signal" : "group-hover/logo:text-cobalt"}`}
            >
              {letter}
            </span>
          ),
        )}
      </span>
    </Link>
  );
}
