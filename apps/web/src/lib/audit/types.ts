/** Shapes shared by the audit scraper, the Gemini step, the report UI and the .doc export. */

export type CheckStatus = "pass" | "warn" | "fail";

/** One measured on-page / technical signal, straight from the fetched site. */
export type AuditCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
};

/** Raw facts the scraper read from the site; also what Gemini is shown. */
export type SiteSignals = {
  url: string;
  finalUrl: string;
  host: string;
  status: number;
  responseMs: number;
  https: boolean;
  title: string;
  metaDescription: string;
  metaKeywords: string[];
  lang: string;
  canonical: string;
  robotsMeta: string;
  viewport: boolean;
  openGraph: boolean;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  wordCount: number;
  textSample: string;
  images: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  schemaTypes: string[];
  scriptCount: number;
  robotsTxt: boolean;
  sitemap: boolean;
  /** Most frequent meaningful words in the page text, for the no-AI fallback. */
  topTerms: string[];
};

export type ScoreTone = "good" | "warn" | "critical";

export type AuditScore = {
  id: "geo" | "seo" | "technical" | "content";
  label: string;
  score: number;
  summary: string;
};

export type RankingRow = {
  keyword: string;
  volume: number;
  position: number | null;
  position3m: number | null;
  position6m: number | null;
  trend: "up" | "down" | "flat" | "new";
  intent: "Commercial" | "Informational" | "Transactional" | "Navigational";
};

export type KeywordOpportunity = { keyword: string; volume: number; difficulty: "Low" | "Medium" | "High" };

export type Competitor = { name: string; share: number };

export type AuditFix = {
  title: string;
  detail: string;
  impact: "High" | "Medium" | "Low";
  category: string;
};

export type TrafficForecast = {
  current: number;
  in3Months: number;
  in6Months: number;
  note: string;
};

export type AuditReport = {
  id: string;
  createdAt: string;
  url: string;
  host: string;
  /** "gemini" when the AI step ran; "basic" when only scraped signals were used. */
  source: "gemini" | "basic";
  /** The Gemini model that answered (after any fallbacks). */
  model?: string;
  /** Why the AI step was skipped or failed, shown above the report. */
  notice?: string;
  headline: { title: string; highlight: string; rest: string; subtitle: string };
  niche: string;
  scores: AuditScore[];
  rankings: RankingRow[];
  keywordOpportunities: KeywordOpportunity[];
  promptOpportunities: string[];
  competitors: Competitor[];
  fixes: AuditFix[];
  /** AI estimate of current and projected monthly visitors; null without Gemini. */
  forecast: TrafficForecast | null;
  checks: AuditCheck[];
  signals: SiteSignals;
};

export type AuditResult = { status: "ok"; report: AuditReport } | { status: "error"; message: string };

export function scoreTone(score: number): ScoreTone {
  if (score >= 70) return "good";
  if (score >= 40) return "warn";
  return "critical";
}
