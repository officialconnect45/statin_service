"use server";

import type { SaveTestimonialResponse, TestimonialField, TestimonialInput } from "@statin/types";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { adminApiHeaders, apiUrl } from "@/lib/api";
import { TESTIMONIALS_TAG } from "@/lib/testimonials";

export type TestimonialFormState = {
  message?: string;
  errors?: Partial<Record<TestimonialField, string>>;
};

const ID = /^[a-f0-9]{24}$/i;

function readInput(formData: FormData): TestimonialInput {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    logo: String(formData.get("logo") ?? ""),
    sortOrder: Number(String(formData.get("sortOrder") ?? "0").trim() || 0),
    published: formData.get("published") === "on",
    highlight: formData.get("highlight") === "on",
  };
}

export async function saveTestimonial(
  _previous: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (id && !ID.test(id)) return { message: "Testimonial not found." };

  let response: Response;
  try {
    response = await fetch(apiUrl(id ? `/admin/testimonials/${id}` : "/admin/testimonials"), {
      method: id ? "PUT" : "POST",
      headers: { ...adminApiHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(readInput(formData)),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    console.error("[testimonials] Save could not reach the API:", error);
    return { message: "The API is not reachable. Try again in a moment." };
  }

  const data = (await response.json().catch(() => null)) as SaveTestimonialResponse | null;
  if (!response.ok || !data || data.status !== "success") {
    if (response.status === 413) return { errors: { logo: "Logo must be 500 KB or smaller." } };
    return {
      message: data && data.status === "error" ? data.message : "Could not save the testimonial.",
      errors: data && data.status === "error" ? data.errors : undefined,
    };
  }

  updateTag(TESTIMONIALS_TAG);
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!ID.test(id)) return;

  const response = await fetch(apiUrl(`/admin/testimonials/${id}`), {
    method: "DELETE",
    headers: adminApiHeaders(),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`Could not delete the testimonial (API ${response.status}).`);
  }

  updateTag(TESTIMONIALS_TAG);
  redirect("/admin/testimonials");
}
