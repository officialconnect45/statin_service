import "server-only";
import { io } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminConfig } from "@/lib/admin/config";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

export type AdminSession = { username: string };

/**
 * Data Access Layer entry point. Reads the request cookie first, so callers
 * are always request-time (never baked into a prerendered shell).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const config = getAdminConfig();
  if (!token || !config) return null;

  // Token expiry is checked against the clock. App Shell prefetches can read
  // cookies but not the current time, so wait until the real request.
  await io();

  const payload = verifySessionToken(token, config);
  return payload ? { username: payload.sub } : null;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
