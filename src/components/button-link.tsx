import Link from "next/link";
import type { ReactNode } from "react";

const styles = {
  solid:
    "bg-[#244df5] text-white shadow-sm shadow-blue-600/25 hover:bg-[#1a3ee8] hover:shadow-md hover:shadow-blue-600/35 transition-all font-medium",
  line:
    "border border-line bg-white text-ink hover:border-[#244df5] hover:text-[#244df5] hover:bg-blue-50/40 shadow-xs transition-all font-medium",
  light:
    "bg-white text-ink shadow-sm hover:bg-blue-50/70 hover:text-[#244df5] transition-all font-medium",
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
