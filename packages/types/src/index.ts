// Inquiry types shared between web (Next.js) and api (Express)

export type InquiryField =
  | "name"
  | "email"
  | "company"
  | "practice"
  | "message";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<InquiryField, string>>;
};

export const initialInquiryState: InquiryState = { status: "idle" };

// API request / response shapes
export type SubmitInquiryRequest = {
  name: string;
  email: string;
  company: string;
  practice: string;
  stage?: string;
  timeline?: string;
  message: string;
  /** Honeypot – must be absent/empty */
  company_url?: string;
};

export type SubmitInquiryResponse = {
  status: "success" | "error";
  message: string;
  errors?: Partial<Record<InquiryField, string>>;
};

// Admin: stored inquiries as returned by GET /api/v1/inquiries
export type InquiryRecord = {
  id: string;
  /** ISO timestamp of when the inquiry was stored. */
  at: string;
  name: string;
  email: string;
  company: string;
  practice: string;
  stage: string;
  timeline: string;
  message: string;
};

export type ListInquiriesResponse = {
  inquiries: InquiryRecord[];
};
