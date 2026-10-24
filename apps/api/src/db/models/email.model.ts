import { Schema, model, Document, Types } from "mongoose";

/**
 * Every email the API sends is stored here, whatever sent it.
 *
 *   EmailBatch    one bulk send (an outreach run): subject, body, counts
 *   EmailMessage  one email to one address, with its delivery status;
 *                 single sends (no batch) are stored the same way
 *
 * A message is written as "pending" before it goes to SMTP and updated to
 * "sent" or "failed" after, so a crash mid-batch still leaves a record.
 */

export const EMAIL_KINDS = ["outreach", "test", "system"] as const;
export type EmailKind = (typeof EMAIL_KINDS)[number];

export const EMAIL_STATUSES = ["pending", "sent", "failed"] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

// ── Batch ─────────────────────────────────────────────────────────────────────
export interface IEmailBatch extends Document {
  kind: EmailKind;
  subject: string;
  text: string;
  from: string;
  replyTo: string;
  /** Admin username that started the send, when known. */
  sentBy: string;
  total: number;
  sent: number;
  failed: number;
  status: "sending" | "done";
  finishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailBatchSchema = new Schema<IEmailBatch>(
  {
    kind:       { type: String, enum: EMAIL_KINDS, required: true },
    subject:    { type: String, required: true, maxlength: 300 },
    text:       { type: String, required: true, maxlength: 20_000 },
    from:       { type: String, required: true },
    replyTo:    { type: String, default: "" },
    sentBy:     { type: String, default: "", maxlength: 80 },
    total:      { type: Number, required: true },
    sent:       { type: Number, default: 0 },
    failed:     { type: Number, default: 0 },
    status:     { type: String, enum: ["sending", "done"], default: "sending" },
    finishedAt: { type: Date },
  },
  { timestamps: true, collection: "email_batches" },
);

EmailBatchSchema.index({ createdAt: -1 });

export const EmailBatch = model<IEmailBatch>("EmailBatch", EmailBatchSchema);

// ── Message ───────────────────────────────────────────────────────────────────
export interface IEmailMessage extends Document {
  batch?: Types.ObjectId;
  kind: EmailKind;
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
  status: EmailStatus;
  error: string;
  /** Message-ID returned by the SMTP relay; use it to trace delivery in Brevo. */
  messageId: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailMessageSchema = new Schema<IEmailMessage>(
  {
    batch:     { type: Schema.Types.ObjectId, ref: "EmailBatch" },
    kind:      { type: String, enum: EMAIL_KINDS, required: true },
    to:        { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    from:      { type: String, required: true },
    replyTo:   { type: String, default: "" },
    subject:   { type: String, required: true, maxlength: 300 },
    text:      { type: String, required: true, maxlength: 20_000 },
    status:    { type: String, enum: EMAIL_STATUSES, default: "pending" },
    error:     { type: String, default: "", maxlength: 500 },
    messageId: { type: String, default: "" },
    sentAt:    { type: Date },
  },
  { timestamps: true, collection: "email_messages" },
);

EmailMessageSchema.index({ batch: 1, createdAt: 1 });
EmailMessageSchema.index({ to: 1, createdAt: -1 });
EmailMessageSchema.index({ createdAt: -1 });

export const EmailMessage = model<IEmailMessage>("EmailMessage", EmailMessageSchema);
