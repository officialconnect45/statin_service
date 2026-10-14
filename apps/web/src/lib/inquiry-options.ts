// Values are mirrored in apps/api/src/constants.ts. Keep them in sync.
export const inquiryOptions = {
  practices: [
    { value: "saas", label: "Web app or SaaS platform" },
    { value: "mobile", label: "Mobile app" },
    { value: "ecommerce", label: "Commerce system" },
    { value: "integrations", label: "Backend, data, or AI integration" },
    { value: "websites", label: "Business website" },
    { value: "agency", label: "White-label agency delivery" },
    { value: "unsure", label: "Not sure yet" },
  ],
  stages: [
    { value: "forming", label: "Still forming the idea" },
    { value: "building", label: "Building, nothing public yet" },
    { value: "live", label: "Something is already live" },
    { value: "replacing", label: "Replacing what we have" },
  ],
  timelines: [
    { value: "exploring", label: "Exploring" },
    { value: "month", label: "This month" },
    { value: "quarter", label: "This quarter" },
    { value: "later", label: "Later this year" },
  ],
} as const;
