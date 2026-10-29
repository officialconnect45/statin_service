"use server";

import type { MailTemplateField, MailTemplateInput, SaveMailTemplateResponse } from "@statin/types";
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

export async function deleteMailTemplate(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!ID.test(id)) return;

  const response = await fetch(apiUrl(`/admin/mail-templates/${id}`), {
    method: "DELETE",
    headers: adminApiHeaders(),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`Could not delete the template (API ${response.status}).`);
  }

  redirect("/admin/mail-templates");
}
