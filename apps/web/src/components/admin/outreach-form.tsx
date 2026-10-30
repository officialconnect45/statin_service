"use client";

import {
  useActionState,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type ReactNode,
} from "react";
import type { MailTemplateRecord } from "@statin/types";
import Link from "next/link";
import { sendOutreach, type OutreachFormState } from "@/app/admin/outreach/actions";
import { OutreachMailPreview } from "@/components/admin/outreach-mail-preview";
import { OutreachTemplatePicker } from "@/components/admin/outreach-template-picker";

// Must match MAX_RECIPIENTS in apps/api/src/routes/outreach.ts
const MAX_RECIPIENTS = 50;
const EMAIL_IN_TEXT = /[^\s@<>,;:"'()[\]]+@[^\s@<>,;:"'()[\]]+\.[^\s@<>,;:"'()[\]]+/g;
const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

const UPLOAD_ACCEPT = ".xlsx,.csv,.txt";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Every cell of every sheet (xlsx) or the whole text (csv/txt), as one string to search for emails. */
async function readUpload(file: File) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx")) {
    const { default: readXlsxFile } = await import("read-excel-file/browser");
    const sheets = await readXlsxFile(file);
    return sheets
      .flatMap((sheet) => sheet.data.flatMap((row) => row.map((cell) => (cell == null ? "" : String(cell)))))
      .join("\n");
  }
  if (name.endsWith(".csv") || name.endsWith(".txt")) return file.text();
  throw new Error(name.endsWith(".xls") ? "Old .xls files are not supported. Save it as .xlsx or .csv." : "Upload an .xlsx, .csv or .txt file.");
}

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

export function OutreachForm({
  templates = [],
  senderFrom,
}: {
  templates?: MailTemplateRecord[];
  /** "Name <address>" outreach goes out as, shown in the preview. */
  senderFrom?: string;
}) {
  const [view, setView] = useState<"write" | "preview">("write");
  const messageSection = useRef<HTMLDivElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);
  const [state, action, pending] = useActionState(sendOutreach, initialState);
  const [list, setList] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("");
  // Confirm step belongs to one run; it closes by itself once that send finishes.
  const [confirmRun, setConfirmRun] = useState<number | null>(null);
  const [intent, setIntent] = useState<"test" | "send">("send");
  const confirming = confirmRun === (state.run ?? 0);
  const setConfirming = (open: boolean) => setConfirmRun(open ? (state.run ?? 0) : null);
  const gutter = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [reading, setReading] = useState(false);

  // After a real send, empty the form for the next batch. If some addresses
  // failed, only those stay in the list (with the same subject and message) so
  // they can be retried. Test sends leave the form as it is.
  const [handledRun, setHandledRun] = useState(state.run);
  if (state.run !== handledRun) {
    setHandledRun(state.run);
    if (state.results && !state.test) {
      const failed = state.results.filter((result) => result.status === "failed").map((result) => result.email);
      setList(failed.join("\n"));
      setUpload(null);
      if (failed.length === 0) {
        setSubject("");
        setBody("");
        setTemplateId("");
        setView("write");
      }
    }
  }

  const { lines, recipients } = useMemo(() => checkLines(list), [list]);
  const invalid = lines.filter((line) => line.status === "invalid").length;
  const duplicates = lines.filter((line) => line.status === "duplicate").length;
  const errors = state.errors ?? {};
  const tooMany = recipients.length > MAX_RECIPIENTS;
  const canSend =
    recipients.length > 0 && invalid === 0 && duplicates === 0 && !tooMany && subject.trim() !== "" && body.trim().length >= 10;

  // Picking a template fills subject and message; both stay editable. Asks
  // first if that would replace text the admin already wrote.
  // "Write manually" (empty id) clears both fields. Asks first only when that
  // would throw away text the admin typed or edited themselves.
  function applyTemplate(id: string) {
    const current = templates.find((item) => item.id === templateId);
    const next = templates.find((item) => item.id === id);
    const hasText = subject.trim() !== "" || body.trim() !== "";
    const edited = hasText && (!current || subject !== current.subject || body !== current.body);
    if (edited) {
      const question = next
        ? "Replace your subject and message with this template?"
        : "Clear your edited subject and message?";
      if (!window.confirm(question)) return;
    }
    setTemplateId(next ? id : "");
    setSubject(next?.subject ?? "");
    setBody(next?.body ?? "");
    setConfirming(false);
  }

  function showPreview(scroll = false) {
    setView("preview");
    if (scroll) messageSection.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showEditor() {
    setView("write");
    // The textarea is hidden, not unmounted, so it can take focus right away.
    requestAnimationFrame(() => messageInput.current?.focus());
  }

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

  // Pulls every email address out of an uploaded sheet and adds it to the list.
  async function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // choosing the same file again should re-read it
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setUpload({ tone: "error", text: "That file is over 5 MB." });
      return;
    }

    setReading(true);
    try {
      const found = [...new Set((await readUpload(file)).match(EMAIL_IN_TEXT)?.map((email) => email.toLowerCase()) ?? [])];
      if (found.length === 0) {
        setUpload({ tone: "error", text: `No email addresses found in ${file.name}.` });
        return;
      }
      const before = checkLines(list).recipients.length;
      const merged = normalizeList(`${list}\n${found.join("\n")}`);
      const added = checkLines(merged).recipients.length - before;
      updateList(merged);
      const skipped = found.length - added;
      setUpload({
        tone: "ok",
        text: `Added ${added} email${added === 1 ? "" : "s"} from ${file.name}${skipped > 0 ? ` (${skipped} already in the list)` : ""}.`,
      });
    } catch (error) {
      console.error("[outreach] Could not read upload:", error);
      setUpload({
        tone: "error",
        text: error instanceof Error && /supported|Upload an/.test(error.message) ? error.message : `Could not read ${file.name}.`,
      });
    } finally {
      setReading(false);
    }
  }

  return (
    <form action={action} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* ── Left: recipients ─────────────────────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="outreach-recipients" className="text-sm font-medium">
              Recipient emails
            </label>
            <div className="flex items-center gap-2">
              {list.trim() ? (
                <button
                  type="button"
                  onClick={() => {
                    updateList("");
                    setUpload(null);
                  }}
                  className="text-xs text-mist hover:text-ink"
                >
                  Clear
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={reading || pending}
                className="inline-flex h-8 items-center rounded-full border border-ink/15 px-3.5 text-xs font-medium transition-colors hover:border-ink disabled:cursor-wait disabled:opacity-60"
              >
                {reading ? "Reading…" : "Upload Excel / CSV"}
              </button>
              <input ref={fileInput} type="file" accept={UPLOAD_ACCEPT} onChange={onUpload} className="hidden" />
            </div>
          </div>
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
            One email per line. Paste a list from anywhere, or upload an .xlsx / .csv file: every email address in
            it is picked up, from any column or sheet.
          </p>
          {upload ? (
            <p role="status" className={`mt-2 text-xs ${upload.tone === "error" ? "text-danger" : "text-emerald-700"}`}>
              {upload.text}
            </p>
          ) : null}

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
          <OutreachTemplatePicker templates={templates} selectedId={templateId} onSelect={applyTemplate} />

          <Field label="Subject" error={errors.subject} aside={<Counter value={subject.length} max={200} />}>
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

          <div ref={messageSection} className="scroll-mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="outreach-body" className="text-sm font-medium">
                Message
              </label>
              <div
                role="tablist"
                aria-label="Message view"
                className="inline-flex rounded-full border border-line bg-white p-0.5"
              >
                {(
                  [
                    ["write", "Write"],
                    ["preview", "Preview"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={view === id}
                    onClick={() => (id === "write" ? showEditor() : showPreview())}
                    className={`h-8 rounded-full px-4 text-xs font-medium transition-colors ${
                      view === id ? "bg-cobalt text-white" : "text-mist hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hidden rather than removed in preview, so the message is still sent with the form. */}
            <textarea
              id="outreach-body"
              ref={messageInput}
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              onKeyDown={(event) => {
                // Ctrl/Cmd + Enter jumps to the preview.
                if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault();
                  showPreview();
                }
              }}
              rows={14}
              maxLength={20_000}
              placeholder={"Hi,\n\n...\n\nBest,\nTeam Statin\nhttps://statin.io"}
              aria-invalid={errors.body ? true : undefined}
              className={`${inputClass} resize-y leading-6 ${view === "preview" ? "hidden" : ""}`}
            />

            {view === "preview" ? (
              <div className="mt-2">
                <OutreachMailPreview
                  from={senderFrom}
                  recipients={recipients}
                  subject={subject}
                  body={body}
                  onEdit={showEditor}
                />
              </div>
            ) : null}

            {errors.body ? (
              <p className="mt-2 text-xs text-danger">{errors.body}</p>
            ) : (
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs text-mist">
                <span>
                  {view === "write"
                    ? "Plain text. Blank lines become paragraphs, links become clickable. Ctrl + Enter to preview."
                    : "This is how each recipient sees the email."}
                </span>
                <span className="font-mono">
                  {wordCount(body)} words · <Counter value={body.length} max={20_000} min={10} />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Actions & results ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => (view === "preview" ? showEditor() : showPreview(true))}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 text-sm
           font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white"
        >
          {view === "preview" ? "Back to editing" : "Preview email"}
        </button>

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
              className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-70"
            >
              {pending && intent === "send" ? `Sending to ${recipients.length}…` : `Yes, send to ${recipients.length}`}
            </button>
            {!pending ? (
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex h-11 items-center rounded-full px-4 text-sm text-mist transition-colors hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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
          <p className="flex flex-wrap items-baseline justify-between gap-2 font-medium">
            <span>
              {state.test ? "Test: " : ""}
              {state.sent} sent
              {state.failed ? <span className="text-danger"> · {state.failed} failed</span> : null}
            </span>
            <Link href="/admin/emails" className="text-sm font-normal text-cobalt hover:underline">
              View in Sent mail
            </Link>
          </p>
          {!state.test ? (
            <p className="mt-1 text-xs text-mist">
              {state.failed
                ? "The failed addresses are back in the list with the same message, ready to retry."
                : "The form is cleared for the next batch."}
            </p>
          ) : null}
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

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** "120 / 200", turning amber near the limit and red when under the minimum. */
function Counter({ value, max, min = 0 }: { value: number; max: number; min?: number }) {
  const tone = value > 0 && value < min ? "text-danger" : value >= max * 0.9 ? "text-amber-600" : "text-mist";
  return (
    <span className={`font-mono text-xs ${tone}`}>
      {value.toLocaleString()} / {max.toLocaleString()}
    </span>
  );
}

function Field({
  label,
  hint,
  error,
  aside,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        {aside}
      </span>
      {children}
      {error ? (
        <span className="mt-2 block text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="mt-2 block text-xs text-mist">{hint}</span>
      ) : null}
    </label>
  );
}
