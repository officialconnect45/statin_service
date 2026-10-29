"use client";

import type { MailTemplateRecord } from "@statin/types";
import Link from "next/link";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-mist/70 focus:border-cobalt focus:ring-1 focus:ring-cobalt";

/**
 * Template selector on the outreach page. Picking a template fills the subject
 * and message; "Write manually" clears them. Templates are added, edited and
 * deleted only on /admin/mail-templates. The select has no name, so it is not
 * sent with the mail.
 */
export function OutreachTemplatePicker({
  templates,
  selectedId,
  onSelect,
}: {
  templates: MailTemplateRecord[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor="outreach-template" className="text-sm font-medium">
          Template
        </label>
        <Link href="/admin/mail-templates" className="text-xs text-mist transition-colors hover:text-ink">
          Manage templates →
        </Link>
      </div>

      <select
        id="outreach-template"
        value={selectedId}
        onChange={(event) => onSelect(event.target.value)}
        disabled={templates.length === 0}
        className={`${inputClass} mt-2 disabled:cursor-not-allowed disabled:text-mist`}
      >
        <option value="">{templates.length > 0 ? "Write manually" : "No saved templates yet"}</option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>

      <p className="mt-2 text-xs text-mist">
        {templates.length > 0
          ? "Picking a template fills the subject and message below; you can still edit both before sending. Write manually starts empty."
          : "Add templates on the Templates page to pick them here."}
      </p>
    </div>
  );
}
