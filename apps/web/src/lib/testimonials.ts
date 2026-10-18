import "server-only";
import type { ListTestimonialsResponse, TestimonialRecord } from "@statin/types";
import { cacheLife, cacheTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { adminApiHeaders, apiUrl } from "@/lib/api";

// Testimonials live in MongoDB (statin_build → testimonials), served by the
// Express API and managed from /admin/testimonials.
export type Testimonial = TestimonialRecord;

export const TESTIMONIALS_TAG = "testimonials";

export class TestimonialsUnavailableError extends Error {}

/**
 * Published testimonials for the home page. Cached; admin saves call
 * updateTag(TESTIMONIALS_TAG) so changes show on the next request.
 */
export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag(TESTIMONIALS_TAG);

  try {
    const response = await fetch(apiUrl("/testimonials"), { signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error(`API responded ${response.status}`);
    const data = (await response.json()) as ListTestimonialsResponse;
    cacheLife("hours");
    return data.testimonials;
  } catch (error) {
    // Hide the section rather than failing the page; retry soon.
    console.error("[testimonials] Could not load published testimonials:", error);
    cacheLife("seconds");
    return [];
  }
}

/** Every testimonial, including drafts. Authorizes the admin first. */
export async function listTestimonials(): Promise<Testimonial[]> {
  await requireAdmin();

  let response: Response;
  try {
    response = await fetch(apiUrl("/admin/testimonials"), {
      headers: adminApiHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("[testimonials] Could not reach the API:", error);
    throw new TestimonialsUnavailableError(
      "The API is not reachable. Check that it is running and API_BASE_URL is set.",
    );
  }

  if (!response.ok) {
    console.error(`[testimonials] API responded ${response.status}`);
    throw new TestimonialsUnavailableError(
      response.status === 401 || response.status === 503
        ? "The API rejected the admin key. Check ADMIN_API_KEY in both apps."
        : "The API could not load testimonials.",
    );
  }

  const data = (await response.json()) as ListTestimonialsResponse;
  return data.testimonials;
}
