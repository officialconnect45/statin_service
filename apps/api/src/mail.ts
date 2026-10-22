import nodemailer, { type Transporter } from "nodemailer";

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
