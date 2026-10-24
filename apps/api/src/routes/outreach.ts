import type {
  OutreachField,
  OutreachResult,
  OutreachSenderResponse,
  SendOutreachRequest,
  SendOutreachResponse,
} from "@statin/types";
import type { Request, Response } from "express";
import { EmailBatch } from "../db/models/email.model.js";
import { deliverEmail, getMailConfig, recordEmails } from "../mail.js";

export const MAX_RECIPIENTS = 50;
const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;
// Pause between messages so the SMTP relay doesn't throttle the batch.
const SEND_GAP_MS = 200;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function parseRecipients(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const emails = value.map((item) => String(item ?? "").trim().toLowerCase()).filter(Boolean);
  return [...new Set(emails)];
}

// ── Admin (ADMIN_API_KEY): the outreach sender, shown on the outreach page ──
export function getOutreachSender(_req: Request, res: Response<OutreachSenderResponse>) {
  const config = getMailConfig("outreach");
  res.set("Cache-Control", "no-store");
  if (!config) return res.json({ configured: false });
  return res.json({
    configured: true,
    from: `${config.from.name} <${config.from.address}>`,
    replyTo: config.replyTo,
  });
}

// ── Admin (ADMIN_API_KEY): send one message per recipient ────────────────────
// The batch and every message are stored (email_batches / email_messages)
// before anything is sent; each message is then updated with its outcome.
export async function sendOutreach(
  req: Request<object, SendOutreachResponse, Partial<SendOutreachRequest>>,
  res: Response<SendOutreachResponse>,
) {
  // Outreach always goes out from its own sender (hello@statin.eu), never the main address.
  const config = getMailConfig("outreach");
  if (!config) {
    return res.status(503).json({
      status: "error",
      message: "Outreach mail is not configured. Set MAIL_ENABLED=true, the SMTP_* variables and OUTREACH_FROM_EMAIL on the API.",
    });
  }

  const body = req.body ?? {};
  const subject = String(body.subject ?? "").trim();
  const text = String(body.body ?? "").replace(/\r\n/g, "\n").trim();
  const test = body.test === true;
  const sentBy = String(body.sentBy ?? "").trim().slice(0, 80);
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

  const kind = test ? "test" : "outreach";
  const fullSubject = (test ? "[Test] " : "") + subject;

  let stored;
  try {
    const batch = await EmailBatch.create({
      kind,
      subject: fullSubject,
      text,
      from: `${config.from.name} <${config.from.address}>`,
      replyTo: config.replyTo,
      sentBy,
      total: recipients.length,
    });
    const messages = await recordEmails(
      config,
      recipients.map((to) => ({ to, subject: fullSubject, text, kind, batch: batch._id })),
    );
    stored = { batch, messages };
  } catch (err) {
    console.error("[outreach] Could not store the batch:", err);
    return res.status(500).json({ status: "error", message: "Could not save the emails to the database. Nothing was sent." });
  }

  const { batch, messages } = stored;
  const results: OutreachResult[] = [];
  for (const [index, message] of messages.entries()) {
    if (index > 0) await sleep(SEND_GAP_MS);
    const result = await deliverEmail(config, message);
    results.push(
      result.status === "sent"
        ? { email: message.to, status: "sent" }
        : { email: message.to, status: "failed", error: result.error },
    );
  }

  const sent = results.filter((r) => r.status === "sent").length;
  const failed = results.length - sent;
  await EmailBatch.updateOne({ _id: batch._id }, { sent, failed, status: "done", finishedAt: new Date() }).catch((err) =>
    console.error("[outreach] Could not update the batch totals:", err),
  );

  console.log(`[outreach] ${test ? "Test" : "Batch"} ${batch.id}: ${sent}/${results.length} sent`);
  return res.json({ status: "success", batchId: batch.id, results, sent, failed });
}
