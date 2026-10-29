import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton } from "@/components/admin/admin-page-states";
import { MailTemplateEditorShell } from "@/components/admin/mail-template-editor-shell";
import { MailTemplateForm } from "@/components/admin/mail-template-form";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Add template" };

export default function NewMailTemplatePage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading" />}>
      <NewMailTemplate />
    </Suspense>
  );
}

async function NewMailTemplate() {
  const { username } = await requireAdmin();

  return (
    <>
      <AdminBar username={username} active="templates" />
      <MailTemplateEditorShell title="Add mail template">
        <MailTemplateForm initial={{ name: "", subject: "", body: "", active: true }} />
      </MailTemplateEditorShell>
    </>
  );
}
