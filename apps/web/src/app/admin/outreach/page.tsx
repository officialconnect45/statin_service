import type { MailTemplateRecord, OutreachSenderResponse } from "@statin/types";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton } from "@/components/admin/admin-page-states";
import { OutreachForm } from "@/components/admin/outreach-form";
import { requireAdmin } from "@/lib/admin/auth";
import { adminApiHeaders, apiUrl } from "@/lib/api";
import { listMailTemplates } from "@/lib/mail-templates";

export const metadata: Metadata = { title: "Outreach" };

export default function OutreachPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading outreach" />}>
      <Outreach />
    </Suspense>
  );
}

/** The address outreach goes out as, or null when the API can't say (not configured or not reachable). */
async function getSender(): Promise<OutreachSenderResponse | null> {
  try {
    const response = await fetch(apiUrl("/admin/outreach/sender"), {
      headers: adminApiHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? ((await response.json()) as OutreachSenderResponse) : null;
  } catch (error) {
    console.error("[outreach] Could not load the sender:", error);
    return null;
  }
}

/** Active templates for the selector; an empty list when they can't load, so outreach still works. */
async function getTemplates(): Promise<MailTemplateRecord[]> {
  try {
    return await listMailTemplates({ activeOnly: true });
  } catch (error) {
    console.error("[outreach] Could not load templates:", error);
    return [];
  }
}

async function Outreach() {
  const { username } = await requireAdmin();
  const [sender, templates] = await Promise.all([getSender(), getTemplates()]);

  return (
    <>
      <AdminBar username={username} active="outreach" />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <p className="t-eyebrow text-cobalt">Mail</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Outreach</h1>
        <p className="mt-3 max-w-2xl text-sm text-mist">
          Paste or upload recipients on the left and write the message on the right. Each person gets their own email;
          nobody sees the other addresses. Send a test to yourself first.
        </p>
        {sender?.configured ? (
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-white px-4 py-2 text-sm">
            <span className="text-mist">Sending as</span>
            <span className="font-mono text-xs font-medium">{sender.from}</span>
            {sender.replyTo && !sender.from.includes(`<${sender.replyTo}>`) ? (
              <span className="text-xs text-mist">· replies to {sender.replyTo}</span>
            ) : null}
          </p>
        ) : (
          <p role="alert" className="mt-4 max-w-2xl rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {sender
              ? "Outreach mail is not configured on the API. Set MAIL_ENABLED=true, the SMTP_* variables and OUTREACH_FROM_EMAIL (hello@statin.eu)."
              : "Could not check the outreach sender. Check that the API is running."}
          </p>
        )}
        <div className="mt-10">
          <OutreachForm templates={templates} senderFrom={sender?.configured ? sender.from : undefined} />
        </div>
      </div>
    </>
  );
}
