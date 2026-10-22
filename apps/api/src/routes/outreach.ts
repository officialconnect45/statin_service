import type { OutreachField, OutreachResult, SendOutreachRequest, SendOutreachResponse } from "@statin/types";
import type { Request, Response } from "express";
import { getMailConfig, getTransporter, textToHtml } from "../mail.js";

export const MAX_RECIPIENTS = 30;
const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;
// Pause between messages so the SMTP relay doesn't throttle the batch.
const SEND_GAP_MS = 200;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function parseRecipients(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const emails = value.map((item) => String(item ?? "").trim().toLowerCase()).filter(Boolean);
  return [...new Set(emails)];
}

// ── Admin (ADMIN_API_KEY): send one message per recipient ────────────────────
export async function sendOutreach(
  req: Request<object, SendOutreachResponse, Partial<SendOutreachRequest>>,
  res: Response<SendOutreachResponse>,
) {
  const config = getMailConfig();
  if (!config) {
    return res.status(503).json({
      status: "error",
      message: "Mail is not configured. Set MAIL_ENABLED=true and the SMTP_* variables on the API.",
    });
  }

  const body = req.body ?? {};
  const subject = String(body.subject ?? "").trim();
  const text = String(body.body ?? "").replace(/\r\n/g, "\n").trim();
  const test = body.test === true;
  let recipients = parseRecipients(body.recipients);

  const errors: Partial<Record<OutreachField, string>> = {};
  if (subject.length < 1 || subject.length > 200) errors.subject = "Enter a subject (up to 200 characters).";
  if (text.length < 10 || text.length > 20_000) errors.body = "Write the message (10 to 20,000 characters).";

  if (test) {
    if (!EMAIL.test(config.testTo)) {
      return res.status(503).json({ status: "error", message: "Set MAIL_TEST_TO on the API to send tests." });
    }
    recipients = [config.testTo];
  } else {
    const invalid = recipients.filter((email) => !EMAIL.test(email) || email.length > 254);
    if (recipients.length === 0) errors.recipients = "Add at least one email address.";
    else if (invalid.length > 0) errors.recipients = `Fix invalid addresses: ${invalid.join(", ")}`;
    else if (recipients.length > MAX_RECIPIENTS) {
      errors.recipients = `Send to at most ${MAX_RECIPIENTS} addresses at a time.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ status: "error", message: "Check the highlighted fields.", errors });
  }

  const transporter = getTransporter();
  const html = textToHtml(text);
  const results: OutreachResult[] = [];

  for (const [index, email] of recipients.entries()) {
    if (index > 0) await sleep(SEND_GAP_MS);
    try {
      await transporter.sendMail({
        from: config.from,
        replyTo: config.replyTo,
        to: email,
        subject: (test ? "[Test] " : "") + subject,
        text,
        html,
      });
      results.push({ email, status: "sent" });
    } catch (err) {
      console.error(`[outreach] Send to ${email} failed:`, err);
      const reason = err instanceof Error ? err.message : "Send failed";
      results.push({ email, status: "failed", error: reason.slice(0, 300) });
    }
  }

  const sent = results.filter((r) => r.status === "sent").length;
  console.log(`[outreach] ${test ? "Test" : "Batch"}: ${sent}/${results.length} sent`);
  return res.json({ status: "success", results, sent, failed: results.length - sent });
}
