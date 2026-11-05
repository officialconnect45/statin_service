"use client";

import { useState, type ReactNode } from "react";
import {
  BOLD,
  LINKABLE,
  MAIL_FONT,
  MAIL_FONT_SIZE,
  MAIL_LINE_HEIGHT,
  MAIL_LINK_COLOR,
  MAIL_TEXT_COLOR,
  splitLink,
} from "@/components/admin/mail-body";

// Must match textToHtml in apps/api/src/mail.ts: paragraphs on blank lines,
// line breaks on single newlines, **text** bold, links and domains clickable.
function renderLinks(text: string, key: string) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINKABLE)) {
    const { url, trailing, href } = splitLink(match[0]);
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <a
        key={`${key}-${start}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="break-all underline"
        style={{ color: MAIL_LINK_COLOR }}
      >
        {url}
      </a>,
    );
    if (trailing) out.push(trailing);
    last = start + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function renderBlock(block: string, key: number) {
  const parts: ReactNode[] = [];
  block.split("\n").forEach((line, lineIndex) => {
    if (lineIndex > 0) parts.push(<br key={`br-${lineIndex}`} />);
    line.split(BOLD).forEach((segment, segmentIndex) => {
      const id = `${lineIndex}-${segmentIndex}`;
      // split() with a capture group puts the bold text at odd indexes.
      if (segmentIndex % 2 === 1) parts.push(<strong key={id}>{renderLinks(segment, id)}</strong>);
      else if (segment) parts.push(...renderLinks(segment, id));
    });
  });
  return (
    <p key={key} className="mb-4 last:mb-0">
      {parts}
    </p>
  );
}

/** A message body rendered the way the API sends it. */
export function MailBody({ body, empty }: { body: string; empty: string }) {
  const blocks = body.replace(/\r\n/g, "\n").trim().split(/\n{2,}/).filter(Boolean);
  return blocks.length > 0 ? blocks.map(renderBlock) : <p className="text-mist">{empty}</p>;
}

function initialsOf(from: string) {
  const name = from.replace(/<.*>/, "").trim() || from;
  return (name.match(/[A-Za-z0-9]/)?.[0] ?? "S").toUpperCase();
}

/**
 * The outreach email the way a recipient sees it in their inbox: sender,
 * recipient, subject, and the body rendered with the same rules as the API.
 */
export function OutreachMailPreview({
  from,
  recipients,
  subject,
  body,
  onEdit,
}: {
  from?: string;
  recipients: string[];
  subject: string;
  body: string;
  onEdit: () => void;
}) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const sender = from || "Statin <hello@statin.eu>";
  const to = recipients[0] ?? "recipient@example.com";
  const others = Math.max(0, recipients.length - 1);
  const missing = [!subject.trim() && "a subject", body.trim().length < 10 && "a message (10+ characters)"].filter(
    Boolean,
  );

  return (
    <div className="rounded-3xl border border-line bg-paper-deep p-3 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-xs text-mist">
          Each recipient gets their own copy{recipients.length > 1 ? ` (${recipients.length} emails)` : ""}.
        </p>
        <div role="group" aria-label="Preview size" className="inline-flex rounded-full border border-line bg-white p-0.5">
          {(["desktop", "mobile"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={device === option}
              onClick={() => setDevice(option)}
              className={`h-8 rounded-full px-3 text-xs font-medium capitalize transition-colors ${
                device === option ? "bg-ink text-white" : "text-mist hover:text-ink"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`mx-auto mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-[max-width] duration-300 ${
          device === "mobile" ? "max-w-[380px]" : "max-w-full"
        }`}
      >
        <div className="border-b border-line px-5 py-4">
          <p className={`font-medium ${device === "mobile" ? "text-base" : "text-lg"} ${subject.trim() ? "" : "text-mist"}`}>
            {subject.trim() || "(no subject)"}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cobalt text-sm font-semibold text-white">
              {initialsOf(sender)}
            </span>
            <div className="min-w-0 flex-1 text-xs">
              <p className="truncate">
                <span className="font-medium text-ink">{sender.replace(/\s*<.*>/, "") || sender}</span>{" "}
                <span className="text-mist">{sender.match(/<.*>/)?.[0] ?? ""}</span>
              </p>
              <p className="truncate text-mist">
                to {to}
                {others > 0 ? ` (+${others} more, sent separately)` : ""}
              </p>
            </div>
            <span className="shrink-0 text-xs text-mist">now</span>
          </div>
        </div>

        <div
          className="px-5 py-5"
          style={{
            fontFamily: MAIL_FONT,
            fontSize: MAIL_FONT_SIZE,
            lineHeight: MAIL_LINE_HEIGHT,
            color: MAIL_TEXT_COLOR,
          }}
        >
          <MailBody body={body} empty="Nothing written yet." />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className={`text-xs ${missing.length > 0 ? "text-danger" : "text-emerald-700"}`}>
          {missing.length > 0 ? `Still needs ${missing.join(" and ")}.` : "Looks ready to send."}
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-9 items-center rounded-full border border-ink/15 bg-white px-4 text-sm font-medium transition-colors hover:border-ink"
        >
          ← Back to editing
        </button>
      </div>
    </div>
  );
}
