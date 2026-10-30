import "server-only";
import type { AuditCheck, SiteSignals } from "@/lib/audit/types";

const DEFAULT_MODEL = "gemini-3.5-flash";
/** Tried in order when the main model is busy, over quota or gone. Override with GEMINI_FALLBACK_MODELS. */
const DEFAULT_FALLBACK_MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
];
const ATTEMPTS_PER_MODEL = 2;
const REQUEST_TIMEOUT_MS = 90_000;
/** Whole Gemini step; stays under the page's maxDuration (300s) with room for the scrape. */
const TOTAL_BUDGET_MS = 240_000;

export class GeminiError extends Error {}

export function geminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/** What we ask Gemini for. Every field is re-validated in report.ts, so a sloppy answer can't break the page. */
export type GeminiAudit = {
  niche?: unknown;
  headline?: unknown;
  scores?: unknown;
  rankings?: unknown;
  keywordOpportunities?: unknown;
  promptOpportunities?: unknown;
  competitors?: unknown;
  fixes?: unknown;
  forecast?: unknown;
};

function buildPrompt(signals: SiteSignals, checks: AuditCheck[]) {
  const facts = {
    url: signals.finalUrl,
    title: signals.title,
    metaDescription: signals.metaDescription,
    metaKeywords: signals.metaKeywords,
    lang: signals.lang,
    headings: signals.headings,
    wordCount: signals.wordCount,
    schemaTypes: signals.schemaTypes,
    internalLinks: signals.internalLinks,
    externalLinks: signals.externalLinks,
    robotsTxt: signals.robotsTxt,
    sitemap: signals.sitemap,
    responseMs: signals.responseMs,
    topTerms: signals.topTerms,
    checks: checks.map(({ label, status, detail }) => ({ label, status, detail })),
    pageText: signals.textSample,
  };

  return `You are a senior SEO and GEO (generative engine optimisation) analyst writing an audit report for a client.

Website facts (scraped from the live homepage just now):
${JSON.stringify(facts, null, 2)}

Using these facts and your knowledge of the niche, return ONLY a JSON object with exactly this shape:
{
  "niche": "one short phrase describing what the business sells and to whom",
  "headline": {
    "title": "Brand name as it should appear, e.g. Statin.io",
    "highlight": "SEO + GEO",
    "rest": "Audit: a punchy 3-7 word verdict, e.g. Strong Engineering Signal, Weak Search Footprint",
    "subtitle": "one sentence summarising the business and the main finding"
  },
  "scores": [
    { "id": "geo", "score": 0-100, "summary": "one sentence on AI-answer visibility (ChatGPT, Gemini, Perplexity, AI Overviews)" },
    { "id": "seo", "score": 0-100, "summary": "one sentence on overall search visibility" },
    { "id": "content", "score": 0-100, "summary": "one sentence on content depth, topical authority and backlinks" }
  ],
  "rankings": [ 8 rows: { "keyword": "non-branded search query", "volume": monthly searches (integer), "position": estimated current Google position (integer 1-100) or null if not ranking, "position3m": integer or null, "position6m": integer or null, "trend": "up" | "down" | "flat" | "new", "intent": "Commercial" | "Informational" | "Transactional" | "Navigational" } ],
  "keywordOpportunities": [ 10 rows: { "keyword": "high-intent non-branded phrase", "volume": integer, "difficulty": "Low" | "Medium" | "High" } ],
  "promptOpportunities": [ 8 realistic questions buyers ask ChatGPT/Gemini where this site should be cited ],
  "competitors": [ 5 rows: { "name": "real competitor brand", "share": estimated share of organic + AI visibility in percent (integer) } ] — include the audited site itself as one row,
  "fixes": [ 8 rows ordered by impact: { "title": "short action", "detail": "one or two sentences, concrete", "impact": "High" | "Medium" | "Low", "category": "Technical SEO" | "Content" | "Schema" | "AI visibility" | "On-page" | "Authority" } ],
  "forecast": { "current": estimated monthly visitors today (all channels, integer, realistic for this site's size and niche), "in3Months": projected monthly visitors if the fixes ship, integer, "in6Months": integer, "note": "one sentence explaining the assumption" }
}

Rules: be specific to this website, never generic. Volumes, positions and shares are estimates; keep them realistic for the niche and the site's apparent size. Base the technical findings on the scraped checks. Write in English.`;
}

function modelChain() {
  const list = (value: string | undefined) =>
    (value ?? "")
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean);
  const primary = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const fallbacks =
    process.env.GEMINI_FALLBACK_MODELS === undefined
      ? DEFAULT_FALLBACK_MODELS
      : list(process.env.GEMINI_FALLBACK_MODELS);
  return [...new Set([primary, ...fallbacks])];
}

type Attempt =
  | { ok: true; data: GeminiAudit }
  /** retry: worth trying the same model again; otherwise move to the next model. */
  | { ok: false; retry: boolean; fatal?: boolean; reason: string; waitMs?: number };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callModel(model: string, key: string, prompt: string, timeoutMs: number): Promise<Attempt> {
  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      },
    );
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error(`[audit] Gemini ${model} request failed:`, error);
    return { ok: false, retry: !timedOut, reason: timedOut ? "timed out" : "not reachable" };
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(`[audit] Gemini ${model} responded ${response.status}:`, detail.slice(0, 300));
    const retryAfter = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 15_000) : undefined;
    switch (response.status) {
      case 401:
      case 403:
        // A key problem; other models won't help.
        return { ok: false, retry: false, fatal: true, reason: `rejected the key (HTTP ${response.status})` };
      case 404:
        return { ok: false, retry: false, reason: "not available for this key" };
      case 400:
        return { ok: false, retry: false, reason: "rejected the request (HTTP 400)" };
      case 429:
        return { ok: false, retry: true, reason: "over quota (HTTP 429)", waitMs };
      default:
        return { ok: false, retry: response.status >= 500, reason: `busy (HTTP ${response.status})`, waitMs };
    }
  }

  const data = (await response.json().catch(() => null)) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  } | null;
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    return { ok: true, data: JSON.parse(json) as GeminiAudit };
  } catch {
    console.error(`[audit] Gemini ${model} returned non-JSON:`, text.slice(0, 300));
    return { ok: false, retry: true, reason: "returned unreadable JSON" };
  }
}

/**
 * Calls the Gemini REST API (no SDK). Each model gets ATTEMPTS_PER_MODEL tries
 * with backoff on busy / quota / network errors, then the next model in the
 * chain is tried, all within TOTAL_BUDGET_MS.
 */
export async function askGemini(
  signals: SiteSignals,
  checks: AuditCheck[],
): Promise<{ data: GeminiAudit; model: string }> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new GeminiError("GEMINI_API_KEY is not set.");

  const prompt = buildPrompt(signals, checks);
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  const failures: string[] = [];

  for (const model of modelChain()) {
    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
      const remaining = deadline - Date.now();
      if (remaining < 10_000) {
        throw new GeminiError(`Gemini ran out of time. Tried: ${failures.join("; ") || "none"}.`);
      }

      const result = await callModel(model, key, prompt, Math.min(REQUEST_TIMEOUT_MS, remaining));
      if (result.ok) {
        if (failures.length) console.info(`[audit] Gemini answered with ${model} after: ${failures.join("; ")}`);
        return { data: result.data, model };
      }

      failures.push(`${model} ${result.reason}`);
      if (result.fatal) throw new GeminiError("Gemini rejected the API key. Check GEMINI_API_KEY.");
      if (!result.retry || attempt === ATTEMPTS_PER_MODEL) break;
      await sleep(result.waitMs ?? 2_000 * attempt);
    }
  }

  throw new GeminiError(`No Gemini model could answer right now (${failures.join("; ")}).`);
}
