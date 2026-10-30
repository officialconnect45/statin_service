import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton } from "@/components/admin/admin-page-states";
import { TestimonialEditorShell } from "@/components/admin/testimonial-editor-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Add testimonial" };

export default function NewTestimonialPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading" active="testimonials" />}>
      <NewTestimonial />
    </Suspense>
  );
}

async function NewTestimonial() {
  const { username } = await requireAdmin();

  return (
    <>
      <AdminBar username={username} active="testimonials" />
      <TestimonialEditorShell title="Add business testimonial">
        <TestimonialForm
          initial={{
            name: "",
            description: "",
            quote: "",
            logo: "",
            sortOrder: 0,
            published: true,
            highlight: false,
          }}
        />
      </TestimonialEditorShell>
    </>
  );
}
