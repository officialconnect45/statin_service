// Validation constants mirrored from the web app's site config.
// Keep in sync with apps/web/src/lib/site.ts → inquiryOptions
export const VALID_PRACTICES = ["websites", "saas", "ecommerce", "unsure"] as const;
export const VALID_STAGES = ["forming", "building", "live", "replacing"] as const;
export const VALID_TIMELINES = ["exploring", "month", "quarter", "later"] as const;

export type Practice = (typeof VALID_PRACTICES)[number];
export type Stage = (typeof VALID_STAGES)[number];
export type Timeline = (typeof VALID_TIMELINES)[number];
