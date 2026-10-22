"use client";

import type { OutreachRecipient } from "@statin/types";
import { useActionState, useMemo, useState, type ReactNode } from "react";
import { sendOutreach, type OutreachFormState } from "@/app/admin/outreach/actions";

// Must match MAX_RECIPIENTS in apps/api/src/routes/outreach.ts
const MAX_RECIPIENTS = 30;
const EMAIL_IN_TEXT = /[^\s@<>,;"']+@[^\s@<>,;"']+\.[^\s@<>,;"']+/g;
const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

const initialState: OutreachFormState = {};

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-mist/70 focus:border-cobalt focus:ring-1 focus:ring-cobalt aria-invalid:border-danger";

/**
 * One recipient per line. Accepts `jane@acme.com`, `Jane Doe <jane@acme.com>`,
 * `jane@acme.com, Jane Doe`, or several bare addresses on one line.
 */
function parseRecipients(text: string) {
  const recipients: OutreachRecipient[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();
  let duplicates = 0;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const emails = line.match(EMAIL_IN_TEXT) ?? [];
    if (emails.length === 0) {
      invalid.push(line);
      continue;
    }
    const name =
      emails.length === 1
        ? line.replace(emails[0], "").replace(/[<>,;"'\t]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80)
        : "";
    for (const found of emails) {
      const email = found.toLowerCase();
      if (!EMAIL.test(email)) {
        invalid.push(found);
      } else if (seen.has(email)) {
        duplicates += 1;
      } else {
        seen.add(email);
        recipients.push({ email, name });
      }
    }
  }

  return { recipients, invalid, duplicates };
}

function fill(template: string, recipient: OutreachRecipient | undefined) {
  return template
    .replace(/\{\{\s*name\s*\}\}/gi, recipient?.name || "there")
    .replace(/\{\{\s*email\s*\}\}/gi, recipient?.email ?? "jane@example.com");
}

export function OutreachForm() {
  const [state, action, pending] = useActionState(sendOutreach, initialState);
  const [list, setList] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  // Confirm step belongs to one run; it closes by itself once that send finishes.
  const [confirmRun, setConfirmRun] = useState<number | null>(null);
  const [intent, setIntent] = useState<"test" | "send">("send");
  const confirming = confirmRun === (state.run ?? 0);
  const setConfirming = (open: boolean) => setConfirmRun(open ? (state.run ?? 0) : null);

  const { recipients, invalid, duplicates } = useMemo(() => parseRecipients(list), [list]);
  const errors = state.errors ?? {};
  const tooMany = recipients.length > MAX_RECIPIENTS;
  const canSend = recipients.length > 0 && invalid.length === 0 && !tooMany && subject.trim() !== "" && body.trim().length >= 10;

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="recipients" value={JSON.stringify(recipients)} />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* ── Left: recipients ─────────────────────────────────────────── */}
        <div className="lg:col-span-4">
          <label className="block">
            <span className="text-sm font-medium">Recipients</span>
            <textarea
              value={list}
              onChange={(event) => {
                setList(event.target.value);
                setConfirming(false);
              }}
              rows={18}
              spellCheck={false}
              placeholder={"jane@acme.com\nRavi Kumar <ravi@startup.in>\nalex@company.com, Alex"}
              aria-invalid={invalid.length > 0 || errors.recipients ? true : undefined}
              className={`${inputClass} resize-y font-mono leading-6`}
            />
          </label>
          <p className="mt-2 text-xs text-mist">
            One per line. Add a name as <code className="font-mono">Name &lt;email&gt;</code> or{" "}
            <code className="font-mono">email, Name</code> to use {"{{name}}"}.
          </p>

          <div className="mt-4 rounded-2xl border border-line bg-white p-4 text-sm">
            <p className="flex items-baseline justify-between">
              <span className="font-medium">
                {recipients.length} recipient{recipients.length === 1 ? "" : "s"}
              </span>
              <span className={`font-mono text-xs ${tooMany ? "text-danger" : "text-mist"}`}>
                max {MAX_RECIPIENTS}
              </span>
            </p>
            {duplicates > 0 ? <p className="mt-1 text-xs text-mist">{duplicates} duplicate(s) skipped.</p> : null}
            {invalid.length > 0 ? (
              <div className="mt-2 text-xs text-danger">
                <p>Fix or remove these lines:</p>
                <ul className="mt-1 list-inside list-disc font-mono">
                  {invalid.slice(0, 8).map((line, index) => (
                    <li key={index} className="truncate">
                      {line}
                    </li>
                  ))}
                  {invalid.length > 8 ? <li>and {invalid.length - 8} more</li> : null}
                </ul>
              </div>
            ) : null}
            {tooMany ? (
              <p className="mt-2 text-xs text-danger">Split the list: send at most {MAX_RECIPIENTS} at a time.</p>
            ) : null}
            {errors.recipients ? <p className="mt-2 text-xs text-danger">{errors.recipients}</p> : null}
          </div>
        </div>

        {/* ── Right: template ──────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-8">
          <Field label="Subject" error={errors.subject}>
            <input
              name="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={200}
              placeholder="Quick idea for {{name}}'s team"
              aria-invalid={errors.subject ? true : undefined}
              className={inputClass}
            />
          </Field>

          <Field
            label="Message"
            hint="Plain text. Blank lines become paragraphs, links become clickable. {{name}} and {{email}} are filled per recipient."
            error={errors.body}
          >
            <textarea
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={14}
              maxLength={20_000}
              placeholder={"Hi {{name}},\n\n...\n\nBest,\nTeam Statin\nhttps://statin.io"}
              aria-invalid={errors.body ? true : undefined}
              className={`${inputClass} resize-y leading-6`}
            />
          </Field>

          <div className="rounded-3xl border border-line bg-paper-deep p-5">
            <p className="t-eyebrow text-mist">
              Preview{recipients[0] ? ` · ${recipients[0].name || recipients[0].email}` : ""}
            </p>
            <div className="mt-4 rounded-2xl border border-line bg-white p-5">
              <p className="text-xs text-mist">Subject</p>
              <p className="font-medium">{fill(subject, recipients[0]) || "—"}</p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
                {fill(body, recipients[0]) || "Your message appears here."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions & results ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <button
          type="submit"
          name="intent"
          value="test"
          onClick={() => setIntent("test")}
          disabled={pending || subject.trim() === "" || body.trim().length < 10}
          className="inline-flex h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-sm font-medium transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send test to me
        </button>

        {confirming ? (
          <>
            <button
              type="submit"
              name="intent"
              value="send"
              onClick={() => setIntent("send")}
              disabled={pending || !canSend}
              className="inline-flex h-11 items-center justify-center rounded-full bg-danger px-6 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-70"
            >
              {pending && intent === "send" ? `Sending to ${recipients.length}…` : `Yes, send to ${recipients.length}`}
            </button>
            {!pending ? (
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex h-11 items-center rounded-full px-4 text-sm text-mist hover:text-ink"
              >
                Cancel
              </button>
            ) : null}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={pending || !canSend}
            className="inline-flex h-11 items-center justify-center rounded-full bg-cobalt px-6 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send to {recipients.length} recipient{recipients.length === 1 ? "" : "s"}
          </button>
        )}

        {pending && intent === "test" ? <span className="text-sm text-mist">Sending test…</span> : null}
      </div>

      {state.message ? (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      {state.results ? (
        <div role="status" className="rounded-3xl border border-line bg-white p-5">
          <p className="font-medium">
            {state.test ? "Test: " : ""}
            {state.sent} sent
            {state.failed ? <span className="text-danger"> · {state.failed} failed</span> : null}
          </p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {state.results.map((result) => (
              <li key={result.email} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                <span className="font-mono">{result.email}</span>
                {result.status === "sent" ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Sent</span>
                ) : (
                  <span className="text-xs text-danger">Failed: {result.error}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
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
