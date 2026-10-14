"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ChevronIcon } from "@/components/ui/icons";

export type LeadRow = {
  id: string;
  at: string;
  name: string;
  email: string;
  company: string;
  practice: string;
  practiceLabel: string;
  stageLabel: string;
  timelineLabel: string;
  message: string;
};

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "Unknown date" : dateFormat.format(date);
}

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const [query, setQuery] = useState("");
  const [practice, setPractice] = useState("all");
  const deferredQuery = useDeferredValue(query);

  const practices = useMemo(() => {
    const seen = new Map<string, string>();
    for (const lead of leads) seen.set(lead.practice, lead.practiceLabel);
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [leads]);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (practice !== "all" && lead.practice !== practice) return false;
      if (!needle) return true;
      return [lead.name, lead.email, lead.company, lead.message].some((field) =>
        field.toLowerCase().includes(needle),
      );
    });
  }, [leads, practice, deferredQuery]);

  if (leads.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="text-lg font-medium">No leads yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
          Briefs submitted through the contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Search leads</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, company, or message"
            className="h-11 w-full rounded-full border border-line bg-white px-5 text-sm outline-none transition-colors focus:border-cobalt focus:ring-1 focus:ring-cobalt"
          />
        </label>
        <label>
          <span className="sr-only">Filter by practice</span>
          <select
            value={practice}
            onChange={(event) => setPractice(event.target.value)}
            className="h-11 w-full rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt sm:w-64"
          >
            <option value="all">All practices</option>
            {practices.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-5 text-sm text-mist" aria-live="polite">
        Showing {filtered.length} of {leads.length} lead{leads.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-white px-6 py-10 text-center text-sm text-mist">
          No leads match these filters.
        </p>
      ) : (
        <ul className="mt-4 overflow-hidden rounded-3xl border border-line bg-white">
          {filtered.map((lead) => (
            <li key={lead.id} className="border-b border-line last:border-b-0">
              <details className="group">
                <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-paper md:grid-cols-[150px_1.4fr_1fr_1fr_auto] md:gap-6 md:px-6 [&::-webkit-details-marker]:hidden">
                  <time
                    dateTime={lead.at}
                    suppressHydrationWarning
                    className="order-3 col-span-2 font-mono text-[11px] text-mist md:order-none md:col-span-1"
                  >
                    {formatDate(lead.at)}
                  </time>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{lead.name || "No name"}</span>
                    <span className="block truncate text-sm text-mist">{lead.email}</span>
                  </span>
                  <span className="hidden truncate text-sm md:block">{lead.company}</span>
                  <span className="order-4 col-span-2 md:order-none md:col-span-1">
                    <span className="inline-flex rounded-full bg-cobalt/10 px-2.5 py-1 text-xs font-medium text-cobalt">
                      {lead.practiceLabel}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="row-start-1 inline-flex h-8 w-8 items-center justify-center justify-self-end rounded-full border border-line transition-transform group-open:rotate-180 md:row-start-auto"
                  >
                    <ChevronIcon className="h-3 w-3" />
                  </span>
                </summary>
                <div className="grid gap-6 border-t border-line bg-paper px-5 py-6 md:grid-cols-[1fr_280px] md:px-6">
                  <div>
                    <p className="t-eyebrow text-mist">Message</p>
                    <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap text-ink-soft">
                      {lead.message || "No message."}
                    </p>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <Detail label="Company" value={lead.company} />
                    <Detail label="Stage" value={lead.stageLabel} />
                    <Detail label="Timing" value={lead.timelineLabel} />
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="mt-2 inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-cobalt"
                      >
                        Reply by email
                      </a>
                    ) : null}
                  </dl>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-2">
      <dt className="text-mist">{label}</dt>
      <dd className="text-right font-medium">{value || "Not given"}</dd>
    </div>
  );
}
