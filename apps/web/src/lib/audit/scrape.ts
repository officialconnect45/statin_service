import "server-only";
import type { AuditCheck, SiteSignals } from "@/lib/audit/types";

const USER_AGENT = "Mozilla/5.0 (compatible; StatinAuditBot/1.0; +https://statin.eu)";
const MAX_HTML_BYTES = 3_000_000;

const STOP_WORDS = new Set(
  (
    "a about above after again all also am an and any are as at be because been before being below between both but by can " +
    "could did do does doing down during each few for from further get got had has have having he her here hers him his how " +
    "i if in into is it its just me more most my no nor not now of off on once only or other our ours out over own same she " +
    "should so some such than that the their theirs them then there these they this those through to too under until up us " +
    "very was we were what when where which while who whom why will with you your yours one two new use using used make " +
    "like may many much need way well work see get also than more will just can into"
  ).split(" "),
);

export class AuditFetchError extends Error {}

/** Accepts "example.com" or a full URL; returns a normalised http(s) URL or throws. */
export function normaliseUrl(input: string): URL {
  const raw = input.trim();
  if (!raw) throw new AuditFetchError("Enter a website URL.");
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new AuditFetchError("That doesn't look like a website URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:")
    throw new AuditFetchError("Only http and https URLs work.");
  if (isPrivateHost(url.hostname)) throw new AuditFetchError("Local and private network addresses can't be audited.");
  if (!url.hostname.includes(".")) throw new AuditFetchError("Enter a public domain, like example.com.");
  return url;
}

function isPrivateHost(host: string) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h.includes(":")) return h === "::1" || h === "::" || /^(fc|fd|fe80)/.test(h);
  const ip = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!ip) return false;
  const [a, b] = [Number(ip[1]), Number(ip[2])];
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

async function fetchText(url: string, timeoutMs: number) {
  const started = Date.now();
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = (await response.text()).slice(0, MAX_HTML_BYTES);
  return { response, text, ms: Date.now() - started };
}

async function exists(url: string, looksRight: (body: string) => boolean) {
  try {
    const { response, text } = await fetchText(url, 8_000);
    return response.ok && looksRight(text);
  } catch {
    return false;
  }
}

function decode(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html: string) {
  return decode(html.replace(/<[^>]+>/g, " "));
}

function attr(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? decode(match[1] ?? match[2] ?? match[3] ?? "") : "";
}

function metaContent(html: string, key: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = (attr(tag, "name") || attr(tag, "property")).toLowerCase();
    if (name === key) return attr(tag, "content");
  }
  return "";
}

function headingTexts(html: string, level: 1 | 2 | 3) {
  return [...html.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)</h${level}>`, "gi"))]
    .map((match) => stripTags(match[1]))
    .filter(Boolean)
    .slice(0, 25);
}

function schemaTypes(html: string) {
  const types = new Set<string>();
  for (const match of html.matchAll(
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    for (const type of match[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
      for (const name of type[1].matchAll(/"([^"]+)"/g)) types.add(name[1]);
    }
  }
  for (const match of html.matchAll(/itemtype\s*=\s*["'][^"']*schema\.org\/(\w+)/gi)) types.add(match[1]);
  return [...types].slice(0, 20);
}

function topTerms(text: string) {
  const counts = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []) {
    if (STOP_WORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}

/** Fetches the page (plus robots.txt and sitemap.xml) and reads the SEO-relevant facts out of the HTML. */
export async function scrapeSite(input: string): Promise<SiteSignals> {
  const url = normaliseUrl(input);

  let page: Awaited<ReturnType<typeof fetchText>>;
  try {
    page = await fetchText(url.toString(), 20_000);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    throw new AuditFetchError(timedOut ? "The website took too long to respond." : `Could not reach ${url.hostname}.`);
  }
  if (!page.response.ok) throw new AuditFetchError(`${url.hostname} responded with HTTP ${page.response.status}.`);

  const finalUrl = new URL(page.response.url || url.toString());
  const origin = finalUrl.origin;
  const html = page.text;

  const [robotsTxt, sitemap] = await Promise.all([
    exists(`${origin}/robots.txt`, (body) => /user-agent|sitemap|disallow|allow/i.test(body)),
    exists(`${origin}/sitemap.xml`, (body) => /<(urlset|sitemapindex)\b/i.test(body)),
  ]);

  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ");
  const bodyMatch = body.match(/<body\b[^>]*>([\s\S]*)<\/body>/i);
  const text = stripTags(bodyMatch ? bodyMatch[1] : body);
  const words = text.split(/\s+/).filter((word) => /[a-z0-9]/i.test(word));

  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  let internalLinks = 0;
  let externalLinks = 0;
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = attr(tag, "href");
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue;
    try {
      if (new URL(href, finalUrl).host === finalUrl.host) internalLinks++;
      else externalLinks++;
    } catch {
      // ignore malformed links
    }
  }

  const canonicalTag = (html.match(/<link\b[^>]*>/gi) ?? []).find(
    (tag) => attr(tag, "rel").toLowerCase() === "canonical",
  );
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";

  return {
    url: url.toString(),
    finalUrl: finalUrl.toString(),
    host: finalUrl.hostname.replace(/^www\./, ""),
    status: page.response.status,
    responseMs: page.ms,
    https: finalUrl.protocol === "https:",
    title: stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    metaDescription: metaContent(html, "description"),
    metaKeywords: metaContent(html, "keywords")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .slice(0, 30),
    lang: attr(htmlTag, "lang"),
    canonical: canonicalTag ? attr(canonicalTag, "href") : "",
    robotsMeta: metaContent(html, "robots"),
    viewport: Boolean(metaContent(html, "viewport")),
    openGraph: Boolean(metaContent(html, "og:title") || metaContent(html, "og:description")),
    headings: { h1: headingTexts(html, 1), h2: headingTexts(html, 2), h3: headingTexts(html, 3) },
    wordCount: words.length,
    textSample: text.slice(0, 4_000),
    images: images.length,
    // alt="" is valid for decorative images; only a missing attribute counts.
    imagesMissingAlt: images.filter((tag) => !/\balt\s*=/i.test(tag)).length,
    internalLinks,
    externalLinks,
    schemaTypes: schemaTypes(html),
    scriptCount: (html.match(/<script\b/gi) ?? []).length,
    robotsTxt,
    sitemap,
    topTerms: topTerms(text),
  };
}

/** Pass / warn / fail checks over the scraped signals. These are measured, not estimated. */
export function buildChecks(s: SiteSignals): AuditCheck[] {
  const checks: AuditCheck[] = [];
  const add = (id: string, label: string, status: AuditCheck["status"], detail: string) =>
    checks.push({ id, label, status, detail });

  add(
    "https",
    "HTTPS",
    s.https ? "pass" : "fail",
    s.https ? "Served over HTTPS." : "The site is not served over HTTPS.",
  );

  const titleLength = s.title.length;
  add(
    "title",
    "Title tag",
    !titleLength ? "fail" : titleLength < 30 || titleLength > 65 ? "warn" : "pass",
    titleLength ? `${titleLength} characters: “${s.title}”. Aim for 30–65.` : "No <title> tag found.",
  );

  const descLength = s.metaDescription.length;
  add(
    "description",
    "Meta description",
    !descLength ? "fail" : descLength < 70 || descLength > 160 ? "warn" : "pass",
    descLength ? `${descLength} characters. Aim for 70–160.` : "No meta description found.",
  );

  const h1s = s.headings.h1.length;
  add(
    "h1",
    "H1 heading",
    h1s === 1 ? "pass" : h1s === 0 ? "fail" : "warn",
    h1s === 0 ? "No H1 on the page." : h1s === 1 ? `“${s.headings.h1[0]}”` : `${h1s} H1s found; use exactly one.`,
  );

  add(
    "structure",
    "Heading structure",
    s.headings.h2.length >= 2 ? "pass" : "warn",
    `${s.headings.h2.length} H2 and ${s.headings.h3.length} H3 headings.`,
  );

  add(
    "content",
    "Crawlable text",
    s.wordCount >= 600 ? "pass" : s.wordCount >= 250 ? "warn" : "fail",
    `${s.wordCount.toLocaleString("en")} words in the server-rendered HTML.${s.wordCount < 250 && s.scriptCount > 10 ? " The page likely renders its content with JavaScript." : ""}`,
  );

  add(
    "schema",
    "Structured data",
    s.schemaTypes.length ? "pass" : "fail",
    s.schemaTypes.length
      ? `Found: ${s.schemaTypes.join(", ")}.`
      : "No schema.org markup; AI engines can't read the entity clearly.",
  );

  add(
    "alt",
    "Image alt text",
    s.images === 0 || s.imagesMissingAlt === 0 ? "pass" : s.imagesMissingAlt / s.images > 0.3 ? "fail" : "warn",
    s.images === 0 ? "No images on the page." : `${s.imagesMissingAlt} of ${s.images} images have no alt text.`,
  );

  add("canonical", "Canonical URL", s.canonical ? "pass" : "warn", s.canonical || "No canonical link tag.");

  const noindex = /noindex/i.test(s.robotsMeta);
  add(
    "indexable",
    "Indexable",
    noindex ? "fail" : "pass",
    noindex ? `robots meta is “${s.robotsMeta}”.` : "No noindex directive.",
  );

  add("robots", "robots.txt", s.robotsTxt ? "pass" : "warn", s.robotsTxt ? "Present." : "Missing or empty.");
  add(
    "sitemap",
    "XML sitemap",
    s.sitemap ? "pass" : "warn",
    s.sitemap ? "/sitemap.xml found." : "No /sitemap.xml found.",
  );

  add(
    "viewport",
    "Mobile viewport",
    s.viewport ? "pass" : "fail",
    s.viewport ? "Viewport meta tag present." : "No viewport meta tag.",
  );
  add(
    "og",
    "Social preview (Open Graph)",
    s.openGraph ? "pass" : "warn",
    s.openGraph ? "Open Graph tags present." : "No og:title / og:description.",
  );
  add(
    "lang",
    "Language attribute",
    s.lang ? "pass" : "warn",
    s.lang ? `lang="${s.lang}"` : "No lang attribute on <html>.",
  );

  add(
    "speed",
    "Server response",
    s.responseMs < 800 ? "pass" : s.responseMs < 2000 ? "warn" : "fail",
    `HTML arrived in ${s.responseMs.toLocaleString("en")} ms.`,
  );

  add(
    "links",
    "Internal links",
    s.internalLinks >= 10 ? "pass" : s.internalLinks >= 3 ? "warn" : "fail",
    `${s.internalLinks} internal and ${s.externalLinks} external links.`,
  );

  return checks;
}

/** 0–100 from the checks: pass = full, warn = half. */
export function checksScore(checks: AuditCheck[], ids?: string[]) {
  const subset = ids ? checks.filter((check) => ids.includes(check.id)) : checks;
  if (!subset.length) return 0;
  const points = subset.reduce(
    (sum, check) => sum + (check.status === "pass" ? 1 : check.status === "warn" ? 0.5 : 0),
    0,
  );
  return Math.round((points / subset.length) * 100);
}
