"use client";

import type { ReactNode } from "react";
import { downloadAuditDoc } from "@/components/admin/audit/audit-doc";
import { scoreTone, type AuditReport, type CheckStatus, type RankingRow, type ScoreTone } from "@/lib/audit/types";

const COMPETITOR_COLORS = ["#14b8a6", "#3b82f6", "#a78bfa", "#f59e0b", "#22d3ee", "#f472b6", "#84cc16", "#fb7185"];

const number = (value: number) => value.toLocaleString("en");

export function AuditReportView({ report, onNewScan }: { report: AuditReport; onNewScan: () => void }) {
  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
          <span className="text-cobalt">Audit report</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-line" />
          <span className="text-ink-soft">{report.host}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => downloadAuditDoc(report)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium transition-colors hover:border-ink/30"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
            </svg>
            Download .doc
          </button>
          <button
            type="button"
            onClick={onNewScan}
            className="inline-flex h-10 items-center rounded-full bg-cobalt px-4 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover"
          >
            New scan
          </button>
        </div>
      </div>

      {report.notice ? (
        <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {report.notice}
        </p>
      ) : null}

      <section className="rounded-3xl border border-line border-t-cobalt bg-white p-6 shadow-sm [border-top-width:3px] md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {report.headline.title} <span className="text-cobalt">{report.headline.highlight}</span>{" "}
          {report.headline.rest}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">{report.headline.subtitle}</p>
        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-xs text-mist">
          <Meta label="URL" value={report.url} />
          {report.forecast ? <Meta label="Est. monthly traffic" value={number(report.forecast.current)} /> : null}
          <Meta
            label="Scanned"
            value={new Date(report.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          />
          <Meta
            label="Analysis"
            value={report.source === "gemini" ? `Live scan + ${report.model ?? "Gemini"}` : "Live scan only"}
          />
        </dl>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {report.scores.map((score) => (
          <section
            key={score.id}
            className="flex items-center justify-between gap-6 rounded-3xl border border-line bg-white p-6 md:p-7"
          >
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight">{score.label}</h2>
              <p className="mt-1.5 text-sm text-ink-soft">{score.summary}</p>
              <ToneBadge tone={scoreTone(score.score)} />
            </div>
            <ScoreRing score={score.score} />
          </section>
        ))}
      </div>

      {report.rankings.length ? (
        <Card
          title="Current Rankings — Top Positions"
          subtitle="Estimated organic positions for the site’s most relevant non-branded queries."
        >
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-paper text-left text-[11px] font-semibold tracking-[0.08em] text-mist uppercase">
                <tr>
                  <th className="px-5 py-3.5">Keyword</th>
                  <th className="px-3 py-3.5 text-right">Volume</th>
                  <th className="px-3 py-3.5">Position now</th>
                  <th className="px-3 py-3.5">3 months ago</th>
                  <th className="px-3 py-3.5">6 months ago</th>
                  <th className="px-3 py-3.5">Trend</th>
                  <th className="px-5 py-3.5">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {report.rankings.map((row) => (
                  <tr key={row.keyword}>
                    <td className="px-5 py-3.5 font-medium">{row.keyword}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{number(row.volume)}</td>
                    <td className="px-3 py-3.5">
                      <Position value={row.position} />
                    </td>
                    <td className="px-3 py-3.5">
                      <Position value={row.position3m} />
                    </td>
                    <td className="px-3 py-3.5">
                      <Position value={row.position6m} />
                    </td>
                    <td className="px-3 py-3.5">
                      <Trend trend={row.trend} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                        {row.intent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {report.keywordOpportunities.length || report.promptOpportunities.length ? (
        <Card
          title="Keyword & Prompt Opportunities"
          subtitle={`High-intent non-branded phrases for ${report.niche || report.host}.`}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-emerald-700">Keyword opportunities</h3>
              <div className="max-h-[420px] overflow-auto rounded-2xl border border-line">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-paper text-left text-[11px] font-semibold tracking-[0.08em] text-mist uppercase">
                    <tr>
                      <th className="px-5 py-3.5">Keyword</th>
                      <th className="px-3 py-3.5 text-right">Volume</th>
                      <th className="px-5 py-3.5 text-right">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {report.keywordOpportunities.map((row) => (
                      <tr key={row.keyword}>
                        <td className="px-5 py-3 text-cobalt">{row.keyword}</td>
                        <td className="px-3 py-3 text-right tabular-nums">{row.volume ? number(row.volume) : "—"}</td>
                        <td className="px-5 py-3 text-right">{row.difficulty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-emerald-700">AI prompt opportunities</h3>
              <div className="max-h-[420px] overflow-auto rounded-2xl border border-line">
                <div className="sticky top-0 bg-paper px-5 py-3.5 text-[11px] font-semibold tracking-[0.08em] text-mist uppercase">
                  Prompt
                </div>
                {report.promptOpportunities.length ? (
                  <ul className="divide-y divide-line">
                    {report.promptOpportunities.map((prompt) => (
                      <li key={prompt} className="px-5 py-3 text-sm">
                        “{prompt}”
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-5 py-6 text-sm text-mist">Needs Gemini.</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {report.competitors.length ? (
        <Card
          title="Competitor Market Share"
          subtitle="Estimated share of organic and AI-answer visibility among direct rivals."
        >
          <CompetitorChart report={report} />
        </Card>
      ) : null}

      {report.forecast ? (
        <Card title="Traffic Forecast" subtitle={report.forecast.note}>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            <Forecast label="Today (est.)" value={report.forecast.current} />
            <Forecast label="In 3 months" value={report.forecast.in3Months} base={report.forecast.current} />
            <Forecast label="In 6 months" value={report.forecast.in6Months} base={report.forecast.current} />
          </div>
        </Card>
      ) : null}

      <Card title="Priority Fixes" subtitle="What to do first, ordered by expected impact.">
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {report.fixes.map((fix, index) => (
            <li key={`${fix.title}-${index}`} className="flex gap-5 px-5 py-4">
              <span className="pt-0.5 font-mono text-xs text-mist">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{fix.title}</p>
                  <ImpactBadge impact={fix.impact} />
                  <span className="rounded-full bg-paper-deep px-2 py-0.5 text-[11px] text-mist">{fix.category}</span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{fix.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Technical & On-page Checks" subtitle="Measured on the live homepage during this scan.">
        <ul className="grid gap-3 md:grid-cols-2">
          {report.checks.map((check) => (
            <li key={check.id} className="flex gap-3 rounded-2xl border border-line px-4 py-3">
              <StatusDot status={check.status} />
              <div className="min-w-0">
                <p className="text-sm font-medium">{check.label}</p>
                <p className="mt-0.5 text-xs break-words text-mist">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <p className="pb-4 text-xs text-mist">
        Technical checks are measured on the live site. Traffic, search volumes, positions, competitor share and the
        forecast are AI estimates for planning, not data from Google Search Console.
      </p>
    </article>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-6 md:p-8">
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-ink-soft">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 gap-1.5">
      <dt>{label}:</dt>
      <dd className="truncate font-medium text-ink-soft">{value}</dd>
    </div>
  );
}

const TONE_STYLE: Record<ScoreTone, { ring: string; badge: string; label: string; icon: string }> = {
  good: { ring: "#10b981", badge: "border-emerald-200 bg-emerald-50 text-emerald-800", label: "Good", icon: "✓" },
  warn: { ring: "#2a4ff6", badge: "border-amber-200 bg-amber-50 text-amber-800", label: "Needs work", icon: "!" },
  critical: { ring: "#dc2626", badge: "border-red-200 bg-red-50 text-red-700", label: "Critical", icon: "×" },
};

function ToneBadge({ tone }: { tone: ScoreTone }) {
  const style = TONE_STYLE[tone];
  return (
    <span
      className={`mt-3 inline-flex items-center gap-2 rounded-md border px-2 py-1 text-[11px] font-semibold tracking-wide uppercase ${style.badge}`}
    >
      <span aria-hidden="true">{style.icon}</span>
      {style.label}
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={TONE_STYLE[scoreTone(score)].ring}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-xl font-semibold">{score}</span>
        <span className="mt-0.5 text-[10px] text-mist">/100</span>
      </span>
    </div>
  );
}

function Position({ value }: { value: number | null }) {
  return (
    <span className="inline-flex min-w-16 justify-center rounded-md border border-line bg-paper px-2.5 py-1 text-xs font-medium">
      {value ? `#${value}` : "NA"}
    </span>
  );
}

function Trend({ trend }: { trend: RankingRow["trend"] }) {
  const map = {
    new: { label: "New entry", style: "border-blue-200 bg-blue-50 text-blue-800" },
    up: { label: "▲ Rising", style: "border-emerald-200 bg-emerald-50 text-emerald-800" },
    down: { label: "▼ Falling", style: "border-red-200 bg-red-50 text-red-700" },
    flat: { label: "Stable", style: "border-line bg-paper text-ink-soft" },
  }[trend];
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${map.style}`}>{map.label}</span>
  );
}

function ImpactBadge({ impact }: { impact: "High" | "Medium" | "Low" }) {
  const style = {
    High: "bg-red-50 text-red-700",
    Medium: "bg-amber-50 text-amber-800",
    Low: "bg-emerald-50 text-emerald-800",
  }[impact];
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${style}`}>{impact} impact</span>;
}

function StatusDot({ status }: { status: CheckStatus }) {
  const style = {
    pass: { className: "bg-emerald-100 text-emerald-700", icon: "✓", label: "Pass" },
    warn: { className: "bg-amber-100 text-amber-800", icon: "!", label: "Warning" },
    fail: { className: "bg-red-100 text-red-700", icon: "×", label: "Fail" },
  }[status];
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${style.className}`}
    >
      <span aria-hidden="true">{style.icon}</span>
      <span className="sr-only">{style.label}</span>
    </span>
  );
}

function Forecast({ label, value, base }: { label: string; value: number; base?: number }) {
  const change = base ? Math.round(((value - base) / base) * 100) : null;
  return (
    <div className="bg-white p-6">
      <p className="t-eyebrow text-mist">{label}</p>
      <p className="mt-3 text-3xl font-medium tracking-tight tabular-nums">{number(value)}</p>
      <p className="mt-1 text-xs text-mist">
        visitors / month
        {change !== null && change !== 0 ? (
          <span className={change > 0 ? "ml-2 font-medium text-emerald-700" : "ml-2 font-medium text-danger"}>
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        ) : null}
      </p>
    </div>
  );
}

function CompetitorChart({ report }: { report: AuditReport }) {
  const max = Math.max(10, ...report.competitors.map((row) => row.share));
  const top = Math.ceil((max * 1.15) / 5) * 5;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(top * fraction));
  const brand = report.host.split(".")[0].toLowerCase();

  return (
    <div className="flex gap-3">
      <div className="relative flex h-72 w-8 shrink-0 flex-col-reverse justify-between text-right text-[11px] text-mist">
        {ticks.map((tick) => (
          <span key={tick} className="translate-y-1.5">
            {tick}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative h-72 border-b border-l border-line">
          {ticks.slice(1).map((tick) => (
            <div
              key={tick}
              className="absolute inset-x-0 border-t border-dashed border-line"
              style={{ bottom: `${(tick / top) * 100}%` }}
            />
          ))}
          <div className="absolute inset-0 flex items-end gap-3 px-4">
            {report.competitors.map((row, index) => {
              const self = row.name.toLowerCase().includes(brand);
              return (
                <div key={row.name} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                  <span className="mb-1.5 text-xs font-semibold tabular-nums">{row.share}%</span>
                  <div
                    className="w-full max-w-14 rounded-t-lg"
                    style={{
                      height: `${(row.share / top) * 100}%`,
                      background: self ? "var(--color-cobalt)" : COMPETITOR_COLORS[index % COMPETITOR_COLORS.length],
                    }}
                    title={`${row.name}: ${row.share}%`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3 px-4 pt-2">
          {report.competitors.map((row) => (
            <span key={row.name} className="min-w-0 flex-1 truncate text-center text-xs text-ink-soft" title={row.name}>
              {row.name}
            </span>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-mist">Visibility share (%)</p>
      </div>
    </div>
  );
}
