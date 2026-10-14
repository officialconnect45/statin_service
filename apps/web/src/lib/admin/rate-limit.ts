import "server-only";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

type Entry = { failures: number; resetAt: number };

// In-memory, per server process. Enough to slow down guessing against a
// single admin account; use a shared store if you run several instances.
const attempts = new Map<string, Entry>();

export function loginBlockedFor(key: string): number {
  const entry = attempts.get(key);
  if (!entry) return 0;
  if (entry.resetAt <= Date.now()) {
    attempts.delete(key);
    return 0;
  }
  return entry.failures >= MAX_FAILURES ? entry.resetAt - Date.now() : 0;
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { failures: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.failures += 1;
  }
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
