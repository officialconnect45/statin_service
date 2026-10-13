import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/ui/logo";
import { getAdminSession } from "@/lib/admin/auth";
import { getAdminConfig } from "@/lib/admin/config";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <div className="tone-dark relative flex flex-1 items-center justify-center overflow-hidden bg-night px-5 py-16 text-white">
      <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0" />
      <div className="relative w-full max-w-md">
        <Logo />
        <div className="mt-10 rounded-3xl border border-night-line bg-night-2 p-7 sm:p-9">
          <p className="t-eyebrow text-signal">Superadmin</p>
          <h1 className="mt-4 text-3xl font-medium tracking-tight">Sign in to view leads</h1>
          <Suspense fallback={<div className="mt-8 h-64" />}>
            <LoginGate />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function LoginGate() {
  // Request-time: credentials can change without a rebuild.
  await connection();

  if (await getAdminSession()) redirect("/admin/leads");

  if (!getAdminConfig()) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-5 text-sm leading-relaxed text-fog">
        <p className="font-medium text-white">Admin access is not set up yet.</p>
        <p className="mt-2">
          From <code className="font-mono text-signal">apps/web</code>, run{" "}
          <code className="font-mono text-signal">npm run admin:password</code> to set the
          superadmin password, then reload this page.
        </p>
      </div>
    );
  }

  return <LoginForm />;
}
