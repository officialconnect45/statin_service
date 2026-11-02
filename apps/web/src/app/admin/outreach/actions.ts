"use server";

import type { OutreachField, OutreachResult, SendOutreachResponse } from "@statin/types";
import { requireAdmin } from "@/lib/admin/auth";
import { adminApiHeaders, apiUrl } from "@/lib/api";

export type OutreachFormState = {
  /** Increments on every completed send so the form can tell results apart. */
  run?: number;
  test?: boolean;
  message?: string;
  errors?: Partial<Record<OutreachField, string>>;
  results?: OutreachResult[];
  sent?: number;
  failed?: number;
};

type Row = { email: string; values: Record<string, string> };

// Must match MAX_RECIPIENTS in apps/api/src/routes/outreach.ts: the API takes this many per request.
const CHUNK = 50;
// Matches the form's limit; a bigger list is refused here too.
const MAX_ROWS = 500;

/** The form posts the parsed recipients as JSON: one row per email with its variable values. */
function readRows(formData: FormData): Row[] {
  try {
    const data: unknown = JSON.parse(String(formData.get("rows") ?? "[]"));
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      email: String(item?.email ?? "").trim(),
      values: Object.fromEntries(
        Object.entries((item?.values ?? {}) as Record<string, unknown>).map(([name, value]) => [name, String(value ?? "").trim()]),
      ),
    }));
  } catch {
    return [];
  }
}

export async function sendOutreach(previous: OutreachFormState, formData: FormData): Promise<OutreachFormState> {
  const { username } = await requireAdmin();

  const test = formData.get("intent") === "test";
  const run = (previous.run ?? 0) + 1;
  const subject = String(formData.get("subject") ?? "");
  const body = String(formData.get("body") ?? "");

  // A test goes to the admin's own test address using the first row's values.
  const rows = readRows(formData).slice(0, test ? 1 : MAX_ROWS);
  const chunks: Row[][] = [];
  for (let i = 0; i < Math.max(rows.length, 1); i += CHUNK) chunks.push(rows.slice(i, i + CHUNK));

  const results: OutreachResult[] = [];
  for (const [index, chunk] of chunks.entries()) {
    const names = [...new Set(chunk.flatMap((row) => Object.keys(row.values)))];
    let response: Response;
    try {
      response = await fetch(apiUrl("/admin/outreach"), {
        method: "POST",
        headers: { ...adminApiHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: chunk.map((row) => row.email),
          // variables[name][i] belongs to recipients[i].
          variables: Object.fromEntries(names.map((name) => [name, chunk.map((row) => row.values[name] ?? "")])),
          subject,
          body,
          test,
          sentBy: username,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(240_000),
      });
    } catch (error) {
      console.error("[outreach] Could not reach the API:", error);
      const message = "The API is not reachable, or the send took too long. Check the results before retrying.";
      if (index === 0) return { run, test, message };
      return stopped(run, results, rows.slice(index * CHUNK), "Unknown: check Sent mail before retrying", message);
    }

    const data = (await response.json().catch(() => null)) as SendOutreachResponse | null;
    if (!data || data.status === "error") {
      const message = data ? data.message : `The API responded ${response.status}.`;
      if (index === 0) return { run, test, message, errors: data?.status === "error" ? data.errors : undefined };
      return stopped(run, results, rows.slice(index * CHUNK), "Not sent", message);
    }
    results.push(...data.results);
  }

  const sent = results.filter((result) => result.status === "sent").length;
  return { run, test, results, sent, failed: results.length - sent };
}

/** A later batch failed: what already went out stays "sent"; the rest come back as failed so they can be retried. */
function stopped(run: number, done: OutreachResult[], rest: Row[], error: string, message: string): OutreachFormState {
  const results: OutreachResult[] = [
    ...done,
    ...rest.map((row): OutreachResult => ({ email: row.email, status: "failed", error })),
  ];
  const sent = done.filter((result) => result.status === "sent").length;
  return { run, message, results, sent, failed: results.length - sent };
}
