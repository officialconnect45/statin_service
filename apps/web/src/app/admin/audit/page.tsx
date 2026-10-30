import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton } from "@/components/admin/admin-page-states";
import { AuditTool } from "@/components/admin/audit/audit-tool";
import { requireAdmin } from "@/lib/admin/auth";
import { geminiConfigured } from "@/lib/audit/gemini";

export const metadata: Metadata = { title: "Audit" };

// The audit server action scrapes the site and waits on Gemini; allow it time on hosts that enforce limits.
export const maxDuration = 300;

export default function AuditPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading audit" active="audit" />}>
      <Audit />
    </Suspense>
  );
}

async function Audit() {
  const { username } = await requireAdmin();

  return (
    <>
      <AdminBar username={username} active="audit" />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <AuditTool geminiReady={geminiConfigured()} />
      </div>
    </>
  );
}
