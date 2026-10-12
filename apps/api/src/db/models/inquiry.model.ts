import { Schema, model, Document } from "mongoose";

// ── TypeScript interface ──────────────────────────────────────────────────────
export interface IInquiry extends Document {
  name: string;
  email: string;
  company: string;
  practice: string;
  stage: string;
  timeline: string;
  message: string;
  createdAt: Date;
}

// ── Schema ────────────────────────────────────────────────────────────────────
const InquirySchema = new Schema<IInquiry>(
  {
    name:     { type: String, required: true, trim: true, maxlength: 80 },
    email:    { type: String, required: true, trim: true, maxlength: 120, lowercase: true },
    company:  { type: String, required: true, trim: true, maxlength: 80 },
    practice: { type: String, required: true, trim: true },
    stage:    { type: String, default: "", trim: true },
    timeline: { type: String, default: "", trim: true },
    message:  { type: String, required: true, trim: true, maxlength: 4000 },
  },
  {
    // Automatically adds createdAt + updatedAt timestamps
    timestamps: true,
    // Store in 'inquiries' collection inside statin_build
    collection: "inquiries",
  },
);

// Prevent duplicate submissions from the same email (optional index)
InquirySchema.index({ email: 1, createdAt: -1 });

export const Inquiry = model<IInquiry>("Inquiry", InquirySchema);
