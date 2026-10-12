export function CaseStudiesGrid() {
  const cases = [
    {
      badge: "B2B SaaS MVP",
      title: "FinScale: Automated Cash-Flow & Invoicing Platform",
      client: "FinScale Technologies",
      time: "4 Weeks Delivery",
      outcome: "380+ Paying Teams · $1.4M ARR Scaled",
      desc: "Designed and engineered the complete multi-tenant product from scratch: team permissions, Stripe subscription billing, live banking sync webhooks, and an interactive cash runway dashboard.",
      tags: ["Next.js 16", "PostgreSQL", "Stripe Billing", "Supabase Auth"],
      metrics: [
        { label: "Launch Speed", val: "26 Days" },
        { label: "Active Organizations", val: "380+" },
        { label: "Uptime", val: "99.99%" },
      ],
    },
    {
      badge: "SMB Cloud Modernization",
      title: "LogiRoute: Real-Time Fleet & Dispatch Portal",
      client: "LogiRoute Express",
      time: "3.5 Weeks Delivery",
      outcome: "Replaced 45 Spreadsheets · 78% Time Saved",
      desc: "Migrated a 20-year-old regional logistics company from manual paper manifests and Excel sheets to a high-speed web portal with automated driver assignment, customer tracking links, and instant QuickBooks billing.",
      tags: ["React 19", "Edge Redis", "PostgreSQL", "Tailwind CSS"],
      metrics: [
        { label: "Manual Hours Saved", val: "32 hrs/wk" },
        { label: "Sync Latency", val: "42ms" },
        { label: "Team Adoption", val: "100%" },
      ],
    },
    {
      badge: "High-Converting Web System",
      title: "Aura AI: Venture-Backed Landing & Lead Engine",
      client: "Aura Intelligence",
      time: "2.5 Weeks Delivery",
      outcome: "240% Lead Conversion Lift · 100/100 Lighthouse",
      desc: "Architected a brand-defining marketing website with interactive product simulators, semantic SEO schema, and sub-second edge rendering to prepare the startup for their Series A fundraising announcement.",
      tags: ["Next.js 16", "Turbopack", "Headless CMS", "SEO Schema"],
      metrics: [
        { label: "Conversion Lift", val: "+240%" },
        { label: "Core Web Vitals", val: "100/100" },
        { label: "Pipeline Generated", val: "$3.8M" },
      ],
    },
  ];

  return (
    <section id="cases" className="border-b border-line bg-slate-50/50 py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
              Proven Case Studies
            </p>
            <h2 className="mt-3 font-serif text-4xl font-normal tracking-tight text-slate-900 md:text-5xl">
              Real Builds. Tangible Revenue.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600">
            Every build is delivered with complete source code, deployment automation, and zero vendor lock-in.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {cases.map((c) => (
            <div
              key={c.title}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#244df5]/40 hover:shadow-lg sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#244df5]">
                    {c.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {c.time}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#244df5] transition-colors">
                  {c.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-emerald-600">
                  ✦ {c.outcome}
                </p>

                <p className="mt-4 text-xs leading-relaxed text-slate-600">
                  {c.desc}
                </p>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {c.metrics.map((m) => (
                    <div key={m.label} className="rounded-lg bg-slate-50 p-2">
                      <p className="font-sans text-xs font-bold text-slate-900">
                        {m.val}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
