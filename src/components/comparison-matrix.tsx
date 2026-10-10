export function ComparisonMatrix() {
  const criteria = [
    {
      label: "Time to First Production Build",
      statin: "14 – 21 Days (Rapid sprints)",
      freelancer: "4 – 12 Weeks (Varies)",
      agency: "3 – 6 Months (Heavy bureaucracy)",
      inhouse: "3 – 6 Months (Recruiting + ramp)",
    },
    {
      label: "Engineering Caliber",
      statin: "Principal full-stack architects",
      freelancer: "Single domain specialist",
      agency: "Junior staff / Subcontractors",
      inhouse: "Varies by hiring budget",
    },
    {
      label: "IP & Source Code Ownership",
      statin: "100% Client Owned from Day 1",
      freelancer: "Often fragmented repos",
      agency: "Vendor lock-in or proprietary bases",
      inhouse: "100% Company Owned",
    },
    {
      label: "Cost Structure",
      statin: "Predictable, Fixed-Scope Milestones",
      freelancer: "Unpredictable hourly billing",
      agency: "$80k – $150k+ bloated retainers",
      inhouse: "$250k+ Salary, benefits & equity",
    },
    {
      label: "Accountability & Updates",
      statin: "Weekly live demos of real code",
      freelancer: "Sporadic asynchronous chats",
      agency: "Slide decks & account managers",
      inhouse: "Daily standup overhead",
    },
  ];

  return (
    <section className="border-b border-line bg-white py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
        <div className="text-center">
          <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
            The Advantage
          </p>
          <h2 className="mt-3 font-serif text-4xl font-normal tracking-tight text-slate-900 md:text-5xl">
            Why Founders Build With Statin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Compare how our dedicated product studio model outperforms disjointed freelancers, legacy agency retainers, and expensive in-house recruiting.
          </p>
        </div>

        <div className="mt-14 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="py-4 px-5 font-semibold text-slate-500">Execution Factor</th>
                <th className="border-x border-blue-500/20 bg-blue-50/60 py-4 px-5 font-bold text-[#244df5]">
                  ✦ Statin Studio
                </th>
                <th className="py-4 px-5 font-semibold text-slate-500">Solo Freelancers</th>
                <th className="py-4 px-5 font-semibold text-slate-500">Traditional Agency</th>
                <th className="py-4 px-5 font-semibold text-slate-500">Hiring In-House</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {criteria.map((c) => (
                <tr key={c.label} className="transition-colors hover:bg-slate-50/40">
                  <td className="py-4 px-5 font-medium text-slate-900">{c.label}</td>
                  <td className="border-x border-blue-500/20 bg-blue-50/30 py-4 px-5 font-semibold text-[#244df5]">
                    {c.statin}
                  </td>
                  <td className="py-4 px-5 text-slate-600">{c.freelancer}</td>
                  <td className="py-4 px-5 text-slate-600">{c.agency}</td>
                  <td className="py-4 px-5 text-slate-600">{c.inhouse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
