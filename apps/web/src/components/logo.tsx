import Image from "next/image";
import Link from "next/link";

export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block shrink-0 overflow-hidden rounded-[24%] shadow-sm ring-1 ring-blue-500/25 ${className}`}
    >
      <Image
        src="/statin-logo.png"
        alt="Statin"
        fill
        sizes="64px"
        priority
        className="object-contain"
      />
    </span>
  );
}

export function Logo({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${
        tone === "paper" ? "text-white" : "text-ink"
      }`}
    >
      <Mark className="h-8 w-8 transition-transform group-hover:scale-105" />
      <span className="font-sans text-[15px] font-bold tracking-[0.16em]">
        STATIN
      </span>
    </Link>
  );
}
