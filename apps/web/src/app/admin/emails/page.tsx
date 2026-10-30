import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton, AdminUnavailable } from "@/components/admin/admin-page-states";
import { SentEmailsList } from "@/components/admin/sent-emails-list";
import { requireAdmin } from "@/lib/admin/auth";
import { getSentEmails, SentEmailsUnavailableError, summarizeSentEmails, type SentEmail } from "@/lib/sent-emails";

export const metadata: Metadata = { title: "Sent mail" };

export default function SentEmailsPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading sent mail" active="emails" />}>
      <SentEmails />
    </Suspense>
  );
}

async function SentEmails() {
  const { username } = await requireAdmin();

  let emails: SentEmail[];
  try {
    emails = await getSentEmails();
  } catch (error) {
    if (!(error instanceof SentEmailsUnavailableError)) throw error;
    return (
      <>
        <AdminBar username={username} active="emails" />
        <AdminUnavailable title="Sent mail unavailable" message={error.message} />
      </>
    );
  }

  const stats = summarizeSentEmails(emails);

  return (
    <>
      <AdminBar username={username} active="emails" />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-eyebrow text-cobalt">Mail</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Sent mail</h1>
            <p className="mt-3 max-w-xl text-sm text-mist">
              Every email sent from the system, newest first. Open a send to see the message and each recipient.
            </p>
          </div>
          <Link
            href="/admin/outreach"
            className="inline-flex h-11 items-center justify-center self-start rounded-full bg-cobalt px-5 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover md:self-auto"
          >
            New outreach
          </Link>
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Emails sent" value={stats.sent} />
          <Stat label="Failed" value={stats.failed} />
          <Stat label="Sends" value={stats.sends} />
          <Stat label="Sent, last 30 days" value={stats.last30Days} />
        </dl>
        <p className="mt-3 text-xs text-mist">Totals leave out test sends.</p>

        <div className="mt-10">
          <SentEmailsList emails={emails} />
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-6">
      <dt className="t-eyebrow text-mist">{label}</dt>
      <dd className="mt-4 text-4xl font-medium tracking-tight">{value}</dd>
    </div>
  );
}
