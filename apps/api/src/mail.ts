import nodemailer, { type Transporter } from "nodemailer";
import type { Types } from "mongoose";
import { EmailMessage, type EmailKind, type IEmailMessage } from "./db/models/email.model.js";

/**
 * SMTP settings come from the environment:
 *   MAIL_ENABLED=true
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 *   SMTP_FROM_NAME, SMTP_FROM_EMAIL      sender shown to recipients
 *   MAIL_REPLY_TO                        optional, defaults to SMTP_FROM_EMAIL
 *   MAIL_TEST_TO                         target for "send test" from the admin
 */
export type MailConfig = {
  from: { name: string; address: string };
  replyTo: string;
  testTo: string;
};

let transporter: Transporter | null = null;

export function getMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const address = process.env.SMTP_FROM_EMAIL?.trim();
  if (process.env.MAIL_ENABLED?.trim() !== "true" || !host || !address) return null;

  return {
    from: { name: process.env.SMTP_FROM_NAME?.trim() || "Statin", address },
    replyTo: process.env.MAIL_REPLY_TO?.trim() || address,
    testTo: process.env.MAIL_TEST_TO?.trim() ?? "",
  };
}

export function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST?.trim(),
      port,
      pool: true,
      secure: process.env.SMTP_SECURE?.trim() === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER.trim(), pass: process.env.SMTP_PASS ?? "" }
        : undefined,
    });
  }
  return transporter;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Plain text → simple HTML: paragraphs on blank lines, <br> on single breaks, links clickable. */
export function textToHtml(text: string) {
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .map((block) =>
      escapeHtml(block)
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')
        .replace(/\n/g, "<br>"),
    )
    .map((block) => `<p style="margin:0 0 16px">${block}</p>`)
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111">${paragraphs}</div>`;
}

// ── Sending (always through here, so every email is stored) ──────────────────

export type EmailInput = {
  to: string;
  subject: string;
  /** Plain text body; the HTML part is generated from it. */
  text: string;
  kind: EmailKind;
  batch?: Types.ObjectId;
};

export type DeliveryResult = { status: "sent"; messageId: string } | { status: "failed"; error: string };

function formatFrom(config: MailConfig) {
  return `${config.from.name} <${config.from.address}>`;
}

/** Stores emails as "pending" before they are sent. */
export async function recordEmails(config: MailConfig, inputs: EmailInput[]) {
  return EmailMessage.insertMany(
    inputs.map((input) => ({
      ...input,
      from: formatFrom(config),
      replyTo: config.replyTo,
      status: "pending",
    })),
  );
}

/** Sends a stored email over SMTP and saves the outcome on its record. */
export async function deliverEmail(config: MailConfig, message: IEmailMessage): Promise<DeliveryResult> {
  let result: DeliveryResult;
  try {
    const info = await getTransporter().sendMail({
      from: config.from,
      replyTo: config.replyTo,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: textToHtml(message.text),
    });
    result = { status: "sent", messageId: String(info.messageId ?? "") };
  } catch (err) {
    console.error(`[mail] Send to ${message.to} failed:`, err);
    const reason = err instanceof Error ? err.message : "Send failed";
    result = { status: "failed", error: reason.slice(0, 300) };
  }

  try {
    await EmailMessage.updateOne(
      { _id: message._id },
      result.status === "sent"
        ? { status: "sent", messageId: result.messageId, sentAt: new Date() }
        : { status: "failed", error: result.error },
    );
  } catch (err) {
    // The email itself went out (or failed) already; only the log update is lost.
    console.error(`[mail] Could not save the outcome for ${message.to}:`, err);
  }
  return result;
}

/** Stores and sends one email. Nothing is sent if it cannot be stored. */
export async function sendEmail(config: MailConfig, input: EmailInput) {
  const [message] = await recordEmails(config, [input]);
  return deliverEmail(config, message);
}
