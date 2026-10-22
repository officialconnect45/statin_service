"use client";

import {
  useActionState,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type ReactNode,
} from "react";
import { sendOutreach, type OutreachFormState } from "@/app/admin/outreach/actions";

// Must match MAX_RECIPIENTS in apps/api/src/routes/outreach.ts
const MAX_RECIPIENTS = 30;
const EMAIL_IN_TEXT = /[^\s@<>,;:"'()[\]]+@[^\s@<>,;:"'()[\]]+\.[^\s@<>,;:"'()[\]]+/g;
const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

const initialState: OutreachFormState = {};

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-mist/70 focus:border-cobalt focus:ring-1 focus:ring-cobalt aria-invalid:border-danger";

/**
 * Rewrites the list as one email per line: any line holding addresses is
 * replaced by just those addresses (names, commas, brackets dropped),
 * duplicates and blank lines are removed, and lines with no address are kept
 * so they can be fixed.
 */
function normalizeList(text: string) {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const found = line.match(EMAIL_IN_TEXT);
    for (const item of found ? found.map((email) => email.toLowerCase()) : [line]) {
      if (seen.has(item)) continue;
      seen.add(item);
      lines.push(item);
    }
  }
  return lines.join("\n");
}

type Line = { text: string; status: "ok" | "invalid" | "duplicate" | "blank" };

function checkLines(text: string) {
  const seen = new Set<string>();
  const lines: Line[] = text.split(/\r?\n/).map((raw) => {
    const value = raw.trim().toLowerCase();
    if (!value) return { text: raw, status: "blank" };
    if (!EMAIL.test(value)) return { text: raw, status: "invalid" };
    if (seen.has(value)) return { text: raw, status: "duplicate" };
    seen.add(value);
    return { text: raw, status: "ok" };
  });
  return { lines, recipients: [...seen] };
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
  const gutter = useRef<HTMLDivElement>(null);

  const { lines, recipients } = useMemo(() => checkLines(list), [list]);
  const invalid = lines.filter((line) => line.status === "invalid").length;
  const duplicates = lines.filter((line) => line.status === "duplicate").length;
  const errors = state.errors ?? {};
  const tooMany = recipients.length > MAX_RECIPIENTS;
  const canSend =
    recipients.length > 0 && invalid === 0 && duplicates === 0 && !tooMany && subject.trim() !== "" && body.trim().length >= 10;

  function updateList(value: string) {
    setList(value);
    setConfirming(false);
  }

  // Pasted text (a column from a sheet, a comma list, an email signature...)
  // lands as one address per line.
  function onPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const pasted = event.clipboardData.getData("text");
    const emails = pasted.match(EMAIL_IN_TEXT);
    if (!emails) return;
    event.preventDefault();
    const field = event.currentTarget;
    const before = list.slice(0, field.selectionStart);
    const after = list.slice(field.selectionEnd);
    updateList(normalizeList(`${before}\n${emails.join("\n")}\n${after}`));
  }

  return (
    <form action={action} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* ── Left: recipients ─────────────────────────────────────────── */}
        <div className="lg:col-span-4">
          <label htmlFor="outreach-recipients" className="text-sm font-medium">
            Recipient emails
          </label>
          <div
            className={`mt-2 flex overflow-hidden rounded-xl border bg-white transition-colors focus-within:border-cobalt focus-within:ring-1 focus-within:ring-cobalt ${
              invalid > 0 || duplicates > 0 || errors.recipients ? "border-danger" : "border-line"
            }`}
          >
            <div
              ref={gutter}
              aria-hidden="true"
              className="h-[434px] shrink-0 overflow-hidden border-r border-line bg-paper py-3 text-right font-mono text-xs leading-6 text-mist select-none"
            >
              {lines.map((line, index) => (
                <div
                  key={index}
                  className={`px-2.5 ${line.status === "invalid" || line.status === "duplicate" ? "bg-danger/10 text-danger" : ""}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <textarea
              id="outreach-recipients"
              name="recipients"
              value={list}
              onChange={(event) => updateList(event.target.value)}
              onPaste={onPaste}
              onBlur={() => {
                const cleaned = normalizeList(list);
                if (cleaned !== list) updateList(cleaned);
              }}
              onScroll={(event) => {
                if (gutter.current) gutter.current.scrollTop = event.currentTarget.scrollTop;
              }}
              wrap="off"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder={"jane@acme.com\nravi@startup.in\nalex@company.com"}
              aria-invalid={invalid > 0 || duplicates > 0 || errors.recipients ? true : undefined}
              className="h-[434px] min-w-0 flex-1 resize-none overflow-auto bg-transparent px-3 py-3 font-mono text-sm leading-6 whitespace-pre outline-none placeholder:text-mist/70"
            />
          </div>
          <p className="mt-2 text-xs text-mist">
            One email per line. Paste a list from anywhere; it is split into lines automatically.
          </p>

          <div className="mt-4 rounded-2xl border border-line bg-white p-4 text-sm">
            <p className="flex items-baseline justify-between">
              <span className="font-medium">
                {recipients.length} recipient{recipients.length === 1 ? "" : "s"}
              </span>
              <span className={`font-mono text-xs ${tooMany ? "text-danger" : "text-mist"}`}>max {MAX_RECIPIENTS}</span>
            </p>
            {invalid > 0 ? (
              <p className="mt-2 text-xs text-danger">
                Fix the red line{invalid === 1 ? "" : "s"} (
                {lines.flatMap((line, index) => (line.status === "invalid" ? [index + 1] : [])).join(", ")}): not a valid
                email.
              </p>
            ) : null}
            {duplicates > 0 ? (
              <p className="mt-2 text-xs text-danger">
                {duplicates} duplicate{duplicates === 1 ? "" : "s"}. Click outside the list to remove.
              </p>
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
              placeholder="Quick idea for your team"
              aria-invalid={errors.subject ? true : undefined}
              className={inputClass}
            />
          </Field>

          <Field
            label="Message"
            hint="Plain text, sent exactly as written to every recipient. Blank lines become paragraphs, links become clickable."
            error={errors.body}
          >
            <textarea
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={14}
              maxLength={20_000}
              placeholder={"Hi,\n\n...\n\nBest,\nTeam Statin\nhttps://statin.io"}
              aria-invalid={errors.body ? true : undefined}
              className={`${inputClass} resize-y leading-6`}
            />
          </Field>

          <div className="rounded-3xl border border-line bg-paper-deep p-5">
            <p className="t-eyebrow text-mist">Preview</p>
            <div className="mt-4 rounded-2xl border border-line bg-white p-5">
              <p className="text-xs text-mist">Subject</p>
              <p className="font-medium">{subject || "—"}</p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
                {body || "Your message appears here."}
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
          <ol className="mt-3 divide-y divide-line text-sm">
            {state.results.map((result, index) => (
              <li key={result.email} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
                <span className="font-mono">
                  <span className="mr-3 inline-block w-6 text-right text-mist">{index + 1}</span>
                  {result.email}
                </span>
                {result.status === "sent" ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Sent</span>
                ) : (
                  <span className="text-xs text-danger">Failed: {result.error}</span>
                )}
              </li>
            ))}
          </ol>
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
