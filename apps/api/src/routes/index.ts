import { Router } from "express";
import { listInquiries, requireAdminKey } from "./admin.js";
import { listSentEmails } from "./emails.js";
import { submitInquiry } from "./inquiry.js";
import {
  createMailTemplate,
  deleteMailTemplate,
  listMailTemplates,
  updateMailTemplate,
} from "./mail-templates.js";
import { getOutreachSender, sendOutreach } from "./outreach.js";
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

// Outreach mail (admin only): one SMTP message per recipient
router.get("/admin/outreach/sender", requireAdminKey, getOutreachSender);
router.post("/admin/outreach", requireAdminKey, sendOutreach);

// Mail templates (admin only): saved subjects and messages for outreach
router.get("/admin/mail-templates", requireAdminKey, listMailTemplates);
router.post("/admin/mail-templates", requireAdminKey, createMailTemplate);
router.put("/admin/mail-templates/:id", requireAdminKey, updateMailTemplate);
router.delete("/admin/mail-templates/:id", requireAdminKey, deleteMailTemplate);

// Sent mail history (admin only): every stored email, newest first
router.get("/admin/emails", requireAdminKey, listSentEmails);
