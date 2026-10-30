import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton, AdminUnavailable } from "@/components/admin/admin-page-states";
import { MailTemplateEditorShell } from "@/components/admin/mail-template-editor-shell";
import { MailTemplateForm } from "@/components/admin/mail-template-form";
import { requireAdmin } from "@/lib/admin/auth";
import { listMailTemplates, MailTemplatesUnavailableError } from "@/lib/mail-templates";

export const metadata: Metadata = { title: "Edit template" };

export default function EditMailTemplatePage({ params }: PageProps<"/admin/mail-templates/[id]">) {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading template" active="templates" />}>
      <EditMailTemplate params={params} />
    </Suspense>
  );
}

async function EditMailTemplate({ params }: { params: Promise<{ id: string }> }) {
  const { username } = await requireAdmin();
  const { id } = await params;

  let templates;
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

  const item = templates.find((template) => template.id === id);
  if (!item) notFound();

  return (
    <>
      <AdminBar username={username} active="templates" />
      <MailTemplateEditorShell title="Edit mail template">
        <MailTemplateForm
          key={item.updatedAt}
          initial={{ id: item.id, name: item.name, subject: item.subject, body: item.body, active: item.active }}
        />
      </MailTemplateEditorShell>
    </>
  );
}
