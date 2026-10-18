import { Router } from "express";
import { listInquiries, requireAdminKey } from "./admin.js";
import { submitInquiry } from "./inquiry.js";
import {
  createTestimonial,
  deleteTestimonial,
  listAllTestimonials,
  listPublishedTestimonials,
  updateTestimonial,
} from "./testimonials.js";

export const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// Inquiry submission (public, called by the web app's contact form)
router.post("/inquiry", submitInquiry);

// Stored inquiries (admin only, server-to-server with ADMIN_API_KEY)
router.get("/inquiries", requireAdminKey, listInquiries);

// Testimonials: published list is public (home page); management is admin only
router.get("/testimonials", listPublishedTestimonials);
router.get("/admin/testimonials", requireAdminKey, listAllTestimonials);
router.post("/admin/testimonials", requireAdminKey, createTestimonial);
router.put("/admin/testimonials/:id", requireAdminKey, updateTestimonial);
router.delete("/admin/testimonials/:id", requireAdminKey, deleteTestimonial);
