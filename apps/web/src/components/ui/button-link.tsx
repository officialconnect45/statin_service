import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/icons";

const styles = {
  solid:
    "bg-cobalt text-white hover:bg-cobalt-hover shadow-[0_10px_30px_-12px_rgb(42_79_246/0.7)]",
  line: "border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white",
  light: "bg-white text-ink hover:bg-paper-deep",
  "line-dark":
    "border border-white/20 text-white hover:border-white hover:bg-white hover:text-ink",
} as const;

export type ButtonVariant = keyof typeof styles;

export function buttonClass(variant: ButtonVariant = "solid", className = "") {
  return `group/btn inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-medium tracking-tight transition-[background-color,color,border-color,box-shadow] duration-300 ${styles[variant]} ${className}`;
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
      {arrow ? (
        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
      ) : null}
    </Link>
  );
}
