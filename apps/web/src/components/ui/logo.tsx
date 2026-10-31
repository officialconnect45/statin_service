import Link from "next/link";
import { useId, type CSSProperties } from "react";

/**
 * Statin mark: an "S" drawn as one connection between two system nodes, on
 * the brand gradient. A light sweep crosses it when its group is hovered.
 */
export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <span
      aria-hidden="true"
      className={`logo-mark relative inline-block shrink-0 overflow-hidden rounded-[30%] shadow-[0_8px_20px_-8px_rgb(91_70_240/0.8)] ${className}`}
    >
      <svg viewBox="0 0 32 32" className="h-full w-full">
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4f46e5" />
            <stop offset="0.55" stopColor="#7c4dff" />
            <stop offset="1" stopColor="#c06bf0" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" fill={`url(#${id}-bg)`} />
        <circle cx="25" cy="7" r="9" fill="white" opacity="0.12" />
        <path
          d="M21 11.2c0-2.2-2.2-3.6-5-3.6-2.9 0-5 1.4-5 3.6 0 2.5 2.6 3.2 5 3.8 2.6.6 5 1.4 5 4 0 2.3-2.1 3.6-5 3.6-2.9 0-5-1.4-5-3.6"
          fill="none"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        {/* The two system nodes the "S" connects */}
        <circle cx="21" cy="11.2" r="2.9" fill="white" />
        <circle cx="21" cy="11.2" r="1.2" fill="#6d4bf3" />
        <circle cx="11" cy="19" r="2.9" fill="white" />
        <circle cx="11" cy="19" r="1.2" fill="#6d4bf3" />
      </svg>
      <span className="logo-shine pointer-events-none absolute inset-0" />
    </span>
  );
}

const LETTERS = "STATIN".split("");

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
        className="flex font-[family-name:var(--font-display)] text-[15px] font-bold tracking-[0.2em]"
      >
        {LETTERS.map((letter, index) => (
          <span
            key={index}
            style={{ "--i": index } as CSSProperties}
            className={`logo-letter inline-block ${dark ? "group-hover/logo:text-signal" : "group-hover/logo:text-cobalt"}`}
          >
            {letter}
          </span>
        ))}
      </span>
    </Link>
  );
}
