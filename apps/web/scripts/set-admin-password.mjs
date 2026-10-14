#!/usr/bin/env node
/**
 * Sets the superadmin password for /admin.
 *
 *   npm run admin:password                      prompts (input hidden)
 *   npm run admin:password -- --username name   custom username (default: superadmin)
 *   echo "password" | npm run admin:password    non-interactive (CI, servers)
 *
 * Writes ADMIN_USERNAME, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET to
 * apps/web/.env.local (gitignored). Only a salted scrypt hash is stored.
 * Setting a new password signs out every existing admin session.
 * For hosted deployments, copy the three values into the host's env settings.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const MIN_LENGTH = 12;
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };
const envFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env.local");

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  return index > -1 ? process.argv[index + 1] : undefined;
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    rl._writeToOutput = (chunk) => {
      if (!muted) rl.output.write(chunk);
    };
    rl.question(question, (answer) => {
      rl.output.write("\n");
      rl.close();
      resolve(answer);
    });
    muted = true;
  });
}

async function readPiped() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data.replace(/\r?\n$/, "");
}

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password.normalize("NFKC"), salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
    maxmem: 64 * 1024 * 1024,
  });
  // Colon-separated: .env loaders would expand "$" sequences.
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64url"), hash.toString("base64url")].join(":");
}

function upsertEnv(content, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) return content.replace(pattern, line);
  return `${content}${content && !content.endsWith("\n") ? "\n" : ""}${line}\n`;
}

async function main() {
  const username = (argValue("--username") ?? "superadmin").trim();
  if (!/^[A-Za-z0-9._-]{3,64}$/.test(username)) {
    console.error("Username must be 3 to 64 characters: letters, numbers, dot, dash, or underscore.");
    process.exit(1);
  }

  let password;
  if (process.stdin.isTTY) {
    password = await askHidden(`New password for "${username}": `);
    const confirm = await askHidden("Confirm password: ");
    if (password !== confirm) {
      console.error("Passwords do not match. Nothing was changed.");
      process.exit(1);
    }
  } else {
    password = await readPiped();
  }

  if (password.length < MIN_LENGTH) {
    console.error(`Use at least ${MIN_LENGTH} characters. Nothing was changed.`);
    process.exit(1);
  }

  let env = existsSync(envFile) ? readFileSync(envFile, "utf8") : "";
  const hasSecret = /^ADMIN_SESSION_SECRET=.{32,}$/m.test(env);

  env = upsertEnv(env, "ADMIN_USERNAME", username);
  env = upsertEnv(env, "ADMIN_PASSWORD_HASH", hashPassword(password));
  if (!hasSecret) env = upsertEnv(env, "ADMIN_SESSION_SECRET", randomBytes(48).toString("base64url"));

  writeFileSync(envFile, env, { mode: 0o600 });

  console.log(`Saved superadmin credentials for "${username}" to ${path.relative(process.cwd(), envFile)}.`);
  console.log("The dev server reloads .env.local automatically; restart a production server to apply.");
  console.log("Existing admin sessions are now signed out.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
