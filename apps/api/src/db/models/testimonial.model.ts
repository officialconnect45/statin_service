import { Schema, model, Document } from "mongoose";

// ── TypeScript interface ──────────────────────────────────────────────────────
export interface ITestimonial extends Document {
  name: string;
  description: string;
  quote: string;
  /** https URL or data:image/... URL. Empty shows initials on the site. */
  logo: string;
  sortOrder: number;
  published: boolean;
  highlight: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Upload limit is 500 KB; base64 adds about a third.
export const MAX_LOGO_LENGTH = 700_000;

// ── Schema ────────────────────────────────────────────────────────────────────
const TestimonialSchema = new Schema<ITestimonial>(
  {
    name:        { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", trim: true, maxlength: 120 },
    quote:       { type: String, required: true, trim: true, maxlength: 600 },
    logo:        { type: String, default: "", maxlength: MAX_LOGO_LENGTH },
    sortOrder:   { type: Number, default: 0 },
    published:   { type: Boolean, default: true },
    highlight:   { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // Store in 'testimonials' collection inside statin_build
    collection: "testimonials",
  },
);

TestimonialSchema.index({ published: 1, sortOrder: 1, createdAt: 1 });

export const Testimonial = model<ITestimonial>("Testimonial", TestimonialSchema);
