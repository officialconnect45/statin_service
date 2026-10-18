import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton, AdminUnavailable } from "@/components/admin/admin-page-states";
import { initials } from "@/lib/initials";
import { requireAdmin } from "@/lib/admin/auth";
import { listTestimonials, TestimonialsUnavailableError, type Testimonial } from "@/lib/testimonials";

export const metadata: Metadata = { title: "Testimonials" };

export default function TestimonialsPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading testimonials" />}>
      <TestimonialsDashboard />
    </Suspense>
  );
}

async function TestimonialsDashboard() {
  const { username } = await requireAdmin();

  let testimonials: Testimonial[];
  try {
    testimonials = await listTestimonials();
  } catch (error) {
    if (!(error instanceof TestimonialsUnavailableError)) throw error;
    return (
      <>
        <AdminBar username={username} active="testimonials" />
        <AdminUnavailable title="Testimonials unavailable" message={error.message} />
      </>
    );
  }

  const published = testimonials.filter((item) => item.published).length;

  return (
    <>
      <AdminBar username={username} active="testimonials" />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-eyebrow text-cobalt">Home page</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Testimonials</h1>
            <p className="mt-3 max-w-xl text-sm text-mist">
              Business testimonials shown on the home page. {published} of {testimonials.length} published,
              lower sort order first.
            </p>
          </div>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex h-11 items-center justify-center self-start rounded-full bg-cobalt px-5 text-sm font-medium text-white transition-colors hover:bg-cobalt-hover md:self-auto"
          >
            Add testimonial
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <p className="text-lg font-medium">No testimonials yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
              Add one and it appears on the home page once published.
            </p>
          </div>
        ) : (
          <ul className="mt-10 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
            {testimonials.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/testimonials/${item.id}`}
                  className="flex items-start gap-4 px-5 py-5 transition-colors hover:bg-paper sm:px-6"
                >
                  {item.logo ? (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.logo} alt="" loading="lazy" className="h-full w-full object-contain p-1" />
                    </span>
                  ) : (
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cobalt/10 text-sm font-semibold text-cobalt">
                      {initials(item.name)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.description ? <span className="text-sm text-mist">{item.description}</span> : null}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm text-ink-soft">{item.quote}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-2 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-medium ${
                        item.published ? "bg-emerald-50 text-emerald-700" : "bg-paper-deep text-mist"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                    <span className="font-mono text-mist">
                      #{item.sortOrder}
                      {item.highlight ? " · highlight" : ""}
                    </span>
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
