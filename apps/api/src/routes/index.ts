import { Router } from "express";
import { listInquiries, requireAdminKey } from "./admin.js";
import { submitInquiry } from "./inquiry.js";

export const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// Inquiry submission (public, called by the web app's contact form)
router.post("/inquiry", submitInquiry);

// Stored inquiries (admin only, server-to-server with ADMIN_API_KEY)
router.get("/inquiries", requireAdminKey, listInquiries);
