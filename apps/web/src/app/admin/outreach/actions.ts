"use server";

import type { OutreachField, OutreachRecipient, OutreachResult, SendOutreachResponse } from "@statin/types";
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

function readRecipients(formData: FormData): OutreachRecipient[] {
  try {
    const parsed = JSON.parse(String(formData.get("recipients") ?? "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function sendOutreach(previous: OutreachFormState, formData: FormData): Promise<OutreachFormState> {
  await requireAdmin();

  const test = formData.get("intent") === "test";
  const run = (previous.run ?? 0) + 1;

  let response: Response;
  try {
    response = await fetch(apiUrl("/admin/outreach"), {
      method: "POST",
      headers: { ...adminApiHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        recipients: readRecipients(formData),
        subject: String(formData.get("subject") ?? ""),
        body: String(formData.get("body") ?? ""),
        test,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(120_000),
    });
  } catch (error) {
    console.error("[outreach] Could not reach the API:", error);
    return { run, test, message: "The API is not reachable, or the send took too long. Check the results before retrying." };
  }

  const data = (await response.json().catch(() => null)) as SendOutreachResponse | null;
  if (!data) return { run, test, message: `The API responded ${response.status}.` };
  if (data.status === "error") return { run, test, message: data.message, errors: data.errors };

  return { run, test, results: data.results, sent: data.sent, failed: data.failed };
}
