"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { deleteMailTemplate, saveMailTemplate, type MailTemplateFormState } from "@/app/admin/mail-templates/actions";

export type MailTemplateFormValues = {
  id?: string;
  name: string;
  subject: string;
  body: string;
  active: boolean;
};

const initialState: MailTemplateFormState = {};

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-mist/70 focus:border-cobalt focus:ring-1 focus:ring-cobalt aria-invalid:border-danger";

export function MailTemplateForm({ initial }: { initial: MailTemplateFormValues }) {
  const [state, action, pending] = useActionState(saveMailTemplate, initialState);
  const [values, setValues] = useState(initial);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const errors = state.errors ?? {};
  const set = <K extends keyof MailTemplateFormValues>(key: K, value: MailTemplateFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <form action={action} className="space-y-6 lg:col-span-7">
        {values.id ? <input type="hidden" name="id" value={values.id} /> : null}

        <Field label="Template name" hint="Shown in the template selector on the outreach page." error={errors.name}>
          <input
            name="name"
            required
            maxLength={80}
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="Product introduction"
            aria-invalid={errors.name ? true : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Subject" error={errors.subject}>
          <input
            name="subject"
            required
            maxLength={200}
            value={values.subject}
            onChange={(event) => set("subject", event.target.value)}
            placeholder="Quick idea for your team"
            aria-invalid={errors.subject ? true : undefined}
            className={inputClass}
          />
        </Field>

        <Field
          label="Message"
          hint="Plain text, sent exactly as written. Blank lines become paragraphs, links become clickable."
          error={errors.body}
        >
          <textarea
            name="body"
            required
            minLength={10}
            maxLength={20_000}
            rows={14}
            value={values.body}
            onChange={(event) => set("body", event.target.value)}
            placeholder={"Hi,\n\n...\n\nBest,\nTeam Statin\nhttps://statin.io"}
            aria-invalid={errors.body ? true : undefined}
            className={`${inputClass} resize-y leading-6`}
          />
        </Field>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="active"
            checked={values.active}
            onChange={(event) => set("active", event.target.checked)}
            className="h-4 w-4 accent-cobalt"
          />
          Show in the outreach template selector
        </label>

        {state.message ? (
          <p role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-cobalt px-6 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Saving" : values.id ? "Save changes" : "Add template"}
          </button>
          <Link
            href="/admin/mail-templates"
            className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-medium transition-colors hover:border-ink"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="space-y-6 lg:col-span-5">
        <div className="rounded-3xl border border-line bg-paper-deep p-5">
          <p className="t-eyebrow text-mist">Preview</p>
          <div className="mt-4 rounded-2xl border border-line bg-white p-5">
            <p className="text-xs text-mist">Subject</p>
            <p className="font-medium">{values.subject || "—"}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
              {values.body || "Your message appears here."}
            </p>
          </div>
          {!values.active ? <p className="mt-3 text-xs text-mist">Inactive: hidden from the outreach selector.</p> : null}
        </div>

        {values.id ? (
          <form action={deleteMailTemplate} className="rounded-2xl border border-danger/20 bg-white p-5">
            <input type="hidden" name="id" value={values.id} />
            <p className="text-sm font-medium">Delete template</p>
            <p className="mt-1 text-xs text-mist">
              Removes it from the database. Emails already sent with it are not affected.
            </p>
            {confirmDelete ? (
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-full bg-danger px-4 text-sm font-medium text-white"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="inline-flex h-9 items-center rounded-full border border-ink/15 px-4 text-sm"
                >
                  Keep it
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="mt-4 inline-flex h-9 items-center rounded-full border border-danger/40 px-4 text-sm text-danger transition-colors hover:bg-danger hover:text-white"
              >
                Delete
              </button>
            )}
          </form>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span className="mt-2 block text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="mt-2 block text-xs text-mist">{hint}</span>
      ) : null}
    </label>
  );
}
