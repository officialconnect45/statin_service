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

// Business testimonials shown on the home page, managed from /admin/testimonials
export type TestimonialInput = {
  name: string;
  description: string;
  quote: string;
  /** https URL or a data:image/... URL from an upload. Empty shows initials. */
  logo: string;
  /** Lower numbers appear first. */
  sortOrder: number;
  published: boolean;
  highlight: boolean;
};

export type TestimonialRecord = TestimonialInput & {
  id: string;
  /** ISO timestamp. */
  createdAt: string;
  updatedAt: string;
};

export type TestimonialField = "name" | "description" | "quote" | "logo" | "sortOrder";

export type ListTestimonialsResponse = {
  testimonials: TestimonialRecord[];
};

export type SaveTestimonialResponse =
  | { status: "success"; testimonial: TestimonialRecord }
  | { status: "error"; message: string; errors?: Partial<Record<TestimonialField, string>> };

// Outreach mail sent from /admin/outreach (one message per recipient)
export type SendOutreachRequest = {
  /** Recipient email addresses; every one gets the same subject and body. */
  recipients: string[];
  subject: string;
  /** Plain text, sent as-is. */
  body: string;
  /** Sends one copy to MAIL_TEST_TO instead of the recipients. */
  test?: boolean;
};

export type OutreachResult = {
  email: string;
  status: "sent" | "failed";
  error?: string;
};

export type OutreachField = "recipients" | "subject" | "body";

export type SendOutreachResponse =
  | { status: "success"; results: OutreachResult[]; sent: number; failed: number }
  | { status: "error"; message: string; errors?: Partial<Record<OutreachField, string>> };
