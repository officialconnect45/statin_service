import Image from "next/image";
import Link from "next/link";

export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block shrink-0 overflow-hidden rounded-[24%] ${className}`}
    >
      <Image
        src="/statin-logo.png"
        alt=""
        fill
        sizes="64px"
        priority
        className="object-contain"
      />
    </span>
  );
}

export function Logo({
  tone = "dark",
  onNavigate,
}: {
  tone?: "dark" | "light";
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="Statin, home"
      className={`group inline-flex items-center gap-2.5 ${
        tone === "dark" ? "text-white" : "text-ink"
      }`}
    >
      <Mark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[-6deg]" />
      <span className="text-[15px] font-semibold tracking-[0.22em]">STATIN</span>
    </Link>
  );
}
