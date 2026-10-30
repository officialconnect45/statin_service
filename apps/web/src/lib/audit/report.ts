import "server-only";
import { randomUUID } from "node:crypto";
import { askGemini, geminiConfigured, GeminiError, type GeminiAudit } from "@/lib/audit/gemini";
import { buildChecks, checksScore, scrapeSite } from "@/lib/audit/scrape";
import type {
  AuditCheck,
  AuditFix,
  AuditReport,
  AuditScore,
  Competitor,
  KeywordOpportunity,
  RankingRow,
  SiteSignals,
  TrafficForecast,
} from "@/lib/audit/types";

const TECHNICAL_CHECKS = [
  "https",
  "indexable",
  "robots",
  "sitemap",
  "canonical",
  "viewport",
  "speed",
  "lang",
  "content",
];

const SCORE_LABELS: Record<AuditScore["id"], string> = {
  geo: "GEO / AI Visibility Score",
  seo: "Overall SEO Score",
  technical: "Technical Health",
  content: "Content & Authority",
};

// ─── Small validators: Gemini output is untrusted, so coerce everything ──────

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const str = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : fallback);
const int = (value: unknown, fallback = 0) => {
  const number = typeof value === "number" ? value : Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? Math.round(number) : fallback;
};
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const position = (value: unknown) => {
  if (value === null || value === undefined || value === "" || String(value).toUpperCase() === "NA") return null;
  const number = int(value, -1);
  return number >= 1 && number <= 100 ? number : null;
};
const oneOf = <T extends string>(value: unknown, options: readonly T[], fallback: T): T => {
  const match = options.find((option) => option.toLowerCase() === str(value).toLowerCase());
  return match ?? fallback;
};
const rows = (value: unknown) => (Array.isArray(value) ? value.filter(isRecord) : []);

function geminiScores(ai: GeminiAudit) {
  const scores = new Map<string, { score: number; summary: string }>();
  for (const row of rows(ai.scores)) {
    const id = str(row.id).toLowerCase();
    if (id) scores.set(id, { score: clamp(int(row.score), 0, 100), summary: str(row.summary) });
  }
  return scores;
}

function geminiRankings(ai: GeminiAudit): RankingRow[] {
  return rows(ai.rankings)
    .map((row) => ({
      keyword: str(row.keyword),
      volume: Math.max(0, int(row.volume)),
      position: position(row.position),
      position3m: position(row.position3m),
      position6m: position(row.position6m),
      trend: oneOf(row.trend, ["up", "down", "flat", "new"] as const, "new"),
      intent: oneOf(
        row.intent,
        ["Commercial", "Informational", "Transactional", "Navigational"] as const,
        "Commercial",
      ),
    }))
    .filter((row) => row.keyword)
    .slice(0, 12);
}

function geminiKeywords(ai: GeminiAudit): KeywordOpportunity[] {
  return rows(ai.keywordOpportunities)
    .map((row) => ({
      keyword: str(row.keyword),
      volume: Math.max(0, int(row.volume)),
      difficulty: oneOf(row.difficulty, ["Low", "Medium", "High"] as const, "Medium"),
    }))
    .filter((row) => row.keyword)
    .slice(0, 15);
}

function geminiCompetitors(ai: GeminiAudit): Competitor[] {
  return rows(ai.competitors)
    .map((row) => ({ name: str(row.name), share: clamp(int(row.share), 0, 100) }))
    .filter((row) => row.name)
    .sort((a, b) => b.share - a.share)
    .slice(0, 8);
}

function geminiFixes(ai: GeminiAudit): AuditFix[] {
  return rows(ai.fixes)
    .map((row) => ({
      title: str(row.title),
      detail: str(row.detail),
      impact: oneOf(row.impact, ["High", "Medium", "Low"] as const, "Medium"),
      category: str(row.category, "SEO") || "SEO",
    }))
    .filter((row) => row.title)
    .slice(0, 12);
}

// ─── Fallbacks from the scraped facts alone ──────────────────────────────────

function basicFixes(checks: AuditCheck[]): AuditFix[] {
  const category = (id: string) =>
    TECHNICAL_CHECKS.includes(id) ? "Technical SEO" : id === "schema" ? "Schema" : "On-page";
  return checks
    .filter((check) => check.status !== "pass")
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "fail" ? -1 : 1))
    .map((check) => ({
      title: `Fix: ${check.label}`,
      detail: check.detail,
      impact: check.status === "fail" ? ("High" as const) : ("Medium" as const),
      category: category(check.id),
    }));
}

function geminiForecast(ai: GeminiAudit): TrafficForecast | null {
  if (!isRecord(ai.forecast)) return null;
  const current = Math.max(0, int(ai.forecast.current, -1));
  if (current <= 0) return null;
  return {
    current,
    in3Months: Math.max(0, int(ai.forecast.in3Months, Math.round(current * 1.15))),
    in6Months: Math.max(0, int(ai.forecast.in6Months, Math.round(current * 1.35))),
    note: str(ai.forecast.note) || "Projection assuming the high-impact fixes ship in the first month.",
  };
}

function basicGeoScore(signals: SiteSignals, checks: AuditCheck[]) {
  let score = checksScore(checks, ["schema", "content", "structure", "description", "h1"]);
  if (signals.wordCount > 1200) score += 5;
  return clamp(score, 0, 100);
}

function basicContentScore(signals: SiteSignals) {
  const words = clamp(signals.wordCount / 15, 0, 60);
  const depth = clamp(signals.headings.h2.length * 4, 0, 20);
  const links = clamp(signals.internalLinks, 0, 20);
  return Math.round(words + depth + links);
}

/** Scrapes the site, asks Gemini (when configured) and merges both into one validated report. */
export async function buildAuditReport(url: string): Promise<AuditReport> {
  const signals = await scrapeSite(url);
  const checks = buildChecks(signals);

  let ai: GeminiAudit | null = null;
  let model: string | undefined;
  let notice: string | undefined;
  if (geminiConfigured()) {
    try {
      const answer = await askGemini(signals, checks);
      ai = answer.data;
      model = answer.model;
    } catch (error) {
      if (!(error instanceof GeminiError)) throw error;
      notice = `${error.message} Showing the measured checks only.`;
    }
  } else {
    notice =
      "Gemini is not configured (GEMINI_API_KEY), so keywords, rankings, prompts and competitors are not included. Scores below come from the measured checks only.";
  }

  const fromAi = ai ? geminiScores(ai) : new Map<string, { score: number; summary: string }>();
  const failing = checks.filter((check) => check.status === "fail").length;
  const technical = checksScore(checks, TECHNICAL_CHECKS);
  const scoreRow = (id: AuditScore["id"], fallback: number, summary: string): AuditScore => ({
    id,
    label: SCORE_LABELS[id],
    score: fromAi.get(id)?.score ?? fallback,
    summary: fromAi.get(id)?.summary || summary,
  });

  const scores: AuditScore[] = [
    scoreRow(
      "geo",
      basicGeoScore(signals, checks),
      signals.schemaTypes.length
        ? "Structured data is present; content depth decides how often AI answers cite the site."
        : "No structured data, so AI engines have a harder time identifying and citing the business.",
    ),
    scoreRow(
      "seo",
      checksScore(checks),
      `${failing} failing and ${checks.filter((c) => c.status === "warn").length} warning checks across the homepage.`,
    ),
    // Technical health is always measured, never estimated.
    {
      id: "technical",
      label: SCORE_LABELS.technical,
      score: technical,
      summary: `Based on ${TECHNICAL_CHECKS.length} crawl and indexing checks on the live site.`,
    },
    scoreRow(
      "content",
      basicContentScore(signals),
      `${signals.wordCount.toLocaleString("en")} crawlable words and ${signals.headings.h2.length} H2 sections on the homepage.`,
    ),
  ];

  const headline = isRecord(ai?.headline) ? ai.headline : {};
  const fixes = ai ? geminiFixes(ai) : [];

  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    url: signals.finalUrl,
    host: signals.host,
    source: ai ? "gemini" : "basic",
    model,
    notice,
    niche: str(ai?.niche) || signals.metaDescription || signals.title,
    headline: {
      title: str(headline.title) || signals.host,
      highlight: str(headline.highlight) || "SEO + GEO",
      rest: str(headline.rest) || "Audit",
      subtitle: str(headline.subtitle) || signals.metaDescription || signals.title,
    },
    scores,
    rankings: ai ? geminiRankings(ai) : [],
    keywordOpportunities: ai
      ? geminiKeywords(ai)
      : signals.metaKeywords.slice(0, 10).map((keyword) => ({ keyword, volume: 0, difficulty: "Medium" as const })),
    promptOpportunities:
      ai && Array.isArray(ai.promptOpportunities)
        ? ai.promptOpportunities
            .map((p) => str(p))
            .filter(Boolean)
            .slice(0, 10)
        : [],
    competitors: ai ? geminiCompetitors(ai) : [],
    fixes: fixes.length ? fixes : basicFixes(checks),
    forecast: ai ? geminiForecast(ai) : null,
    checks,
    signals: { ...signals, textSample: "" },
  };
}
