import "server-only";
import type { ListMailTemplatesResponse, MailTemplateRecord } from "@statin/types";
import { requireAdmin } from "@/lib/admin/auth";
import { adminApiHeaders, apiUrl } from "@/lib/api";

// Mail templates live in MongoDB (statin_build → mail_templates), served by the
// Express API, managed from /admin/mail-templates and picked on /admin/outreach.
export type MailTemplate = MailTemplateRecord;

export class MailTemplatesUnavailableError extends Error {}

/** Every template, or only active ones for the outreach selector. Authorizes the admin first. */
export async function listMailTemplates({ activeOnly = false } = {}): Promise<MailTemplate[]> {
  await requireAdmin();

  let response: Response;
  try {
    response = await fetch(apiUrl(activeOnly ? "/admin/mail-templates?active=true" : "/admin/mail-templates"), {
      headers: adminApiHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("[mail-templates] Could not reach the API:", error);
    throw new MailTemplatesUnavailableError(
      "The API is not reachable. Check that it is running and API_BASE_URL is set.",
    );
  }

  if (!response.ok) {
    console.error(`[mail-templates] API responded ${response.status}`);
    throw new MailTemplatesUnavailableError(
      response.status === 401 || response.status === 503
        ? "The API rejected the admin key. Check ADMIN_API_KEY in both apps."
        : "The API could not load templates.",
    );
  }

  const data = (await response.json()) as ListMailTemplatesResponse;
  return data.templates;
}
