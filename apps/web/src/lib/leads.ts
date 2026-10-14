import "server-only";
import type { InquiryRecord, ListInquiriesResponse } from "@statin/types";
import { requireAdmin } from "@/lib/admin/auth";
import { adminApiHeaders, apiUrl } from "@/lib/api";
import { inquiryOptions } from "@/lib/inquiry-options";

// Leads live in MongoDB (statin_build → inquiries), served by the Express API.
export type Lead = InquiryRecord;

export class LeadsUnavailableError extends Error {}

const labels = new Map<string, string>(
  [...inquiryOptions.practices, ...inquiryOptions.stages, ...inquiryOptions.timelines].map(
    (option) => [option.value, option.label],
  ),
);

/** Human label for a stored practice/stage/timeline value. */
export function optionLabel(value: string) {
  return value ? (labels.get(value) ?? value) : "";
}

/** All leads, newest first. Authorizes the admin before calling the API. */
export async function getLeads(): Promise<Lead[]> {
  await requireAdmin();

  let response: Response;
  try {
    response = await fetch(apiUrl("/inquiries"), {
      headers: adminApiHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("[leads] Could not reach the API:", error);
    throw new LeadsUnavailableError("The API is not reachable. Check that it is running and API_BASE_URL is set.");
  }

  if (!response.ok) {
    console.error(`[leads] API responded ${response.status}`);
    throw new LeadsUnavailableError(
      response.status === 401 || response.status === 503
        ? "The API rejected the admin key. Check ADMIN_API_KEY in both apps."
        : "The API could not load leads.",
    );
  }

  const data = (await response.json()) as ListInquiriesResponse;
  return data.inquiries;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export type LeadStats = {
  total: number;
  last7Days: number;
  last30Days: number;
  topPractice: string | null;
};

export function summarizeLeads(leads: Lead[], now = Date.now()): LeadStats {
  const within = (days: number) =>
    leads.filter((lead) => now - Date.parse(lead.at) <= days * DAY_MS).length;

  const counts = new Map<string, number>();
  for (const lead of leads) {
    const label = optionLabel(lead.practice) || "Unspecified";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    total: leads.length,
    last7Days: within(7),
    last30Days: within(30),
    topPractice: top ? top[0] : null,
  };
}
