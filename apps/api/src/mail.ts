import nodemailer, { type Transporter } from "nodemailer";
import type { Types } from "mongoose";
import { EmailMessage, type EmailKind, type IEmailMessage } from "./db/models/email.model.js";

/**
 * Mail is split into two senders so bulk outreach can never hurt the
 * reputation of the main address:
 *
 *   main      hello@statin.io  client communication, system emails
 *   outreach  hello@statin.eu  bulk outreach from /admin/outreach
 *
 * Shared:
 *   MAIL_ENABLED=true
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 *   MAIL_TEST_TO                         target for "send test" from the admin
 * Main sender:
 *   SMTP_FROM_NAME, SMTP_FROM_EMAIL
 *   MAIL_REPLY_TO                        optional, defaults to SMTP_FROM_EMAIL
 * Outreach sender (required for outreach; it never falls back to the main address):
 *   OUTREACH_FROM_NAME, OUTREACH_FROM_EMAIL
 *   OUTREACH_REPLY_TO                    optional, defaults to OUTREACH_FROM_EMAIL
 *   OUTREACH_SMTP_HOST, OUTREACH_SMTP_PORT, OUTREACH_SMTP_SECURE,
 *   OUTREACH_SMTP_USER, OUTREACH_SMTP_PASS
 *                                        optional, a separate SMTP account;
 *                                        each one defaults to its SMTP_* value
 */
export type MailChannel = "main" | "outreach";

type SmtpSettings = { host: string; port: number; secure: boolean; user: string; pass: string };

export type MailConfig = {
  channel: MailChannel;
  from: { name: string; address: string };
  replyTo: string;
  testTo: string;
  smtp: SmtpSettings;
};

const transporters = new Map<MailChannel, Transporter>();

const env = (name: string) => process.env[name]?.trim() ?? "";

function smtpSettings(prefix: "" | "OUTREACH_"): SmtpSettings {
  const pick = (name: string) => (prefix ? env(prefix + name) : "") || env(name);
  return {
    host: pick("SMTP_HOST"),
    port: Number(pick("SMTP_PORT") || 587),
    secure: pick("SMTP_SECURE") === "true",
    user: pick("SMTP_USER"),
    // Password is not trimmed; it follows the user it belongs to.
    pass: (prefix && env(prefix + "SMTP_USER") ? process.env[prefix + "SMTP_PASS"] : process.env.SMTP_PASS) ?? "",
  };
}

export function getMailConfig(channel: MailChannel = "main"): MailConfig | null {
  if (env("MAIL_ENABLED") !== "true") return null;

  const outreach = channel === "outreach";
  const address = outreach ? env("OUTREACH_FROM_EMAIL") : env("SMTP_FROM_EMAIL");
  const smtp = smtpSettings(outreach ? "OUTREACH_" : "");
  if (!address || !smtp.host) return null;

  return {
    channel,
    from: { name: (outreach ? env("OUTREACH_FROM_NAME") : env("SMTP_FROM_NAME")) || "Statin", address },
    replyTo: (outreach ? env("OUTREACH_REPLY_TO") : env("MAIL_REPLY_TO")) || address,
    testTo: env("MAIL_TEST_TO"),
    smtp,
  };
}

export function getTransporter(config: MailConfig): Transporter {
  let transporter = transporters.get(config.channel);
  if (!transporter) {
    const { host, port, secure, user, pass } = config.smtp;
    transporter = nodemailer.createTransport({
      host,
      port,
      pool: true,
      secure,
      auth: user ? { user, pass } : undefined,
    });
    transporters.set(config.channel, transporter);
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
    const info = await getTransporter(config).sendMail({
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
