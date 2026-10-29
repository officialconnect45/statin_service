import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton, AdminUnavailable } from "@/components/admin/admin-page-states";
import { requireAdmin } from "@/lib/admin/auth";
import { listMailTemplates, MailTemplatesUnavailableError, type MailTemplate } from "@/lib/mail-templates";

export const metadata: Metadata = { title: "Mail templates" };

export default function MailTemplatesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading templates" />}>
      <MailTemplatesDashboard />
    </Suspense>
  );
}

async function MailTemplatesDashboard() {
  const { username } = await requireAdmin();

  let templates: MailTemplate[];
  try {
    templates = await listMailTemplates();
  } catch (error) {
    if (!(error instanceof MailTemplatesUnavailableError)) throw error;
    return (
      <>
        <AdminBar username={username} active="templates" />
        <AdminUnavailable title="Templates unavailable" message={error.message} />
      </>
    );
  }

  const active = templates.filter((item) => item.active).length;

  return (
    <>
      <AdminBar username={username} active="templates" />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-eyebrow text-cobalt">Mail</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Templates</h1>
            <p className="mt-3 max-w-xl text-sm text-mist">
              Saved subjects and messages to pick on the outreach page. {active} of {templates.length} active.
            </p>
          </div>
          <Link
            href="/admin/mail-templates/new"
            className="inline-flex h-11 items-center justify-center self-start rounded-full bg-cobalt px-5 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover md:self-auto"
          >
            Add template
          </Link>
        </div>

        {templates.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <p className="text-lg font-medium">No templates yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
              Add one and it shows up in the template selector on the outreach page.
            </p>
          </div>
        ) : (
          <ul className="mt-10 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
            {templates.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/mail-templates/${item.id}`}
                  className="flex items-start gap-4 px-5 py-5 transition-colors hover:bg-paper sm:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{item.name}</span>
                    <span className="mt-1 block truncate text-sm text-ink-soft">{item.subject}</span>
                    <span className="mt-1 line-clamp-2 block text-sm text-mist">{item.body}</span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.active ? "bg-emerald-50 text-emerald-700" : "bg-paper-deep text-mist"
                    }`}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
