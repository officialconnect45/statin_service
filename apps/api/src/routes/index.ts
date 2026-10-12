import { Router } from "express";
import { submitInquiry } from "./inquiry.js";

export const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// Inquiry submission
router.post("/inquiry", submitInquiry);
