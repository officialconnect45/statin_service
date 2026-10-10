import Link from "next/link";
import type { ReactNode } from "react";

const styles = {
  solid: "bg-ink text-paper hover:bg-forest",
  line: "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-white",
  light: "bg-paper text-ink hover:bg-white",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center gap-2.5 px-5 text-sm font-medium tracking-wide transition-colors ${styles[variant]} ${className}`}
    >
      {children}
      <Arrow />
    </Link>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
