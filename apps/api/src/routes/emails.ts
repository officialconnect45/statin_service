import type { ListSentEmailsResponse, SentEmailRecipient, SentEmailRecord } from "@statin/types";
import type { Request, Response } from "express";
import type { Types } from "mongoose";
import { EmailBatch, EmailMessage, type EmailKind, type EmailStatus } from "../db/models/email.model.js";

// Newest sends returned; older ones stay in the database.
const MAX_SENDS = 300;

type StoredBatch = {
  _id: Types.ObjectId;
  kind: EmailKind;
  subject: string;
  text: string;
  from: string;
  sentBy?: string;
  createdAt: Date;
};

type StoredMessage = {
  _id: Types.ObjectId;
  batch?: Types.ObjectId;
  kind: EmailKind;
  to: string;
  from: string;
  subject: string;
  text: string;
  status: EmailStatus;
  error?: string;
  sentAt?: Date;
  createdAt: Date;
};

function toRecipient(message: StoredMessage): SentEmailRecipient {
  return {
    email: message.to,
    status: message.status,
    ...(message.error ? { error: message.error } : {}),
    ...(message.sentAt ? { sentAt: new Date(message.sentAt).toISOString() } : {}),
  };
}

function toRecord(
  base: Omit<SentEmailRecord, "sent" | "failed" | "pending" | "recipients">,
  recipients: SentEmailRecipient[],
): SentEmailRecord {
  // Counted from the messages, so a batch interrupted mid-send still adds up.
  const count = (status: SentEmailRecipient["status"]) => recipients.filter((r) => r.status === status).length;
  return { ...base, sent: count("sent"), failed: count("failed"), pending: count("pending"), recipients };
}

// ── Admin (ADMIN_API_KEY): every stored send, newest first ───────────────────
export async function listSentEmails(_req: Request, res: Response<ListSentEmailsResponse | { error: string }>) {
  try {
    const [batches, singles] = await Promise.all([
      EmailBatch.find({}).sort({ createdAt: -1 }).limit(MAX_SENDS).lean<StoredBatch[]>(),
      EmailMessage.find({ batch: { $exists: false } }).sort({ createdAt: -1 }).limit(MAX_SENDS).lean<StoredMessage[]>(),
    ]);

    const messages = await EmailMessage.find({ batch: { $in: batches.map((batch) => batch._id) } })
      .sort({ createdAt: 1 })
      .lean<StoredMessage[]>();
    const byBatch = new Map<string, SentEmailRecipient[]>();
    for (const message of messages) {
      const key = String(message.batch);
      byBatch.set(key, [...(byBatch.get(key) ?? []), toRecipient(message)]);
    }

    const emails = [
      ...batches.map((batch) =>
        toRecord(
          {
            id: batch._id.toString(),
            at: new Date(batch.createdAt).toISOString(),
            kind: batch.kind,
            subject: batch.subject,
            body: batch.text,
            from: batch.from,
            sentBy: batch.sentBy ?? "",
          },
          byBatch.get(batch._id.toString()) ?? [],
        ),
      ),
      ...singles.map((message) =>
        toRecord(
          {
            id: message._id.toString(),
            at: new Date(message.createdAt).toISOString(),
            kind: message.kind,
            subject: message.subject,
            body: message.text,
            from: message.from,
            sentBy: "",
          },
          [toRecipient(message)],
        ),
      ),
    ]
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, MAX_SENDS);

    res.set("Cache-Control", "no-store");
    return res.json({ emails });
  } catch (err) {
    console.error("[emails] Failed to list sent emails:", err);
    return res.status(500).json({ error: "Could not load sent emails." });
  }
}
