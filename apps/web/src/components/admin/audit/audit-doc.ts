import { scoreTone, type AuditReport } from "@/lib/audit/types";

/**
 * Builds the report as a Word document. Word (and Google Docs / LibreOffice)
 * open HTML saved with a .doc extension and the msword MIME type, so no
 * document library is needed. Styles are inline because Word ignores most CSS.
 */

const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const num = (value: number) => value.toLocaleString("en");

const BLUE = "#2a4ff6";
const INK = "#0a0d18";
const MIST = "#5b6377";
const LINE = "#dde1ea";
const TONE = {
  good: { color: "#047857", label: "GOOD" },
  warn: { color: "#b45309", label: "NEEDS WORK" },
  critical: { color: "#b91c1c", label: "CRITICAL" },
};
const STATUS = {
  pass: { color: "#047857", label: "Pass" },
  warn: { color: "#b45309", label: "Warning" },
  fail: { color: "#b91c1c", label: "Fail" },
};

const th = (label: string, align = "left") =>
  `<th style="background:#f6f7fb;border:1px solid ${LINE};padding:6pt 8pt;text-align:${align};font-size:8pt;color:${MIST};text-transform:uppercase;letter-spacing:.5pt">${esc(label)}</th>`;
const td = (value: string, align = "left", extra = "") =>
  `<td style="border:1px solid ${LINE};padding:6pt 8pt;text-align:${align};font-size:10pt;vertical-align:top;${extra}">${value}</td>`;
const table = (head: string, body: string) =>
  `<table style="width:100%;border-collapse:collapse;margin:6pt 0 4pt" cellspacing="0"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
const h2 = (title: string, subtitle?: string) =>
  `<h2 style="font-size:15pt;color:${INK};margin:20pt 0 2pt">${esc(title)}</h2>${
    subtitle ? `<p style="color:${MIST};font-size:10pt;margin:0 0 6pt">${esc(subtitle)}</p>` : ""
  }`;

export function auditToWordHtml(report: AuditReport) {
  const date = new Date(report.createdAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" });
  const parts: string[] = [];

  parts.push(
    `<p style="font-size:8pt;font-weight:bold;letter-spacing:1.5pt;color:${BLUE};margin:0">AUDIT REPORT · ${esc(report.host.toUpperCase())}</p>`,
    `<h1 style="font-size:22pt;color:${INK};margin:6pt 0 4pt">${esc(report.headline.title)} <span style="color:${BLUE}">${esc(report.headline.highlight)}</span> ${esc(report.headline.rest)}</h1>`,
    `<p style="font-size:11pt;color:#363e52;margin:0 0 8pt">${esc(report.headline.subtitle)}</p>`,
    `<p style="font-size:9pt;color:${MIST};margin:0">URL: ${esc(report.url)} &nbsp;·&nbsp; ${report.forecast ? `Est. monthly traffic: ${num(report.forecast.current)} &nbsp;·&nbsp; ` : ""}Scanned: ${esc(date)} &nbsp;·&nbsp; ${report.source === "gemini" ? `Live scan + Gemini analysis (${esc(report.model ?? "Gemini")})` : "Live scan only"}</p>`,
  );
  if (report.notice)
    parts.push(`<p style="font-size:9pt;color:#92400e;background:#fffbeb;padding:6pt">${esc(report.notice)}</p>`);

  parts.push(h2("Scores"));
  parts.push(
    table(
      th("Area") + th("Score", "center") + th("Status", "center") + th("Summary"),
      report.scores
        .map((score) => {
          const tone = TONE[scoreTone(score.score)];
          return (
            td(`<b>${esc(score.label)}</b>`) +
            td(`<b style="font-size:13pt">${score.score}</b>/100`, "center") +
            td(`<b style="color:${tone.color};font-size:8pt">${tone.label}</b>`, "center") +
            td(esc(score.summary))
          );
        })
        .map((row) => `<tr>${row}</tr>`)
        .join(""),
    ),
  );

  if (report.rankings.length) {
    parts.push(
      h2("Current Rankings — Top Positions", "Estimated organic positions for the most relevant non-branded queries."),
    );
    const pos = (value: number | null) => (value ? `#${value}` : "NA");
    const trend = { new: "New entry", up: "Rising", down: "Falling", flat: "Stable" };
    parts.push(
      table(
        th("Keyword") +
          th("Volume", "right") +
          th("Now", "center") +
          th("3 months ago", "center") +
          th("6 months ago", "center") +
          th("Trend", "center") +
          th("Type", "center"),
        report.rankings
          .map(
            (row) =>
              `<tr>${td(`<b>${esc(row.keyword)}</b>`)}${td(num(row.volume), "right")}${td(pos(row.position), "center")}${td(pos(row.position3m), "center")}${td(pos(row.position6m), "center")}${td(trend[row.trend], "center")}${td(esc(row.intent), "center")}</tr>`,
          )
          .join(""),
      ),
    );
  }

  if (report.keywordOpportunities.length) {
    parts.push(h2("Keyword Opportunities", `High-intent non-branded phrases for ${report.niche || report.host}.`));
    parts.push(
      table(
        th("Keyword") + th("Volume", "right") + th("Difficulty", "center"),
        report.keywordOpportunities
          .map(
            (row) =>
              `<tr>${td(esc(row.keyword), "left", `color:${BLUE}`)}${td(row.volume ? num(row.volume) : "—", "right")}${td(row.difficulty, "center")}</tr>`,
          )
          .join(""),
      ),
    );
  }

  if (report.promptOpportunities.length) {
    parts.push(h2("AI Prompt Opportunities", "Questions buyers ask AI assistants where this site should be cited."));
    parts.push(
      `<ol style="font-size:10pt;margin:4pt 0 0 18pt;padding:0">${report.promptOpportunities.map((p) => `<li style="margin:0 0 4pt">“${esc(p)}”</li>`).join("")}</ol>`,
    );
  }

  if (report.competitors.length) {
    const max = Math.max(...report.competitors.map((row) => row.share), 1);
    parts.push(h2("Competitor Market Share", "Estimated share of organic and AI-answer visibility."));
    parts.push(
      table(
        th("Competitor") + th("Share", "right") + th(""),
        report.competitors
          .map((row) => {
            const width = Math.max(2, Math.round((row.share / max) * 100));
            const bar = `<table style="width:100%;border-collapse:collapse" cellspacing="0"><tr><td style="width:${width}%;background:${BLUE};height:10pt;font-size:1pt">&nbsp;</td><td style="font-size:1pt">&nbsp;</td></tr></table>`;
            return `<tr>${td(`<b>${esc(row.name)}</b>`, "left", "width:30%")}${td(`${row.share}%`, "right", "width:12%")}${td(bar)}</tr>`;
          })
          .join(""),
      ),
    );
  }

  const forecast = report.forecast;
  if (forecast) {
    parts.push(h2("Traffic Forecast", forecast.note));
    parts.push(
      table(
        th("Today (est.)", "center") + th("In 3 months", "center") + th("In 6 months", "center"),
        `<tr>${[forecast.current, forecast.in3Months, forecast.in6Months]
          .map((value) =>
            td(
              `<b style="font-size:14pt">${num(value)}</b><br/><span style="color:${MIST};font-size:8pt">visitors / month</span>`,
              "center",
            ),
          )
          .join("")}</tr>`,
      ),
    );
  }

  parts.push(h2("Priority Fixes", "What to do first, ordered by expected impact."));
  parts.push(
    table(
      th("#", "center") + th("Fix") + th("Impact", "center") + th("Area", "center"),
      report.fixes
        .map(
          (fix, index) =>
            `<tr>${td(String(index + 1), "center", "width:5%")}${td(`<b>${esc(fix.title)}</b><br/><span style="color:#363e52">${esc(fix.detail)}</span>`)}${td(fix.impact, "center", "width:12%")}${td(esc(fix.category), "center", "width:18%")}</tr>`,
        )
        .join(""),
    ),
  );

  parts.push(h2("Technical & On-page Checks", "Measured on the live homepage during the scan."));
  parts.push(
    table(
      th("Check") + th("Result", "center") + th("Detail"),
      report.checks
        .map((check) => {
          const status = STATUS[check.status];
          return `<tr>${td(`<b>${esc(check.label)}</b>`, "left", "width:28%")}${td(`<b style="color:${status.color}">${status.label}</b>`, "center", "width:12%")}${td(esc(check.detail))}</tr>`;
        })
        .join(""),
    ),
  );

  parts.push(
    `<p style="font-size:8pt;color:${MIST};margin-top:16pt">Technical checks are measured on the live site. Traffic, search volumes, positions, competitor share and the forecast are AI estimates for planning, not Google Search Console data.</p>`,
  );

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${esc(report.host)} SEO + GEO audit</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>@page { size: 21cm 29.7cm; margin: 2cm 1.8cm; } body { font-family: Calibri, Arial, sans-serif; color: ${INK}; }</style>
</head><body>${parts.join("\n")}</body></html>`;
}

export function downloadAuditDoc(report: AuditReport) {
  // The BOM makes Word read the file as UTF-8 (quotes, arrows, non-English text).
  const blob = new Blob(["\uFEFF", auditToWordHtml(report)], { type: "application/msword" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${report.host.replace(/[^\w.-]+/g, "-")}-seo-audit-${report.createdAt.slice(0, 10)}.doc`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1_000);
}
