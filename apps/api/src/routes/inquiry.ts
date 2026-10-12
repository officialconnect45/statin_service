import type { SubmitInquiryRequest, SubmitInquiryResponse } from "@statin/types";
import type { Request, Response } from "express";
import { Inquiry } from "../db/models/inquiry.model.js";
import { VALID_PRACTICES, VALID_STAGES, VALID_TIMELINES } from "../constants.js";

export async function submitInquiry(
  req: Request<object, SubmitInquiryResponse, SubmitInquiryRequest>,
  res: Response<SubmitInquiryResponse>,
) {
  const body = req.body;

  // Honeypot check
  if (String(body.company_url ?? "").trim()) {
    return res.json({
      status: "success",
      message: "The brief is in. A partner reviews every inquiry and replies by email.",
    });
  }

  const name     = String(body.name     ?? "").trim();
  const email    = String(body.email    ?? "").trim();
  const company  = String(body.company  ?? "").trim();
  const practice = String(body.practice ?? "").trim();
  const stage    = String(body.stage    ?? "").trim();
  const timeline = String(body.timeline ?? "").trim();
  const message  = String(body.message  ?? "").trim();

  // ── Validation ──────────────────────────────────────────────────────────────
  const errors: SubmitInquiryResponse["errors"] = {};

  if (name.length < 2 || name.length > 80) {
    errors.name = "Enter your name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    errors.email = "Enter a work email we can reply to.";
  }

  if (company.length < 2 || company.length > 80) {
    errors.company = "Enter the company name.";
  }

  if (!VALID_PRACTICES.includes(practice as (typeof VALID_PRACTICES)[number])) {
    errors.practice = "Choose what you want to build.";
  }

  if (message.length < 20 || message.length > 4000) {
    errors.message = "Tell us a little more, in a few sentences.";
  }

  if (errors.name || errors.email || errors.company || errors.practice || errors.message) {
    return res.status(422).json({
      status: "error",
      message: "Check the highlighted fields.",
      errors,
    });
  }

  // ── Sanitise optional enum fields ──────────────────────────────────────────
  const stageValue    = VALID_STAGES.includes(stage as (typeof VALID_STAGES)[number]) ? stage : "";
  const timelineValue = VALID_TIMELINES.includes(timeline as (typeof VALID_TIMELINES)[number]) ? timeline : "";

  // ── Persist to MongoDB (statin_build → inquiries) ──────────────────────────
  try {
    await Inquiry.create({
      name,
      email,
      company,
      practice,
      stage:    stageValue,
      timeline: timelineValue,
      message,
    });
  } catch (err) {
    console.error("[inquiry] MongoDB save error:", err);
    return res.status(500).json({
      status: "error",
      message: "We could not save the brief. Email hello@statin.com and we will take it from there.",
    });
  }

  return res.json({
    status: "success",
    message: "The brief is in. A partner reviews every inquiry and replies by email.",
  });
}
