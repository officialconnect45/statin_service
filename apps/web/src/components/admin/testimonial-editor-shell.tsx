import Link from "next/link";
import type { ReactNode } from "react";

export function TestimonialEditorShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
      <Link href="/admin/testimonials" className="text-sm text-mist transition-colors hover:text-ink">
        ← All testimonials
      </Link>
      <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-mist">
        Add a business name, logo, and description with the quote shown on the home page.
      </p>
      <div className="mt-10">{children}</div>
    </div>
  );
}
