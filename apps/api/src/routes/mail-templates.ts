import type {
  ListMailTemplatesResponse,
  MailTemplateField,
  MailTemplateInput,
  MailTemplateRecord,
  SaveMailTemplateResponse,
} from "@statin/types";
import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import {
  MAX_BODY_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SUBJECT_LENGTH,
  MIN_BODY_LENGTH,
  MailTemplate,
} from "../db/models/mail-template.model.js";

type StoredMailTemplate = {
  _id: { toString(): string };
  name?: string;
  subject?: string;
  body?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

const SORT = { name: 1, createdAt: 1 } as const;

function toRecord(doc: StoredMailTemplate): MailTemplateRecord {
  return {
    id: doc._id.toString(),
    name: doc.name ?? "",
    subject: doc.subject ?? "",
    body: doc.body ?? "",
    active: doc.active ?? false,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : "",
  };
}

type Parsed =
  | { ok: true; input: MailTemplateInput }
  | { ok: false; errors: Partial<Record<MailTemplateField, string>> };

function parseInput(body: Partial<Record<keyof MailTemplateInput, unknown>>): Parsed {
  const input: MailTemplateInput = {
    name: String(body.name ?? "").trim(),
    subject: String(body.subject ?? "").trim(),
    // Keep the message's own spacing; only drop blank space at the ends.
    body: String(body.body ?? "").replace(/\r\n/g, "\n").trim(),
    active: body.active === true,
  };

  const errors: Partial<Record<MailTemplateField, string>> = {};
  if (input.name.length < 1 || input.name.length > MAX_NAME_LENGTH) {
    errors.name = `Enter a template name (up to ${MAX_NAME_LENGTH} characters).`;
  }
  if (input.subject.length < 1 || input.subject.length > MAX_SUBJECT_LENGTH) {
    errors.subject = `Enter a subject (up to ${MAX_SUBJECT_LENGTH} characters).`;
  }
  if (input.body.length < MIN_BODY_LENGTH || input.body.length > MAX_BODY_LENGTH) {
    errors.body = "Write the message (10 to 20,000 characters).";
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, input };
}

// ── Admin (ADMIN_API_KEY) ─────────────────────────────────────────────────────
/** Every template, or only active ones with ?active=true (the outreach selector). */
export async function listMailTemplates(req: Request, res: Response<ListMailTemplatesResponse | { error: string }>) {
  try {
    const filter = req.query.active === "true" ? { active: true } : {};
    const docs = await MailTemplate.find(filter).sort(SORT).lean<StoredMailTemplate[]>();
    res.set("Cache-Control", "no-store");
    return res.json({ templates: docs.map(toRecord) });
  } catch (err) {
    console.error("[mail-templates] Failed to list:", err);
    return res.status(500).json({ error: "Could not load templates." });
  }
}

export async function createMailTemplate(req: Request, res: Response<SaveMailTemplateResponse>) {
  const parsed = parseInput(req.body ?? {});
  if (!parsed.ok) {
    return res.status(422).json({ status: "error", message: "Check the highlighted fields.", errors: parsed.errors });
  }
  try {
    const doc = await MailTemplate.create(parsed.input);
    return res.status(201).json({ status: "success", template: toRecord(doc.toObject()) });
  } catch (err) {
    console.error("[mail-templates] Create failed:", err);
    return res.status(500).json({ status: "error", message: "Could not save the template." });
  }
}

export async function updateMailTemplate(req: Request<{ id: string }>, res: Response<SaveMailTemplateResponse>) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).json({ status: "error", message: "Template not found." });
  }
  const parsed = parseInput(req.body ?? {});
  if (!parsed.ok) {
    return res.status(422).json({ status: "error", message: "Check the highlighted fields.", errors: parsed.errors });
  }
  try {
    const doc = await MailTemplate.findByIdAndUpdate(req.params.id, parsed.input, {
      returnDocument: "after",
      runValidators: true,
    }).lean<StoredMailTemplate>();
    if (!doc) return res.status(404).json({ status: "error", message: "Template not found." });
    return res.json({ status: "success", template: toRecord(doc) });
  } catch (err) {
    console.error("[mail-templates] Update failed:", err);
    return res.status(500).json({ status: "error", message: "Could not save the template." });
  }
}

export async function deleteMailTemplate(req: Request<{ id: string }>, res: Response) {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Template not found." });
  try {
    const doc = await MailTemplate.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Template not found." });
    return res.status(204).end();
  } catch (err) {
    console.error("[mail-templates] Delete failed:", err);
    return res.status(500).json({ error: "Could not delete the template." });
  }
}
