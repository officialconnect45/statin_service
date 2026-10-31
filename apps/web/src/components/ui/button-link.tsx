import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/icons";

const styles = {
  solid:
    "bg-brand btn-shine text-white shadow-[0_14px_34px_-12px_rgb(91_70_240/0.65),inset_0_1px_0_rgb(255_255_255/0.25)] hover:shadow-[0_18px_44px_-12px_rgb(91_70_240/0.85),inset_0_1px_0_rgb(255_255_255/0.25)] hover:-translate-y-0.5",
  line: "border border-ink/12 bg-white/70 text-ink backdrop-blur hover:border-cobalt/40 hover:text-cobalt hover:shadow-[0_12px_30px_-16px_rgb(91_70_240/0.45)]",
  light:
    "btn-shine bg-white text-ink shadow-[0_10px_30px_-14px_rgb(14_11_43/0.35)] hover:-translate-y-0.5 hover:text-cobalt",
  "line-dark": "border border-white/20 bg-white/[0.04] text-white backdrop-blur hover:border-white/60 hover:bg-white/10",
} as const;

export type ButtonVariant = keyof typeof styles;

export function buttonClass(variant: ButtonVariant = "solid", className = "") {
  return `group/btn inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-medium tracking-tight transition-[background-color,color,border-color,box-shadow,translate] duration-300 ${styles[variant]} ${className}`;
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
