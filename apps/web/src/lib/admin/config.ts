import "server-only";

export type AdminConfig = {
  username: string;
  passwordHash: string;
  sessionSecret: string;
};

/**
 * Superadmin credentials come from the environment. Set them with
 * `npm run admin:password` (writes apps/web/.env.local) or in your host's
 * environment settings. Returns null until both values are present.
 */
export function getAdminConfig(): AdminConfig | null {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!passwordHash || !sessionSecret || sessionSecret.length < 32) return null;

  return {
    username: process.env.ADMIN_USERNAME?.trim() || "superadmin",
    passwordHash,
    sessionSecret,
  };
}
