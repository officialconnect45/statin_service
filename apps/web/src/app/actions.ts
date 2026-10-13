"use server";

import type { SubmitInquiryRequest, SubmitInquiryResponse } from "@statin/types";
import { apiUrl } from "@/lib/api";
import type { InquiryState } from "@/lib/inquiry";
import { inquiryOptions } from "@/lib/inquiry-options";
import { site } from "@/lib/site";

export async function submitInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  if (String(formData.get("company_url") ?? "").trim()) {
    return {
      status: "success",
      message:
        "The brief is in. A partner reviews every inquiry and replies by email.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const practice = String(formData.get("practice") ?? "").trim();
  const stage = String(formData.get("stage") ?? "").trim();
  const timeline = String(formData.get("timeline") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: InquiryState["errors"] = {};

  if (name.length < 2 || name.length > 80) {
    errors.name = "Enter your name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    errors.email = "Enter a work email we can reply to.";
  }

  if (company.length < 2 || company.length > 80) {
    errors.company = "Enter the company name.";
  }

  if (!inquiryOptions.practices.some((item) => item.value === practice)) {
    errors.practice = "Choose what you want to build.";
  }

  if (message.length < 20 || message.length > 4000) {
    errors.message = "Tell us a little more, in a few sentences.";
  }

  if (errors.name || errors.email || errors.company || errors.practice || errors.message) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors,
    };
  }

  const stageValue = inquiryOptions.stages.some((item) => item.value === stage)
    ? stage
    : "";
  const timelineValue = inquiryOptions.timelines.some(
    (item) => item.value === timeline,
  )
    ? timeline
    : "";

  const payload: SubmitInquiryRequest = {
    name,
    email,
    company,
    practice,
    stage: stageValue,
    timeline: timelineValue,
    message,
  };

  // Stored in MongoDB by the Express API (POST /api/v1/inquiry).
  const failure: InquiryState = {
    status: "error",
    message: `We could not save the brief. Email ${site.email} and we will take it from there.`,
  };

  try {
    const response = await fetch(apiUrl("/inquiry"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const result = (await response.json().catch(() => null)) as SubmitInquiryResponse | null;

    if (response.status === 422 && result?.errors) {
      return { status: "error", message: result.message, errors: result.errors };
    }
    if (!response.ok || result?.status !== "success") {
      console.error(`[inquiry] API responded ${response.status}`);
      return failure;
    }
  } catch (error) {
    console.error("[inquiry] Could not reach the API:", error);
    return failure;
  }

  return {
    status: "success",
    message:
      "The brief is in. A partner reviews every inquiry and replies by email.",
  };
}
