export function SocialProofMarquee() {
  const brands = [
    { name: "Apex Labs", category: "Series A B2B SaaS" },
    { name: "CloudScale", category: "DevOps Infrastructure" },
    { name: "Veloce Health", category: "HealthTech Portal" },
    { name: "Nexus Pay", category: "FinTech Payments" },
    { name: "Quantify AI", category: "AI Analytics" },
    { name: "HyperDrive Logistics", category: "SMB Supply Chain" },
  ];

  const stats = [
    { value: "$54M+", label: "Client Revenue Generated" },
    { value: "18 Days", label: "Average MVP Launch" },
    { value: "99.98%", label: "Production Uptime" },
    { value: "100%", label: "Code & IP Ownership" },
  ];

  return (
    <div className="border-y border-line bg-white/60 py-10 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
        <p className="text-center font-mono text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
          Trusted by venture-backed startups and high-growth small businesses
        </p>

        {/* Brand strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {brands.map((b) => (
            <div
              key={b.name}
              className="group flex flex-col items-center transition-transform hover:-translate-y-0.5"
            >
              <span className="font-sans text-base font-bold tracking-tight text-slate-800 transition-colors group-hover:text-[#244df5]">
                {b.name}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {b.category}
              </span>
            </div>
          ))}
        </div>

        {/* High-impact Metrics Ribbon */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-line/80 pt-8 sm:grid-cols-4 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-sans text-2xl font-extrabold tracking-tight text-[#244df5] md:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
