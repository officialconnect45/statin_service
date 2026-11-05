"use client";

import { useActionState, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import type { MailTemplateRecord } from "@statin/types";
import Link from "next/link";
import { sendOutreach, type OutreachFormState } from "@/app/admin/outreach/actions";
import {
  boldShortcut,
  MAIL_FONT,
  MAIL_FONT_SIZE,
  MAIL_LINE_HEIGHT,
  MAIL_TEXT_COLOR,
  pasteKeepingBold,
} from "@/components/admin/mail-body";
import { OutreachMailPreview } from "@/components/admin/outreach-mail-preview";
import { EMAIL_IN_TEXT, fillVariables, parseSheet, variablesIn, type Row } from "@/components/admin/outreach-sheet";
import { OutreachTemplatePicker } from "@/components/admin/outreach-template-picker";

// The action sends in chunks of 50 (the API's per-request limit), so one click can cover many chunks.
const MAX_RECIPIENTS = 500;

const UPLOAD_ACCEPT = ".xlsx,.csv,.txt";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Every row of every sheet (xlsx, tab-separated) or the text as-is (csv/txt). */
async function readUpload(file: File) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx")) {
    const { default: readXlsxFile } = await import("read-excel-file/browser");
    const sheets = await readXlsxFile(file);
    return sheets
      .flatMap((sheet) => sheet.data.map((row) => row.map((cell) => (cell == null ? "" : String(cell))).join("\t")))
      .join("\n");
  }
  if (name.endsWith(".csv") || name.endsWith(".txt")) return file.text();
  throw new Error(name.endsWith(".xls") ? "Old .xls files are not supported. Save it as .xlsx or .csv." : "Upload an .xlsx, .csv or .txt file.");
}

const initialState: OutreachFormState = {};

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-mist/70 focus:border-cobalt focus:ring-1 focus:ring-cobalt aria-invalid:border-danger";

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
  // Emails in one box, and one box per template variable. Line i of every box belongs to the same recipient.
  const [emailText, setEmailText] = useState("");
  const [valueTexts, setValueTexts] = useState<Record<string, string>>({});
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("");
  // Confirm step belongs to one run; it closes by itself once that send finishes.
  const [confirmRun, setConfirmRun] = useState<number | null>(null);
  const [intent, setIntent] = useState<"test" | "send">("send");
  const confirming = confirmRun === (state.run ?? 0);
  const setConfirming = (open: boolean) => setConfirmRun(open ? (state.run ?? 0) : null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [reading, setReading] = useState(false);

  // Variables come from the template: every {{name}} in the subject or message needs a value per recipient.
  const variableNames = useMemo(() => variablesIn(subject, body), [subject, body]);
  const { rows, invalid, duplicates, extra } = useMemo(
    () => pairRows(emailText, valueTexts, variableNames),
    [emailText, valueTexts, variableNames],
  );
  const incomplete = rows.filter((row) => variableNames.some((name) => !row.values[name]?.trim()));
  const tooMany = rows.length > MAX_RECIPIENTS;
  const hasProblems = invalid.length > 0 || incomplete.length > 0 || extra.length > 0 || tooMany;
  const sample = Object.fromEntries(variableNames.map((name) => [name, rows[0]?.values[name] || `[${name}]`]));
  const errors = state.errors ?? {};
  const canSend = rows.length > 0 && !hasProblems && subject.trim() !== "" && body.trim().length >= 10;

  // After a real send, empty the form for the next batch. If some addresses
  // failed, only those stay in the list (with the same subject and message) so
  // they can be retried. Test sends leave the form as it is.
  const [handledRun, setHandledRun] = useState(state.run);
  if (state.run !== handledRun) {
    setHandledRun(state.run);
    if (state.results && !state.test) {
      const failed = new Set(state.results.filter((result) => result.status === "failed").map((result) => result.email));
      setLists(rows.filter((row) => failed.has(row.email)));
      setUpload(null);
      if (failed.size === 0) {
        setSubject("");
        setBody("");
        setTemplateId("");
        setView("write");
      }
    }
  }

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

  // Writes rows back into the boxes: line i of each box is the same recipient.
  function setLists(next: Row[]) {
    setEmailText(next.map((row) => row.email).join("\n"));
    setValueTexts(Object.fromEntries(variableNames.map((name) => [name, next.map((row) => row.values[name] ?? "").join("\n")])));
    setConfirming(false);
  }

  function changeEmails(value: string) {
    setEmailText(value);
    setConfirming(false);
  }

  function changeValues(name: string, value: string) {
    setValueTexts((current) => ({ ...current, [name]: value }));
    setConfirming(false);
  }

  // Adds the rows of an uploaded sheet: its email column and variable columns land in their own boxes.
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
      const found = parseSheet((await readUpload(file)).replace(/\r\n/g, "\n"), variableNames).rows;
      const known = new Set(rows.map((row) => row.email));
      const added = found.filter((row) => !known.has(row.email));
      if (added.length === 0) {
        setUpload({ tone: "error", text: `No new email addresses found in ${file.name}.` });
        return;
      }
      setLists([...rows, ...added]);
      setUpload({ tone: "ok", text: `Added ${added.length} recipient${added.length === 1 ? "" : "s"} from ${file.name}.` });
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

  const columns = ["email", ...variableNames];

  return (
    <form action={action} className="space-y-8">
      {/* The parsed rows are what gets sent: emails and variable values always travel together. */}
      <input type="hidden" name="rows" value={JSON.stringify(rows)} />
      <div className="grid gap-8 lg:grid-cols-12">
        {/* ── Left: recipients ─────────────────────────────────────────── */}
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="outreach-recipients" className="text-sm font-medium">
              Recipients
            </label>
            <div className="flex items-center gap-2">
              {emailText.trim() || Object.values(valueTexts).some((value) => value.trim()) ? (
                <button
                  type="button"
                  onClick={() => {
                    setEmailText("");
                    setValueTexts({});
                    setConfirming(false);
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
          <div className="mt-3 space-y-4">
            <FieldList
              id="outreach-recipients"
              label="Email"
              required
              value={emailText}
              onChange={changeEmails}
              placeholder={"jane@acme.com\nravi@startup.in\nalex@company.com"}
              invalid={invalid.length > 0 || !!errors.recipients}
              note={`${countLines(emailText)} lines`}
            />
            {variableNames.map((name) => (
              <FieldList
                key={name}
                id={`outreach-var-${name}`}
                label={name}
                hint={`{{${name}}}`}
                required
                value={valueTexts[name] ?? ""}
                onChange={(value) => changeValues(name, value)}
                placeholder={`${name} for each email, same order`}
                invalid={extra.includes(name) || rows.some((row) => !row.values[name]?.trim())}
                note={`${countLines(valueTexts[name] ?? "")} lines`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-mist">
            {variableNames.length > 0
              ? `Paste each column into its own box: line 1 of every box is the same recipient. Or upload a sheet with email${variableNames.map((n) => `, ${n}`).join("")} columns.`
              : "One email per line. Paste a list from anywhere, or upload an .xlsx / .csv file. Add {{name}} to the template to personalise each email."}
          </p>
          {upload ? (
            <p role="status" className={`mt-2 text-xs ${upload.tone === "error" ? "text-danger" : "text-emerald-700"}`}>
              {upload.text}
            </p>
          ) : null}

          {rows.length > 0 ? (
            <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-line bg-white">
              <table className="w-full min-w-max text-left text-xs">
                <thead className="sticky top-0 bg-paper text-mist">
                  <tr>
                    <th className="px-3 py-2 font-medium">#</th>
                    {columns.map((name) => (
                      <th key={name} className="px-3 py-2 font-medium">
                        {name}
                        {name !== "email" ? <span className="text-danger"> *</span> : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line font-mono">
                  {rows.map((row, index) => (
                    <tr key={row.email}>
                      <td className="px-3 py-1.5 text-mist">{index + 1}</td>
                      <td className="px-3 py-1.5">{row.email}</td>
                      {variableNames.map((name) => (
                        <td
                          key={name}
                          className={`px-3 py-1.5 ${row.values[name]?.trim() ? "" : "bg-danger/10 text-danger"}`}
                        >
                          {row.values[name]?.trim() || "missing"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-line bg-white p-4 text-sm">
            <p className="flex items-baseline justify-between">
              <span className="font-medium">
                {rows.length} recipient{rows.length === 1 ? "" : "s"}
              </span>
              <span className={`font-mono text-xs ${tooMany ? "text-danger" : "text-mist"}`}>max {MAX_RECIPIENTS}</span>
            </p>
            {rows.length > 50 ? (
              <p className="mt-2 text-xs text-mist">Sent in {Math.ceil(rows.length / 50)} batches of up to 50, one after another.</p>
            ) : null}
            {invalid.length > 0 ? (
              <p className="mt-2 text-xs text-danger">
                Line{invalid.length === 1 ? "" : "s"} {invalid.join(", ")}: no valid email address.
              </p>
            ) : null}
            {incomplete.length > 0 ? (
              <p className="mt-2 text-xs text-danger">
                {incomplete.length} recipient{incomplete.length === 1 ? " is" : "s are"} missing a required value (first:{" "}
                {incomplete[0].email}).
              </p>
            ) : null}
            {duplicates > 0 ? (
              <p className="mt-2 text-xs text-mist">
                {duplicates} duplicate{duplicates === 1 ? "" : "s"} skipped.
              </p>
            ) : null}
            {extra.length > 0 ? (
              <p className="mt-2 text-xs text-danger">
                More values than emails in {extra.join(", ")}: line 1 of every box must be the same recipient.
              </p>
            ) : null}
            {tooMany ? (
              <p className="mt-2 text-xs text-danger">Split the list: send at most {MAX_RECIPIENTS} at a time.</p>
            ) : null}
            {errors.recipients ? <p className="mt-2 text-xs text-danger">{errors.recipients}</p> : null}
            {errors.variables ? <p className="mt-2 text-xs text-danger">{errors.variables}</p> : null}
          </div>
        </div>

        {/* ── Right: template ──────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-7">
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
              onPaste={(event) => pasteKeepingBold(event, body, setBody)}
              onKeyDown={(event) => {
                // Ctrl/Cmd + Enter jumps to the preview.
                if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault();
                  showPreview();
                  return;
                }
                boldShortcut(event, body, setBody);
              }}
              rows={14}
              maxLength={20_000}
              placeholder={"Hi,\n\n...\n\nBest,\nTeam Statin\nhttps://statin.io"}
              aria-invalid={errors.body ? true : undefined}
              style={{
                fontFamily: MAIL_FONT,
                fontSize: MAIL_FONT_SIZE,
                lineHeight: MAIL_LINE_HEIGHT,
                color: MAIL_TEXT_COLOR,
              }}
              className={`${inputClass} resize-y ${view === "preview" ? "hidden" : ""}`}
            />

            {view === "preview" ? (
              <div className="mt-2">
                <OutreachMailPreview
                  from={senderFrom}
                  recipients={rows.map((row) => row.email)}
                  subject={fillVariables(subject, sample)}
                  body={fillVariables(body, sample)}
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
                    ? "Plain text. **Text** or Ctrl + B for bold; pasted bold is kept. Blank lines become paragraphs, links become clickable. Ctrl + Enter to preview."
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
              {pending && intent === "send" ? `Sending to ${rows.length}…` : `Yes, send to ${rows.length}`}
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
            Send to {rows.length} recipient{rows.length === 1 ? "" : "s"}
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

const countLines = (text: string) => text.split(/\r?\n/).filter((line) => line.trim()).length;

/**
 * Pairs the boxes line by line: line i of the email box with line i of every
 * variable box. Blank cells keep their place, so a gap never shifts the rest.
 */
function pairRows(emailText: string, valueTexts: Record<string, string>, names: string[]) {
  const emailLines = emailText.split(/\r?\n/);
  const columns = Object.fromEntries(names.map((name) => [name, (valueTexts[name] ?? "").split(/\r?\n/)]));
  const rows: Row[] = [];
  const invalid: number[] = [];
  const seen = new Set<string>();
  let duplicates = 0;
  emailLines.forEach((raw, i) => {
    if (!raw.trim()) return;
    const email = raw.match(EMAIL_IN_TEXT)?.[0]?.toLowerCase();
    if (!email) {
      invalid.push(i + 1);
      return;
    }
    if (seen.has(email)) {
      duplicates++;
      return;
    }
    seen.add(email);
    rows.push({ email, values: Object.fromEntries(names.map((name) => [name, (columns[name][i] ?? "").trim()])) });
  });
  // Values on lines past the last email line belong to nobody.
  const extra = names.filter((name) => columns[name].slice(emailLines.length).some((cell) => cell.trim()));
  return { rows, invalid, duplicates, extra };
}

/** One of the paste boxes: the emails, or the values of one template variable. */
function FieldList({
  id,
  label,
  hint,
  required,
  value,
  onChange,
  placeholder,
  invalid,
  note,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
  note: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label} {required ? <span className="text-danger">*</span> : null}{" "}
          {hint ? <span className="font-mono text-xs font-normal text-mist">{hint}</span> : null}
        </label>
        <span className="font-mono text-xs text-mist">{note}</span>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        wrap="off"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={placeholder}
        aria-invalid={invalid ? true : undefined}
        className={`${inputClass} h-36 resize-y overflow-auto font-mono leading-6 whitespace-pre`}
      />
    </div>
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
