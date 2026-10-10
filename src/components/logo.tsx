import Link from "next/link";

export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" fill="currentColor" />
      <path
        fill="#f4f1ea"
        d="M8.5 7.2h9.4v3.05h-6.15v3.35h5.35v2.95h-5.35v3.7h6.35V23H8.5V7.2z"
      />
      <rect x="22.2" y="7.2" width="1.8" height="15.8" fill="#c4a574" />
    </svg>
  );
}

export function Logo({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${tone === "paper" ? "text-paper" : "text-ink"}`}
    >
      <Mark />
      <span className="text-[15px] font-medium tracking-[0.18em]">STATIN</span>
    </Link>
  );
}
