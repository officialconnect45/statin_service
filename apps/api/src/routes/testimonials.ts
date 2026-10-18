import type {
  ListTestimonialsResponse,
  SaveTestimonialResponse,
  TestimonialField,
  TestimonialInput,
  TestimonialRecord,
} from "@statin/types";
import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { MAX_LOGO_LENGTH, Testimonial } from "../db/models/testimonial.model.js";

type StoredTestimonial = {
  _id: { toString(): string };
  name?: string;
  description?: string;
  quote?: string;
  logo?: string;
  sortOrder?: number;
  published?: boolean;
  highlight?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

const SORT = { sortOrder: 1, createdAt: 1 } as const;
const DATA_URL = /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/;

function toRecord(doc: StoredTestimonial): TestimonialRecord {
  return {
    id: doc._id.toString(),
    name: doc.name ?? "",
    description: doc.description ?? "",
    quote: doc.quote ?? "",
    logo: doc.logo ?? "",
    sortOrder: doc.sortOrder ?? 0,
    published: doc.published ?? false,
    highlight: doc.highlight ?? false,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : "",
  };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

type Parsed =
  | { ok: true; input: TestimonialInput }
  | { ok: false; errors: Partial<Record<TestimonialField, string>> };

function parseInput(body: Partial<Record<keyof TestimonialInput, unknown>>): Parsed {
  const input: TestimonialInput = {
    name: String(body.name ?? "").trim(),
    description: String(body.description ?? "").trim(),
    quote: String(body.quote ?? "").trim(),
    logo: String(body.logo ?? "").trim(),
    sortOrder: Number(body.sortOrder ?? 0),
    published: body.published === true,
    highlight: body.highlight === true,
  };

  const errors: Partial<Record<TestimonialField, string>> = {};
  if (input.name.length < 1 || input.name.length > 80) errors.name = "Enter the business name (up to 80 characters).";
  if (input.description.length > 120) errors.description = "Keep the description under 120 characters.";
  if (input.quote.length < 10 || input.quote.length > 600) errors.quote = "Enter a quote between 10 and 600 characters.";
  if (!Number.isInteger(input.sortOrder) || Math.abs(input.sortOrder) > 1_000_000) {
    errors.sortOrder = "Use a whole number.";
  }
  if (input.logo) {
    if (input.logo.startsWith("data:")) {
      if (input.logo.length > MAX_LOGO_LENGTH) errors.logo = "Logo must be 500 KB or smaller.";
      else if (!DATA_URL.test(input.logo)) errors.logo = "Upload a PNG, JPG, WebP, GIF, or SVG image.";
    } else if (input.logo.length > 2048 || !isHttpUrl(input.logo)) {
      errors.logo = "Enter a full image URL starting with https://";
    }
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, input };
}

// ── Public: published testimonials for the home page ─────────────────────────
export async function listPublishedTestimonials(_req: Request, res: Response<ListTestimonialsResponse | { error: string }>) {
  try {
    const docs = await Testimonial.find({ published: true }).sort(SORT).lean<StoredTestimonial[]>();
    res.set("Cache-Control", "no-store");
    return res.json({ testimonials: docs.map(toRecord) });
  } catch (err) {
    console.error("[testimonials] Failed to list published:", err);
    return res.status(500).json({ error: "Could not load testimonials." });
  }
}

// ── Admin (ADMIN_API_KEY) ─────────────────────────────────────────────────────
export async function listAllTestimonials(_req: Request, res: Response<ListTestimonialsResponse | { error: string }>) {
  try {
    const docs = await Testimonial.find({}).sort(SORT).lean<StoredTestimonial[]>();
    res.set("Cache-Control", "no-store");
    return res.json({ testimonials: docs.map(toRecord) });
  } catch (err) {
    console.error("[testimonials] Failed to list:", err);
    return res.status(500).json({ error: "Could not load testimonials." });
  }
}

export async function createTestimonial(req: Request, res: Response<SaveTestimonialResponse>) {
  const parsed = parseInput(req.body ?? {});
  if (!parsed.ok) {
    return res.status(422).json({ status: "error", message: "Check the highlighted fields.", errors: parsed.errors });
  }
  try {
    const doc = await Testimonial.create(parsed.input);
    return res.status(201).json({ status: "success", testimonial: toRecord(doc.toObject()) });
  } catch (err) {
    console.error("[testimonials] Create failed:", err);
    return res.status(500).json({ status: "error", message: "Could not save the testimonial." });
  }
}

export async function updateTestimonial(req: Request<{ id: string }>, res: Response<SaveTestimonialResponse>) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).json({ status: "error", message: "Testimonial not found." });
  }
  const parsed = parseInput(req.body ?? {});
  if (!parsed.ok) {
    return res.status(422).json({ status: "error", message: "Check the highlighted fields.", errors: parsed.errors });
  }
  try {
    const doc = await Testimonial.findByIdAndUpdate(req.params.id, parsed.input, {
      returnDocument: "after",
      runValidators: true,
    }).lean<StoredTestimonial>();
    if (!doc) return res.status(404).json({ status: "error", message: "Testimonial not found." });
    return res.json({ status: "success", testimonial: toRecord(doc) });
  } catch (err) {
    console.error("[testimonials] Update failed:", err);
    return res.status(500).json({ status: "error", message: "Could not save the testimonial." });
  }
}

export async function deleteTestimonial(req: Request<{ id: string }>, res: Response) {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ error: "Testimonial not found." });
  try {
    const doc = await Testimonial.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Testimonial not found." });
    return res.status(204).end();
  } catch (err) {
    console.error("[testimonials] Delete failed:", err);
    return res.status(500).json({ error: "Could not delete the testimonial." });
  }
}
