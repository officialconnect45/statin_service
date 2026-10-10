"use client";

import { useActionState, useState } from "react";
import { submitInquiry } from "@/app/actions";
import { initialInquiryState } from "@/lib/inquiry";
import { inquiryOptions, site } from "@/lib/site";

export function EnterpriseLeadForm() {
  const [epoch, setEpoch] = useState(0);

  return (
    <section id="lead-intake" className="border-b border-line bg-white py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left info column */}
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
              Start an Engagement
            </p>
            <h2 className="mt-3 font-serif text-4xl font-normal tracking-tight text-slate-900 md:text-5xl">
              Tell us what you are building.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Whether you are launching a first SaaS MVP, redesigning a high-converting startup site, or automating SMB operations, we review every brief within 24 hours.
            </p>

            <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#244df5]">
                  1
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Direct Founder & Architect Review</p>
                  <p className="text-xs text-slate-500">
                    No sales reps. You speak directly with senior engineers who will build your product.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#244df5]">
                  2
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Written Architecture Blueprint</p>
                  <p className="text-xs text-slate-500">
                    Receive a clear scope, recommended tech stack, and transparent fixed-price proposal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#244df5]">
                  3
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Mutual NDA & IP Protection</p>
                  <p className="text-xs text-slate-500">
                    Your ideas and data are protected. You retain 100% intellectual property ownership.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              Prefer an email directly? Reach our founding partners at{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-[#244df5] underline">
                {site.email}
              </a>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <FormContainer key={epoch} onReset={() => setEpoch((v) => v + 1)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FormContainer({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(
    submitInquiry,
    initialInquiryState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-8 shadow-sm md:p-12">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
          ✓
        </span>
        <h3 className="mt-4 font-serif text-3xl font-normal text-slate-900">
          Brief received successfully.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {state.message} Our lead technical architect will review your project requirements and reply within 24 hours with scoping questions and scheduling availability.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="mt-8 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
        >
          Submit another project inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Your Name *
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Alex Mercer"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#244df5] focus:bg-white focus:ring-1 focus:ring-[#244df5]"
            />
          </label>
          {state.errors?.name && (
            <p className="mt-1 text-xs text-red-500">{state.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Work Email *
            <input
              name="email"
              type="email"
              required
              placeholder="alex@company.com"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#244df5] focus:bg-white focus:ring-1 focus:ring-[#244df5]"
            />
          </label>
          {state.errors?.email && (
            <p className="mt-1 text-xs text-red-500">{state.errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Company / Startup Name *
            <input
              name="company"
              type="text"
              required
              placeholder="e.g. Acme Health or Early Stage"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#244df5] focus:bg-white focus:ring-1 focus:ring-[#244df5]"
            />
          </label>
          {state.errors?.company && (
            <p className="mt-1 text-xs text-red-500">{state.errors.company}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Deliverable Type *
            <select
              name="practice"
              defaultValue="saas"
              required
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#244df5] focus:bg-white focus:ring-1 focus:ring-[#244df5]"
            >
              {inquiryOptions.practices.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          {state.errors?.practice && (
            <p className="mt-1 text-xs text-red-500">{state.errors.practice}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Current Stage
            <select
              name="stage"
              defaultValue="forming"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#244df5] focus:bg-white focus:ring-1 focus:ring-[#244df5]"
            >
              {inquiryOptions.stages.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Target Launch Window
            <select
              name="timeline"
              defaultValue="month"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#244df5] focus:bg-white focus:ring-1 focus:ring-[#244df5]"
            >
              {inquiryOptions.timelines.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-xs font-semibold text-slate-700">
          Project Summary & Objectives *
          <textarea
            name="message"
            rows={4}
            required
            placeholder="Tell us what you need built, your core workflows, and any existing systems or links..."
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#244df5] focus:bg-white focus:ring-1 focus:ring-[#244df5]"
          />
        </label>
        {state.errors?.message && (
          <p className="mt-1 text-xs text-red-500">{state.errors.message}</p>
        )}
      </div>

      {/* Honeypot */}
      <div className="hidden">
        <label>
          Leave this empty
          <input name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p className="mt-4 text-xs font-semibold text-red-500">
          {state.message}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-xl bg-[#244df5] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1a3ee8] hover:shadow-lg disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Submitting brief..." : "Get Free Architecture Review & Quote →"}
        </button>

        <p className="text-xs text-slate-500">
          No spam. We reply within 24 hours.
        </p>
      </div>
    </form>
  );
}
