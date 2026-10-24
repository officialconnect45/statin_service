"use client";

import type { SentEmailRecord } from "@statin/types";
import { useDeferredValue, useMemo, useState } from "react";
import { ChevronIcon } from "@/components/ui/icons";

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "Unknown date" : dateFormat.format(date);
}

const kindLabels: Record<SentEmailRecord["kind"], string> = {
  outreach: "Outreach",
  test: "Test",
  system: "System",
};

export function SentEmailsList({ emails }: { emails: SentEmailRecord[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return emails.filter((email) => {
      if (kind !== "all" && email.kind !== kind) return false;
      if (!needle) return true;
      return (
        email.subject.toLowerCase().includes(needle) ||
        email.body.toLowerCase().includes(needle) ||
        email.recipients.some((recipient) => recipient.email.includes(needle))
      );
    });
  }, [emails, kind, deferredQuery]);

  if (emails.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="text-lg font-medium">No emails sent yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-mist">Emails sent from Outreach will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Search sent mail</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subject, message, or recipient email"
            className="h-11 w-full rounded-full border border-line bg-white px-5 text-sm outline-none transition-colors focus:border-cobalt focus:ring-1 focus:ring-cobalt"
          />
        </label>
        <label>
          <span className="sr-only">Filter by type</span>
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            className="h-11 w-full rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt sm:w-56"
          >
            <option value="all">All types</option>
            <option value="outreach">Outreach</option>
            <option value="test">Tests</option>
            <option value="system">System</option>
          </select>
        </label>
      </div>

      <p className="mt-5 text-sm text-mist" aria-live="polite">
        Showing {filtered.length} of {emails.length} send{emails.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-white px-6 py-10 text-center text-sm text-mist">
          No sends match these filters.
        </p>
      ) : (
        <ul className="mt-4 overflow-hidden rounded-3xl border border-line bg-white">
          {filtered.map((email) => (
            <li key={email.id} className="border-b border-line last:border-b-0">
              <details className="group">
                <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-paper md:grid-cols-[150px_1.6fr_1fr_auto] md:gap-6 md:px-6 [&::-webkit-details-marker]:hidden">
                  <time
                    dateTime={email.at}
                    suppressHydrationWarning
                    className="order-3 col-span-2 font-mono text-[11px] text-mist md:order-none md:col-span-1"
                  >
                    {formatDate(email.at)}
                  </time>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{email.subject}</span>
                    <span className="block truncate text-sm text-mist">
                      {email.recipients.length === 1
                        ? email.recipients[0].email
                        : `${email.recipients.length} recipients`}
                    </span>
                  </span>
                  <span className="order-4 col-span-2 flex flex-wrap items-center gap-2 md:order-none md:col-span-1">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        email.kind === "test" ? "bg-ink/5 text-mist" : "bg-cobalt/10 text-cobalt"
                      }`}
                    >
                      {kindLabels[email.kind]}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {email.sent} sent
                    </span>
                    {email.failed > 0 ? (
                      <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                        {email.failed} failed
                      </span>
                    ) : null}
                    {email.pending > 0 ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        {email.pending} not sent
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className="row-start-1 inline-flex h-8 w-8 items-center justify-center justify-self-end rounded-full border border-line transition-transform group-open:rotate-180 md:row-start-auto"
                  >
                    <ChevronIcon className="h-3 w-3" />
                  </span>
                </summary>
                <div className="grid gap-6 border-t border-line bg-paper px-5 py-6 md:grid-cols-[1fr_360px] md:px-6">
                  <div className="min-w-0">
                    <p className="t-eyebrow text-mist">Message</p>
                    <p className="mt-3 text-[15px] leading-relaxed break-words whitespace-pre-wrap text-ink-soft">
                      {email.body}
                    </p>
                    <p className="mt-5 text-xs text-mist">
                      From {email.from}
                      {email.sentBy ? ` · sent by ${email.sentBy}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="t-eyebrow text-mist">Recipients ({email.recipients.length})</p>
                    <ol className="mt-3 max-h-[420px] divide-y divide-line overflow-auto rounded-2xl border border-line bg-white text-sm">
                      {email.recipients.map((recipient, index) => (
                        <li key={`${recipient.email}-${index}`} className="px-3 py-2">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="min-w-0 truncate font-mono text-xs">
                              <span className="mr-2 inline-block w-5 text-right text-mist">{index + 1}</span>
                              {recipient.email}
                            </span>
                            {recipient.status === "sent" ? (
                              <span className="shrink-0 text-xs font-medium text-emerald-700">Sent</span>
                            ) : recipient.status === "failed" ? (
                              <span className="shrink-0 text-xs font-medium text-danger">Failed</span>
                            ) : (
                              <span className="shrink-0 text-xs font-medium text-amber-700">Not sent</span>
                            )}
                          </div>
                          {recipient.error ? (
                            <p className="mt-1 pl-7 text-xs break-words text-danger">{recipient.error}</p>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
