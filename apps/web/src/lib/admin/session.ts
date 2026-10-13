import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { AdminConfig } from "@/lib/admin/config";

export const SESSION_COOKIE = "statin_admin";
const SESSION_SECONDS = 60 * 60 * 8;

type SessionPayload = { sub: string; exp: number };

// The password hash is part of the signing key, so setting a new password
// immediately invalidates every existing session.
function signingKey(config: AdminConfig) {
  return `${config.sessionSecret}:${config.passwordHash}`;
}

function sign(data: string, config: AdminConfig) {
  return createHmac("sha256", signingKey(config)).update(data).digest("base64url");
}

export function createSessionToken(config: AdminConfig) {
  const payload: SessionPayload = {
    sub: config.username,
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data, config)}`;
}

export function verifySessionToken(token: string, config: AdminConfig): SessionPayload | null {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expected = Buffer.from(sign(data, config));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;
    if (payload.sub !== config.username) return null;
    if (typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/admin",
};

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_SECONDS });
}

export async function clearSessionCookie() {
  (await cookies()).set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
