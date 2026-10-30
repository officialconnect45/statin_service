"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { buildAuditReport } from "@/lib/audit/report";
import { AuditFetchError } from "@/lib/audit/scrape";
import type { AuditResult } from "@/lib/audit/types";

export async function runAudit(input: { url: string }): Promise<AuditResult> {
  await requireAdmin();

  const url = String(input.url ?? "").trim();
  if (!url) return { status: "error", message: "Enter a website URL." };

  try {
    return { status: "ok", report: await buildAuditReport(url) };
  } catch (error) {
    if (error instanceof AuditFetchError) return { status: "error", message: error.message };
    console.error("[audit] Audit failed:", error);
    return { status: "error", message: "The audit failed unexpectedly. Check the server logs and try again." };
  }
}
