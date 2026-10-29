import { Schema, model, Document } from "mongoose";

// ── TypeScript interface ──────────────────────────────────────────────────────
export interface IMailTemplate extends Document {
  name: string;
  subject: string;
  body: string;
  /** Inactive templates are hidden from the outreach selector. */
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Must match the subject/body limits in routes/outreach.ts
export const MAX_NAME_LENGTH = 80;
export const MAX_SUBJECT_LENGTH = 200;
export const MIN_BODY_LENGTH = 10;
export const MAX_BODY_LENGTH = 20_000;

// ── Schema ────────────────────────────────────────────────────────────────────
const MailTemplateSchema = new Schema<IMailTemplate>(
  {
    name:    { type: String, required: true, trim: true, maxlength: MAX_NAME_LENGTH },
    subject: { type: String, required: true, trim: true, maxlength: MAX_SUBJECT_LENGTH },
    body:    { type: String, required: true, minlength: MIN_BODY_LENGTH, maxlength: MAX_BODY_LENGTH },
    active:  { type: Boolean, default: true },
  },
  {
    timestamps: true,
    // Store in 'mail_templates' collection inside statin_build
    collection: "mail_templates",
  },
);

MailTemplateSchema.index({ active: 1, name: 1 });

export const MailTemplate = model<IMailTemplate>("MailTemplate", MailTemplateSchema);
