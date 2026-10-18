import "server-only";
import { createHash } from "node:crypto";

export type AdminPassword = { hash: string } | { plain: string };

export type AdminConfig = {
  username: string;
  password: AdminPassword;
  /** Changes whenever the password changes; mixed into the session key. */
  passwordFingerprint: string;
  sessionSecret: string;
};

const sha256 = (value: string) => createHash("sha256").update(value).digest("base64url");

/**
 * Superadmin credentials come from the environment (.env.local locally, the
 * host's env settings in production). Either:
 *   ADMIN_PASSWORD=<plain password>                      simplest, set it in the host
 *   ADMIN_PASSWORD_HASH=scrypt:...                       from `npm run admin:password`
 * ADMIN_PASSWORD wins when both are set. ADMIN_USERNAME defaults to
 * "superadmin". ADMIN_SESSION_SECRET (32+ chars) is optional; without it the
 * session key is derived from the credentials. Returns null until a password
 * is present.
 */
export function getAdminConfig(): AdminConfig | null {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const plainPassword = process.env.ADMIN_PASSWORD;
  if (!passwordHash && !plainPassword) return null;

  const username = process.env.ADMIN_USERNAME?.trim() || "superadmin";
  const password: AdminPassword = plainPassword ? { plain: plainPassword } : { hash: passwordHash! };
  const passwordFingerprint = "hash" in password ? password.hash : sha256(password.plain);

  const configuredSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  const sessionSecret =
    configuredSecret && configuredSecret.length >= 32
      ? configuredSecret
      : sha256(`statin-admin-session:${username}:${passwordFingerprint}`);

  return { username, password, passwordFingerprint, sessionSecret };
}
