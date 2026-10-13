import "server-only";
import { createHash, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

/*
 * Stored format (written by scripts/set-admin-password.mjs):
 *   scrypt:<N>:<r>:<p>:<salt base64url>:<hash base64url>
 * Colons, not "$", because .env loaders expand "$NAME" sequences.
 */

function scryptAsync(password: string, salt: Buffer, keylen: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keylen, options, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, n, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, "base64url");
  if (expected.length < 32) return false;

  try {
    const actual = await scryptAsync(password.normalize("NFKC"), Buffer.from(salt, "base64url"), expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 64 * 1024 * 1024,
    });
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Constant-time string comparison that does not leak length. */
export function safeEqual(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}
