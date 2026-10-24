import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminBar } from "@/components/admin/admin-bar";
import { AdminPageSkeleton } from "@/components/admin/admin-page-states";
import { OutreachForm } from "@/components/admin/outreach-form";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Outreach" };

export default function OutreachPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton label="Loading outreach" />}>
      <Outreach />
    </Suspense>
  );
}

async function Outreach() {
  const { username } = await requireAdmin();

  return (
    <>
      <AdminBar username={username} active="outreach" />
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 md:py-14 lg:px-10">
        <p className="t-eyebrow text-cobalt">Mail</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">Outreach</h1>
        <p className="mt-3 max-w-2xl text-sm text-mist">
          Paste or upload recipients on the left and write the message on the right. Each person gets their own email from
          hello@statin.io; nobody sees the other addresses. Send a test to yourself first.
        </p>
        <div className="mt-10">
          <OutreachForm />
        </div>
      </div>
    </>
  );
}
