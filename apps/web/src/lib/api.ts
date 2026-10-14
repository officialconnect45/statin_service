import "server-only";

/** Base URL of the Express API (server-side only), e.g. http://localhost:4000/api/v1 */
export function apiUrl(path: string) {
  const base = process.env.API_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) throw new Error("API_BASE_URL is not set.");
  return `${base}${path}`;
}

/** Bearer header for admin-only API endpoints. */
export function adminApiHeaders(): HeadersInit {
  const key = process.env.ADMIN_API_KEY?.trim();
  if (!key) throw new Error("ADMIN_API_KEY is not set.");
  return { Authorization: `Bearer ${key}` };
}
