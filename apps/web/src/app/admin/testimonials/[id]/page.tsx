import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton, AdminUnavailable } from "@/components/admin/admin-page-states";
import { TestimonialEditorShell } from "@/components/admin/testimonial-editor-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { requireAdmin } from "@/lib/admin/auth";
import { listTestimonials, TestimonialsUnavailableError } from "@/lib/testimonials";

export const metadata: Metadata = { title: "Edit testimonial" };

export default function EditTestimonialPage({ params }: PageProps<"/admin/testimonials/[id]">) {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading testimonial" active="testimonials" />}>
      <EditTestimonial params={params} />
    </Suspense>
  );
}

async function EditTestimonial({ params }: { params: Promise<{ id: string }> }) {
  const { username } = await requireAdmin();
  const { id } = await params;

  let testimonials;
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

  const item = testimonials.find((testimonial) => testimonial.id === id);
  if (!item) notFound();

  return (
    <>
      <AdminBar username={username} active="testimonials" />
      <TestimonialEditorShell title="Edit business testimonial">
        <TestimonialForm
          key={item.updatedAt}
          initial={{
            id: item.id,
            name: item.name,
            description: item.description,
            quote: item.quote,
            logo: item.logo,
            sortOrder: item.sortOrder,
            published: item.published,
            highlight: item.highlight,
          }}
        />
      </TestimonialEditorShell>
    </>
  );
}
