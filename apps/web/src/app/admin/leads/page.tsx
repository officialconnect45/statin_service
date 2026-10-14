import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { LeadsTable, type LeadRow } from "@/components/admin/leads-table";
import { requireAdmin } from "@/lib/admin/auth";
import { getLeads, LeadsUnavailableError, optionLabel, summarizeLeads, type Lead } from "@/lib/leads";

export const metadata: Metadata = { title: "Leads" };

export default function LeadsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <LeadsDashboard />
    </Suspense>
  );
}

async function LeadsDashboard() {
  const { username } = await requireAdmin();

  let leads: Lead[];
  try {
    leads = await getLeads();
  } catch (error) {
    // Redirects and unexpected errors propagate; only an API outage is shown inline.
    if (!(error instanceof LeadsUnavailableError)) throw error;
    return (
      <>
        <AdminBar username={username} />
        <div className="mx-auto w-full max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10">
          <div role="alert" className="rounded-3xl border border-danger/30 bg-white p-8">
            <p className="t-eyebrow text-danger">Leads unavailable</p>
            <p className="mt-3 text-lg font-medium">{error.message}</p>
            <p className="mt-2 text-sm text-mist">
              Leads are stored in MongoDB through the Statin API. Start it with{" "}
              <code className="font-mono">npm run dev:api</code> and reload this page.
            </p>
          </div>
        </div>
      </>
    );
  }

  const stats = summarizeLeads(leads);

  const rows: LeadRow[] = leads.map((lead) => ({
    ...lead,
    practiceLabel: optionLabel(lead.practice) || "Unspecified",
    stageLabel: optionLabel(lead.stage),
    timelineLabel: optionLabel(lead.timeline),
  }));

  return (
    <>
      <AdminBar username={username} />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-eyebrow text-cobalt">Dashboard</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Leads</h1>
            <p className="mt-3 max-w-xl text-sm text-mist">
              Every brief submitted through the contact form, newest first.
            </p>
          </div>
          {leads.length > 0 ? (
            <a
              href="/admin/leads/export"
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full border border-ink/15 px-5 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white md:self-auto"
            >
              Export CSV
            </a>
          ) : null}
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total leads" value={String(stats.total)} />
          <Stat label="Last 7 days" value={String(stats.last7Days)} />
          <Stat label="Last 30 days" value={String(stats.last30Days)} />
          <Stat
            label="Most requested"
            value={stats.topPractice ?? "None yet"}
            small
          />
        </dl>

        <div className="mt-10">
          <LeadsTable leads={rows} />
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-white p-6">
      <dt className="t-eyebrow text-mist">{label}</dt>
      <dd
        className={`mt-4 font-medium tracking-tight ${
          small ? "text-xl leading-snug" : "text-4xl"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading leads" className="mx-auto w-full max-w-[1320px] px-5 py-24 sm:px-8 lg:px-10">
      <div className="h-10 w-40 animate-pulse rounded-lg bg-line" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-2xl bg-line" />
        ))}
      </div>
    </div>
  );
}
