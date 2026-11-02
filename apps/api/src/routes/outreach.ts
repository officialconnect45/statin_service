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

// {{name}} placeholders in a template. Must match VARIABLE in outreach-form.tsx.
const VARIABLE = /\{\{\s*([a-z_][a-z0-9_]*)\s*\}\}/gi;
const variablesIn = (...texts: string[]) => [
  ...new Set(texts.flatMap((value) => [...value.matchAll(VARIABLE)].map((m) => m[1].toLowerCase()))),
];
function websiteDomain(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  try {
    const url = new URL(/^(?:[a-z][a-z\d+.-]*:\/\/|\/\/)/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.hostname : value;
  } catch {
    return value;
  }
}
const fillVariables = (value: string, values: Record<string, string>) =>
  value.replace(VARIABLE, (whole, name: string) => {
    const key = name.toLowerCase();
    const replacement = values[key];
    if (replacement === undefined || replacement === "") return whole;
    return key === "website" ? websiteDomain(replacement) : replacement;
  });

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
  const names = variablesIn(subject, text);
  const rawVariables: Record<string, string[]> = {};
  for (const name of names) {
    const list = body.variables?.[name];
    rawVariables[name] = Array.isArray(list) ? list.map((item) => String(item ?? "").trim()) : [];
  }
  // variables[name][i] belongs to the i-th address as sent; a duplicate address is dropped with its values.
  const valuesOf = new Map<string, Record<string, string>>();
  if (Array.isArray(body.recipients)) {
    body.recipients.forEach((item, index) => {
      const email = String(item ?? "").trim().toLowerCase();
      if (!email || valuesOf.has(email)) return;
      valuesOf.set(email, Object.fromEntries(names.map((name) => [name, rawVariables[name][index] ?? ""])));
    });
  }

  const errors: Partial<Record<OutreachField, string>> = {};
  if (subject.length < 1 || subject.length > 200) errors.subject = "Enter a subject (up to 200 characters).";
  if (text.length < 10 || text.length > 20_000) errors.body = "Write the message (10 to 20,000 characters).";

  if (test) {
    if (!EMAIL.test(config.testTo)) {
      return res.status(503).json({ status: "error", message: "Set MAIL_TEST_TO on the API to send tests." });
    }
    const first = valuesOf.values().next().value as Record<string, string> | undefined;
    valuesOf.clear();
    valuesOf.set(
      config.testTo,
      Object.fromEntries(names.map((name) => [name, first?.[name] || `[${name}]`])),
    );
    recipients = [config.testTo];
  } else {
    const invalid = recipients.filter((email) => !EMAIL.test(email) || email.length > 254);
    if (recipients.length === 0) errors.recipients = "Add at least one email address.";
    else if (invalid.length > 0) errors.recipients = `Fix invalid addresses: ${invalid.join(", ")}`;
    else if (recipients.length > MAX_RECIPIENTS) {
      errors.recipients = `Send to at most ${MAX_RECIPIENTS} addresses at a time.`;
    }
    for (const name of names) {
      const missing = recipients.filter((email) => !valuesOf.get(email)?.[name]);
      if (missing.length > 0) {
        errors.variables = `{{${name}}} is required for every email: ${missing.length} missing (first: ${missing[0]}).`;
        break;
      }
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
      recipients.map((to) => {
        const values = valuesOf.get(to) ?? {};
        return {
          to,
          subject: (test ? "[Test] " : "") + fillVariables(subject, values),
          text: fillVariables(text, values),
          kind,
          batch: batch._id,
        };
      }),
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
