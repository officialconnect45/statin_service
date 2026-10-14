"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminConfig } from "@/lib/admin/config";
import { safeEqual, verifyPassword } from "@/lib/admin/password";
import { clearLoginFailures, loginBlockedFor, recordLoginFailure } from "@/lib/admin/rate-limit";
import { clearSessionCookie, createSessionToken, setSessionCookie } from "@/lib/admin/session";

export type LoginState = { error?: string };

const FAILURE_DELAY_MS = 600;

async function clientKey() {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "local";
}

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const config = getAdminConfig();
  if (!config) {
    return { error: "Admin access is not set up yet. Run npm run admin:password first." };
  }

  const key = await clientKey();
  const blockedMs = loginBlockedFor(key);
  if (blockedMs > 0) {
    const minutes = Math.ceil(blockedMs / 60000);
    return { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // Always run the password check so timing does not reveal a wrong username.
  const passwordOk = password.length > 0 && password.length <= 256 && (await verifyPassword(password, config.passwordHash));
  const usernameOk = safeEqual(username, config.username);

  if (!passwordOk || !usernameOk) {
    recordLoginFailure(key);
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return { error: "Incorrect username or password." };
  }

  clearLoginFailures(key);
  await setSessionCookie(createSessionToken(config));
  redirect("/admin/leads");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/admin/login");
}
