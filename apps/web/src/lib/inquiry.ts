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
