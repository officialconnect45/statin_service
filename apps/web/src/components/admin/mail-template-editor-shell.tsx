import Link from "next/link";
import type { ReactNode } from "react";

export function MailTemplateEditorShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
      <Link href="/admin/mail-templates" className="text-sm text-mist transition-colors hover:text-ink">
        ← All templates
      </Link>
      <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-mist">
        Save a subject and message to pick on the outreach page. Both stay editable before sending.
      </p>
      <div className="mt-10">{children}</div>
    </div>
  );
}
