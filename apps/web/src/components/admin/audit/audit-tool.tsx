"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { runAudit } from "@/app/admin/audit/actions";
import { AuditReportView } from "@/components/admin/audit/audit-report";
import type { AuditReport } from "@/lib/audit/types";

const COVERAGE = [
  { title: "Rankings and AI citation", body: "Where the brand appears in search results and in AI answers." },
  { title: "Keyword and prompt demand", body: "Queries and prompts that can send qualified traffic." },
  { title: "Competitor answer share", body: "Which brands search and answer engines recommend instead." },
  { title: "Schema and entity clarity", body: "Whether machines can tell what the business sells." },
  { title: "Technical SEO", body: "Crawl, index, speed and on-page issues that block visibility." },
  { title: "Fixes and traffic forecast", body: "What to do first, with an estimated traffic forecast." },
];

/** Progress stages shown while the single server call runs; timed, since the action can't stream progress. */
const STAGES = [
  { until: 8, label: "Fetching the website…" },
  { until: 16, label: "Reading robots.txt and sitemap…" },
  { until: 28, label: "Checking on-page and technical signals…" },
  { until: 55, label: "Estimating rankings and keyword demand…" },
  { until: 75, label: "Mapping competitors and AI prompts…" },
  { until: 92, label: "Generating recommendations…" },
];

export function AuditTool({ geminiReady }: { geminiReady: boolean }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await runAudit({ url });
      if (result.status === "ok") {
        setReport(result.report);
        window.scrollTo({ top: 0 });
      } else {
        setError(result.message);
      }
    });
  }

  if (pending) return <ScanProgress url={url} />;

  if (report) {
    return (
      <AuditReportView
        report={report}
        onNewScan={() => {
          setReport(null);
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-start">
      <div>
        <p className="t-eyebrow text-cobalt">AI visibility audit</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Audit a website for SEO and AI search</h1>
        <p className="mt-4 max-w-xl text-sm text-mist">
          Enter a website. The scan reads the live site, measures the technical and on-page signals, then estimates
          traffic, rankings, keyword and prompt demand, competitors and the fixes that matter most.
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <label className="block">
            <span className="text-sm font-medium">Website URL</span>
            <input
              type="text"
              inputMode="url"
              autoComplete="off"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="www.company.com"
              className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/15"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cobalt px-5 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover"
          >
            Run audit
            <span aria-hidden="true">→</span>
          </button>
        </form>

        {error ? (
          <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-mist">
          {["Live site scan", "SEO + GEO scores", "Downloadable report"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cobalt" />
              {item}
            </li>
          ))}
        </ul>

        {!geminiReady ? (
          <p className="mt-8 max-w-xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong className="font-medium">Gemini isn&apos;t connected yet.</strong> Audits still run, but only with
            the measured checks. Add <code className="font-mono text-xs">GEMINI_API_KEY</code> to{" "}
            <code className="font-mono text-xs">apps/web/.env.local</code> and restart the dev server for keywords,
            rankings, prompts and competitors.
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-line border-t-cobalt bg-white shadow-sm [border-top-width:3px]">
        <div className="flex items-center justify-between gap-4 bg-paper px-6 py-5">
          <div>
            <p className="t-eyebrow text-mist">Scan coverage</p>
            <p className="mt-1 font-medium">Included in every report</p>
          </div>
          <span className="rounded-full bg-cobalt/10 px-3 py-1 text-xs font-medium text-cobalt">
            {COVERAGE.length} sections
          </span>
        </div>
        <ol className="divide-y divide-line">
          {COVERAGE.map((item, index) => (
            <li key={item.title} className="flex gap-5 px-6 py-4">
              <span className="pt-0.5 font-mono text-xs text-mist">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="mt-1 block text-xs text-mist">{item.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ScanProgress({ url }: { url: string }) {
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(0);

  useEffect(() => {
    started.current = Date.now();
    const timer = window.setInterval(() => setElapsed((Date.now() - started.current) / 1000), 400);
    return () => window.clearInterval(timer);
  }, []);

  // Eases toward 95% over ~90s; the jump to the report happens when the server answers.
  const percent = Math.min(95, Math.round(95 * (1 - Math.exp(-elapsed / 35))));
  const stage = STAGES.find((item) => percent < item.until) ?? STAGES[STAGES.length - 1];
  const shown = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-md rounded-3xl border border-line border-t-cobalt bg-white p-8 shadow-sm [border-top-width:3px]"
      >
        <p className="t-eyebrow text-cobalt">Scan in progress</p>
        <h2 className="mt-3 text-2xl font-medium tracking-tight">Analyzing the website</h2>
        <p className="mt-2 truncate text-sm text-mist">{shown}</p>
        <p className="mt-4 text-sm text-mist">
          This usually takes about a minute. The scan covers SEO, AI visibility and technical signals.
        </p>
        <div className="mt-6 border-t border-line pt-5">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Scan progress</span>
            <span>{percent}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-deep">
            <div
              className="h-full rounded-full bg-cobalt transition-[width] duration-500"
              style={{ width: `${Math.max(2, percent)}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-mist">{stage.label}</p>
        </div>
      </div>
    </div>
  );
}
