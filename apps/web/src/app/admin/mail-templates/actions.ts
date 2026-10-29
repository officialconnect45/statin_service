"use server";

import type {
  MailTemplateField,
  MailTemplateInput,
  MailTemplateRecord,
  SaveMailTemplateResponse,
} from "@statin/types";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { adminApiHeaders, apiUrl } from "@/lib/api";

export type MailTemplateFormState = {
  message?: string;
  errors?: Partial<Record<MailTemplateField, string>>;
};

const ID = /^[a-f0-9]{24}$/i;

function readInput(formData: FormData): MailTemplateInput {
  return {
    name: String(formData.get("name") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    body: String(formData.get("body") ?? ""),
    active: formData.get("active") === "on",
  };
}

export async function saveMailTemplate(
  _previous: MailTemplateFormState,
  formData: FormData,
): Promise<MailTemplateFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (id && !ID.test(id)) return { message: "Template not found." };

  let response: Response;
  try {
    response = await fetch(apiUrl(id ? `/admin/mail-templates/${id}` : "/admin/mail-templates"), {
      method: id ? "PUT" : "POST",
      headers: { ...adminApiHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(readInput(formData)),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    console.error("[mail-templates] Save could not reach the API:", error);
    return { message: "The API is not reachable. Try again in a moment." };
  }

  const data = (await response.json().catch(() => null)) as SaveMailTemplateResponse | null;
  if (!response.ok || !data || data.status !== "success") {
    return {
      message: data && data.status === "error" ? data.message : "Could not save the template.",
      errors: data && data.status === "error" ? data.errors : undefined,
    };
  }

  redirect("/admin/mail-templates");
}

async function deleteOnApi(id: string) {
  const response = await fetch(apiUrl(`/admin/mail-templates/${id}`), {
    method: "DELETE",
    headers: adminApiHeaders(),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`Could not delete the template (API ${response.status}).`);
  }
}

export async function deleteMailTemplate(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!ID.test(id)) return;

  await deleteOnApi(id);
  redirect("/admin/mail-templates");
}

// ── Used from the outreach page: no redirect, the form updates in place ──────
export type QuickTemplateResult =
  | { ok: true; template: MailTemplateRecord }
  | { ok: false; message: string };

/** Saves the current outreach subject and message as a new active template. */
export async function createTemplateFromOutreach(input: {
  name: string;
  subject: string;
  body: string;
}): Promise<QuickTemplateResult> {
  await requireAdmin();

  let response: Response;
  try {
    response = await fetch(apiUrl("/admin/mail-templates"), {
      method: "POST",
      headers: { ...adminApiHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(input.name ?? ""),
        subject: String(input.subject ?? ""),
        body: String(input.body ?? ""),
        active: true,
      } satisfies MailTemplateInput),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    console.error("[mail-templates] Save could not reach the API:", error);
    return { ok: false, message: "The API is not reachable. Try again in a moment." };
  }

  const data = (await response.json().catch(() => null)) as SaveMailTemplateResponse | null;
  if (!response.ok || !data || data.status !== "success") {
    const errors = data && data.status === "error" ? data.errors : undefined;
    const message =
      errors?.name ?? errors?.subject ?? errors?.body ?? (data && data.status === "error" ? data.message : null);
    return { ok: false, message: message ?? "Could not save the template." };
  }
  return { ok: true, template: data.template };
}

export async function removeTemplateFromOutreach(id: string): Promise<{ ok: boolean; message?: string }> {
  await requireAdmin();
  if (!ID.test(String(id))) return { ok: false, message: "Template not found." };

  try {
    await deleteOnApi(id);
    return { ok: true };
  } catch (error) {
    console.error("[mail-templates] Delete failed:", error);
    return { ok: false, message: "Could not delete the template. Try again in a moment." };
  }
}
