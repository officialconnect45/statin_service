import { createHash, timingSafeEqual } from "node:crypto";
import type { InquiryRecord, ListInquiriesResponse } from "@statin/types";
import type { NextFunction, Request, Response } from "express";
import { Inquiry } from "../db/models/inquiry.model.js";

const MAX_RESULTS = 5000;

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

/**
 * Server-to-server guard for admin endpoints. The web app's admin dashboard
 * sends `Authorization: Bearer <ADMIN_API_KEY>` after verifying the admin
 * session. Without a configured key the endpoints stay closed.
 */
export function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_API_KEY?.trim();
  if (!expected || expected.length < 32) {
    return res.status(503).json({ error: "Admin API is not configured." });
  }

  const header = req.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!provided || !timingSafeEqual(digest(provided), digest(expected))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}

type StoredInquiry = {
  _id: { toString(): string };
  name?: string;
  email?: string;
  company?: string;
  practice?: string;
  stage?: string;
  timeline?: string;
  message?: string;
  createdAt?: Date;
};

export async function listInquiries(_req: Request, res: Response<ListInquiriesResponse | { error: string }>) {
  try {
    const docs = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .limit(MAX_RESULTS)
      .lean<StoredInquiry[]>();

    const inquiries: InquiryRecord[] = docs.map((doc) => ({
      id: doc._id.toString(),
      at: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
      name: doc.name ?? "",
      email: doc.email ?? "",
      company: doc.company ?? "",
      practice: doc.practice ?? "",
      stage: doc.stage ?? "",
      timeline: doc.timeline ?? "",
      message: doc.message ?? "",
    }));

    res.set("Cache-Control", "no-store");
    return res.json({ inquiries });
  } catch (err) {
    console.error("[admin] Failed to list inquiries:", err);
    return res.status(500).json({ error: "Could not load inquiries." });
  }
}
