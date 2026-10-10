"use client";

import { useState } from "react";

export function SaasInteractiveHero() {
  const [activeTab, setActiveTab] = useState<"saas" | "web" | "smb" | "ai">("saas");
  const [seats, setSeats] = useState(48);

  const mrr = seats * 89;

  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-blue-500/25 bg-[#060a1d] text-white shadow-[0_25px_80px_-20px_rgba(36,77,245,0.45)] ring-1 ring-blue-500/20">
      {/* Chrome Top Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#090f2b] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ef4444]/80" />
          <span className="h-3 w-3 rounded-full bg-[#f59e0b]/80" />
          <span className="h-3 w-3 rounded-full bg-[#10b981]/80" />
          <span className="ml-3 font-mono text-xs text-slate-400">
            statin-cloud-engine // v2.6.4
          </span>
        </div>

        {/* Tab switcher */}
        <div className="mt-2 flex items-center gap-1 sm:mt-0">
          <button
            type="button"
            onClick={() => setActiveTab("saas")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "saas"
                ? "bg-[#244df5] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            SaaS Core
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("web")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "web"
                ? "bg-[#244df5] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Website Engine
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("smb")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "smb"
                ? "bg-[#244df5] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            SMB Portal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              activeTab === "ai"
                ? "bg-[#244df5] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            AI Copilot
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="p-5 sm:p-7">
        {activeTab === "saas" && (
          <div className="space-y-6">
            {/* Top Stat Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-medium text-slate-400">Simulated MRR</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                  ${mrr.toLocaleString()}
                </p>
                <span className="mt-1 inline-flex items-center text-[10px] text-[#38bdf8]">
                  +24.8% vs last month
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-medium text-slate-400">Active Teams</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                  {seats} Organizations
                </p>
                <span className="mt-1 inline-flex items-center text-[10px] text-emerald-400">
                  99.99% retention
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-medium text-slate-400">API Latency</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                  24ms
                </p>
                <span className="mt-1 inline-flex items-center text-[10px] text-[#38bdf8]">
                  Edge Redis cache
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-medium text-slate-400">Stripe Billing</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-400">
                  Healthy
                </p>
                <span className="mt-1 inline-flex items-center text-[10px] text-slate-400">
                  Multi-tier sync
                </span>
              </div>
            </div>

            {/* Interactive Slider */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Interactive SaaS Capacity & Revenue Simulation
                  </p>
                  <p className="text-xs text-slate-400">
                    Drag the slider to test how Statin architectures scale billing and concurrency effortlessly.
                  </p>
                </div>
                <span className="font-mono text-sm font-bold text-[#38bdf8]">
                  {seats} Active Tenants · ${(seats * 89).toLocaleString()} /mo
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="500"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#244df5]"
              />
            </div>

            {/* Live Event Stream */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-[11px] font-semibold tracking-wider text-[#38bdf8] uppercase">
                Production Event Log (Real-time telemetry)
              </p>
              <div className="mt-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>stripe.webhook · invoice_payment_succeeded ($420.00)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">2s ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
                    <span>tenant.provisioned · org_hyperdrive_logistics</span>
                  </span>
                  <span className="text-[10px] text-slate-500">14s ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>auth.session_exchange · RS256 token valid (18ms)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">32s ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "web" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-400 text-lg font-bold text-emerald-400">
                  100
                </div>
                <p className="mt-3 text-xs font-semibold text-white">Google Lighthouse</p>
                <p className="mt-1 text-[11px] text-slate-400">Sub-second Core Web Vitals</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#38bdf8] text-lg font-bold text-[#38bdf8]">
                  4.8%
                </div>
                <p className="mt-3 text-xs font-semibold text-white">Visitor-to-Lead Rate</p>
                <p className="mt-1 text-[11px] text-slate-400">vs 1.1% industry average</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-500 text-lg font-bold text-blue-400">
                  32ms
                </div>
                <p className="mt-3 text-xs font-semibold text-white">Edge TTFB</p>
                <p className="mt-1 text-[11px] text-slate-400">Worldwide CDN Delivery</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">
                Engineered for High-Conversion Lead Capture
              </p>
              <p className="mt-1 text-xs text-slate-400">
                We build Next.js 16 landing pages with semantic SEO schema, interactive pricing estimators, and instant headless CMS handoff so your marketing team can publish without developers.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-[#38bdf8]">
                  Next.js 16 Turbopack
                </span>
                <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-[#38bdf8]">
                  Dynamic OpenGraph Cards
                </span>
                <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-[#38bdf8]">
                  HubSpot & CRM Webhooks
                </span>
                <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-[#38bdf8]">
                  Zero Layout Shift (CLS: 0.0)
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "smb" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    SMB Modernization: Excel & Paper to Cloud Portal
                  </h4>
                  <p className="text-xs text-slate-400">
                    Replace scattered spreadsheets with a custom branded portal tailored to your operational team.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Live Sync
                </span>
              </div>

              <div className="mt-4 divide-y divide-white/10 rounded-lg border border-white/10 bg-[#040714]">
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="font-medium text-white">Automated Customer Quote Generator</span>
                  <span className="text-emerald-400">Completed (0.4s)</span>
                </div>
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="font-medium text-white">Team Shift & Dispatch Board</span>
                  <span className="text-[#38bdf8]">18 Technicians Assigned</span>
                </div>
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="font-medium text-white">Direct QuickBooks & Stripe Invoicing</span>
                  <span className="text-slate-400">Sync: 100% Match</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
                <p className="font-mono text-xs font-semibold text-[#38bdf8]">
                  Statin AI Copilot Integration
                </p>
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-[#040714] p-3 text-xs text-slate-300">
                <span className="text-slate-500">$ statin.ai.query:</span>{" "}
                &quot;Show me startup leads with &gt;$50k ARR who engaged with the pricing calculator in the last 24h&quot;
              </div>

              <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300">
                ✓ <strong>Found 14 Qualified Leads:</strong> Filtered and dispatched to Founder Slack channel with ready-to-sign proposals.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 bg-[#080d28] px-5 py-3 sm:flex-row sm:px-6">
        <span className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Production-Ready Architecture · Delivered in 3–6 Weeks
        </span>
        <a
          href="#calculator"
          className="text-xs font-semibold text-[#38bdf8] hover:underline"
        >
          Calculate your project scope →
        </a>
      </div>
    </div>
  );
}
