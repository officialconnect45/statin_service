"use client";

import { useId, useState } from "react";

type ProjectType = "saas" | "website" | "portal" | "ai_app";

export function LeadCalculator() {
  const [projectType, setProjectType] = useState<ProjectType>("saas");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "auth",
    "billing",
    "dashboard",
  ]);
  const [speed, setSpeed] = useState<"rapid" | "standard">("rapid");
  const uniqueId = useId();

  const types = [
    {
      id: "saas" as const,
      title: "SaaS MVP Development",
      desc: "Multi-tenant web app with accounts, billing & admin.",
      baseWeeks: 4,
    },
    {
      id: "website" as const,
      title: "High-Converting Website",
      desc: "Brand-defining Next.js site built to acquire leads.",
      baseWeeks: 3,
    },
    {
      id: "portal" as const,
      title: "SMB Business Portal",
      desc: "Cloud workflow app replacing manual spreadsheets.",
      baseWeeks: 4,
    },
    {
      id: "ai_app" as const,
      title: "AI-Powered Web Application",
      desc: "Custom LLM integrations, copilots & pipelines.",
      baseWeeks: 5,
    },
  ];

  const features = [
    { id: "auth", label: "Multi-Tenant Auth & Permissions", weeks: 0.5 },
    { id: "billing", label: "Stripe Subscription & Invoicing", weeks: 0.5 },
    { id: "dashboard", label: "Interactive Analytics & Charts", weeks: 0.5 },
    { id: "ai", label: "AI Copilot / LLM Pipelines", weeks: 1.0 },
    { id: "cms", label: "Headless CMS for Marketing Team", weeks: 0.5 },
    { id: "crm", label: "HubSpot / CRM & Email Webhooks", weeks: 0.5 },
    { id: "roles", label: "Granular Team Roles & Audit Logs", weeks: 0.5 },
    { id: "mobile", label: "PWA & Mobile First Optimization", weeks: 0.5 },
  ];

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const currentType = types.find((t) => t.id === projectType) ?? types[0];
  const featureWeeks = selectedFeatures.reduce((acc, featId) => {
    const found = features.find((f) => f.id === featId);
    return acc + (found?.weeks ?? 0);
  }, 0);

  const rawWeeks = currentType.baseWeeks + featureWeeks;
  const totalWeeks = speed === "rapid" ? Math.max(3, Math.round(rawWeeks * 0.8)) : Math.round(rawWeeks);

  const handleSelectScope = () => {
    const leadForm = document.getElementById("lead-intake");
    if (leadForm) {
      leadForm.scrollIntoView({ behavior: "smooth" });
      const messageInput = document.querySelector<HTMLTextAreaElement>(
        'textarea[name="message"]'
      );
      if (messageInput) {
        messageInput.value = `I configured a project scope via the estimator:
- Type: ${currentType.title}
- Target Timeline: ${totalWeeks} Weeks (${speed === "rapid" ? "Rapid MVP Sprint" : "Standard"})
- Key Features: ${selectedFeatures.join(", ")}
Please send a detailed scope breakdown and proposal.`;
      }
    }
  };

  return (
    <section id="calculator" className="relative border-b border-line bg-slate-50/60 py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
        <div className="text-center">
          <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
            Transparent Scoping Tool
          </p>
          <h2 className="mt-3 font-serif text-4xl font-normal tracking-tight text-balance text-slate-900 md:text-5xl">
            Interactive Project & Timeline Estimator
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            No guessing games or vague proposals. Select your project specifications to view realistic production timelines and recommended enterprise architecture.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-8 lg:col-span-7">
            {/* Step 1: Project Type */}
            <div>
              <p className="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase">
                1. Select Core Deliverable
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {types.map((t) => {
                  const active = projectType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setProjectType(t.id)}
                      className={`cursor-pointer rounded-xl border p-4 text-left transition-all ${
                        active
                          ? "border-[#244df5] bg-white shadow-md ring-2 ring-[#244df5]/20"
                          : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <p className={`text-sm font-semibold ${active ? "text-[#244df5]" : "text-slate-900"}`}>
                        {t.title}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        {t.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Features */}
            <div>
              <p className="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase">
                2. Select Core Capabilities & Modules
              </p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {features.map((f) => {
                  const checked = selectedFeatures.includes(f.id);
                  const inputId = `${uniqueId}-feature-${f.id}`;
                  return (
                    <label
                      key={f.id}
                      htmlFor={inputId}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border px-3.5 py-3 text-xs font-medium transition-all ${
                        checked
                          ? "border-[#244df5]/50 bg-blue-50/60 text-[#244df5] shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span>{f.label}</span>
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFeature(f.id)}
                        className="h-4 w-4 rounded border-slate-300 text-[#244df5] focus:ring-[#244df5]"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Speed Preference */}
            <div>
              <p className="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase">
                3. Desired Launch Cadence
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSpeed("rapid")}
                  className={`flex-1 rounded-lg border py-3 px-4 text-center text-xs font-semibold transition-all ${
                    speed === "rapid"
                      ? "border-[#244df5] bg-[#244df5] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  🚀 Rapid MVP Sprint (Accelerated)
                </button>
                <button
                  type="button"
                  onClick={() => setSpeed("standard")}
                  className={`flex-1 rounded-lg border py-3 px-4 text-center text-xs font-semibold transition-all ${
                    speed === "standard"
                      ? "border-[#244df5] bg-[#244df5] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  📦 Standard Release Cadence
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Summary Card Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-blue-500/20 bg-[#080d22] p-6 text-white shadow-xl ring-1 ring-blue-500/15 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-xs font-semibold tracking-wider text-[#38bdf8] uppercase">
                  Project Estimate Summary
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  Fixed-Scope Guarantee
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs text-slate-400">Target Delivery Timeline</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                    {totalWeeks} Weeks
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    From kickoff sprint to live production URL
                  </p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-slate-400">Recommended Architecture</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-mono text-slate-200">
                      Next.js 16 App Router
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-mono text-slate-200">
                      TypeScript
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-mono text-slate-200">
                      PostgreSQL
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-mono text-slate-200">
                      Tailwind CSS
                    </span>
                    {selectedFeatures.includes("billing") && (
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono text-[#38bdf8]">
                        Stripe Billing
                      </span>
                    )}
                    {selectedFeatures.includes("ai") && (
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[11px] font-mono text-[#38bdf8]">
                        AI LLM Edge Pipeline
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-slate-400">Included In Every Engagement</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="text-[#38bdf8]">✓</span> 100% Intellectual Property & Source Code Ownership
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#38bdf8]">✓</span> Direct Access to Principal Engineers (No Account Managers)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#38bdf8]">✓</span> Weekly Live Staging Demos & Written Updates
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#38bdf8]">✓</span> 30-Day Post-Launch Stewardship & Bug Warranty
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSelectScope}
                className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#244df5] py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1a3ee8] hover:shadow-lg"
              >
                <span>Lock In This Scope & Request Proposal</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
