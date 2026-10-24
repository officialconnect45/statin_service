import "server-only";
import type { ListSentEmailsResponse, SentEmailRecord } from "@statin/types";
import { requireAdmin } from "@/lib/admin/auth";
import { adminApiHeaders, apiUrl } from "@/lib/api";

// Sent mail lives in MongoDB (email_batches / email_messages), served by the Express API.
export type SentEmail = SentEmailRecord;

export class SentEmailsUnavailableError extends Error {}

/** Every stored send, newest first. Authorizes the admin before calling the API. */
export async function getSentEmails(): Promise<SentEmail[]> {
  await requireAdmin();

  let response: Response;
  try {
    response = await fetch(apiUrl("/admin/emails"), {
      headers: adminApiHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    console.error("[sent-emails] Could not reach the API:", error);
    throw new SentEmailsUnavailableError("The API is not reachable. Check that it is running and API_BASE_URL is set.");
  }

  if (!response.ok) {
    console.error(`[sent-emails] API responded ${response.status}`);
    throw new SentEmailsUnavailableError(
      response.status === 401 || response.status === 503
        ? "The API rejected the admin key. Check ADMIN_API_KEY in both apps."
        : "The API could not load sent emails.",
    );
  }

  const data = (await response.json()) as ListSentEmailsResponse;
  return data.emails;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Totals for the dashboard; test sends are left out. */
export function summarizeSentEmails(emails: SentEmail[], now = Date.now()) {
  const real = emails.filter((email) => email.kind !== "test");
  const sum = (list: SentEmail[], key: "sent" | "failed") => list.reduce((total, email) => total + email[key], 0);
  return {
    sent: sum(real, "sent"),
    failed: sum(real, "failed"),
    sends: real.length,
    last30Days: sum(
      real.filter((email) => Date.parse(email.at) >= now - 30 * DAY_MS),
      "sent",
    ),
  };
}
