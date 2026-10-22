import type {
  OutreachField,
  OutreachRecipient,
  OutreachResult,
  SendOutreachRequest,
  SendOutreachResponse,
} from "@statin/types";
import type { Request, Response } from "express";
import { getMailConfig, getTransporter, textToHtml } from "../mail.js";

export const MAX_RECIPIENTS = 30;
const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;
// Pause between messages so the SMTP relay doesn't throttle the batch.
const SEND_GAP_MS = 200;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function fill(template: string, recipient: OutreachRecipient) {
  return template
    .replace(/\{\{\s*name\s*\}\}/gi, recipient.name || "there")
    .replace(/\{\{\s*email\s*\}\}/gi, recipient.email);
}

function parseRecipients(value: unknown): OutreachRecipient[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const recipients: OutreachRecipient[] = [];
  for (const item of value) {
    const email = String((item as OutreachRecipient)?.email ?? "").trim().toLowerCase();
    const name = String((item as OutreachRecipient)?.name ?? "").trim().slice(0, 80);
    if (!email || seen.has(email)) continue;
    seen.add(email);
    recipients.push({ email, name });
  }
  return recipients;
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
    recipients = [{ email: config.testTo, name: recipients[0]?.name ?? "" }];
  } else {
    const invalid = recipients.filter((r) => !EMAIL.test(r.email) || r.email.length > 254);
    if (recipients.length === 0) errors.recipients = "Add at least one email address.";
    else if (invalid.length > 0) errors.recipients = `Fix invalid addresses: ${invalid.map((r) => r.email).join(", ")}`;
    else if (recipients.length > MAX_RECIPIENTS) {
      errors.recipients = `Send to at most ${MAX_RECIPIENTS} addresses at a time.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ status: "error", message: "Check the highlighted fields.", errors });
  }

  const transporter = getTransporter();
  const results: OutreachResult[] = [];

  for (const [index, recipient] of recipients.entries()) {
    if (index > 0) await sleep(SEND_GAP_MS);
    const message = fill(text, recipient);
    try {
      await transporter.sendMail({
        from: config.from,
        replyTo: config.replyTo,
        to: recipient.name ? { name: recipient.name, address: recipient.email } : recipient.email,
        subject: (test ? "[Test] " : "") + fill(subject, recipient),
        text: message,
        html: textToHtml(message),
      });
      results.push({ email: recipient.email, status: "sent" });
    } catch (err) {
      console.error(`[outreach] Send to ${recipient.email} failed:`, err);
      const reason = err instanceof Error ? err.message : "Send failed";
      results.push({ email: recipient.email, status: "failed", error: reason.slice(0, 300) });
    }
  }

  const sent = results.filter((r) => r.status === "sent").length;
  console.log(`[outreach] ${test ? "Test" : "Batch"}: ${sent}/${results.length} sent`);
  return res.json({ status: "success", results, sent, failed: results.length - sent });
}
