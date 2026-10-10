export function Specimen({
  variant,
}: {
  variant: "site" | "saas" | "commerce";
}) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-lg border border-blue-500/20 bg-[#080d21] text-paper shadow-[0_30px_70px_-30px_rgba(36,77,245,0.35)] ring-1 ring-blue-500/10"
    >
      {variant === "site" ? <SiteFrame /> : null}
      {variant === "saas" ? <SaasFrame /> : null}
      {variant === "commerce" ? <CommerceFrame /> : null}
    </div>
  );
}

function SiteFrame() {
  return (
    <div className="bg-[#f8fafd] p-4 text-[#090d1f] sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[#e2e8f0] pb-3 text-[10px] tracking-[0.16em] uppercase">
        <span className="font-semibold text-[#244df5]">Fieldnote</span>
        <span className="hidden text-slate-500 sm:inline">Product · Method · Contact</span>
      </div>
      <p className="mt-6 font-serif text-[2.1rem] leading-[0.92] tracking-[-0.03em] sm:text-5xl">
        The offer,
        <span className="italic text-[#244df5]"> clearly.</span>
      </p>
      <div className="mt-6 grid grid-cols-5 gap-3">
        <div className="col-span-3 space-y-2">
          <div className="h-1.5 w-full bg-[#e2e8f0]" />
          <div className="h-1.5 w-11/12 bg-[#e2e8f0]" />
          <div className="h-1.5 w-4/5 bg-[#e2e8f0]" />
          <div className="mt-4 inline-flex h-7 items-center bg-[#244df5] px-3 text-[10px] font-medium tracking-wide text-white shadow-xs">
            Request a walkthrough
          </div>
        </div>
        <div className="col-span-2 border border-blue-500/20 bg-[#0b122c] p-3 text-white">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#38bdf8]">
            In the room
          </p>
          <p className="mt-3 font-serif text-xl leading-none">Buyer</p>
          <p className="mt-1 font-serif text-xl leading-none">Investor</p>
          <p className="mt-1 font-serif text-xl leading-none">Customer</p>
        </div>
      </div>
    </div>
  );
}

function SaasFrame() {
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-[#244df5]" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-2 text-[11px] tracking-[0.14em] uppercase text-white/70">
          Operations
        </span>
        <span className="ml-auto border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#38bdf8]">
          Live
        </span>
      </div>
      <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[120px_1fr]">
        <div className="space-y-3 border-r border-white/10 px-3 py-4 text-[11px] text-white/55">
          <p className="font-semibold text-white">Today</p>
          <p>Schedule</p>
          <p>Accounts</p>
          <p>Billing</p>
        </div>
        <div className="min-w-0 p-3 sm:p-4">
          <div className="flex items-end justify-between gap-3">
            <p className="font-serif text-2xl tracking-tight text-white">Thursday</p>
            <p className="shrink-0 text-[11px] text-white/50">11 jobs</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Job time="08:10" name="Harbor" />
            <Job time="11:40" name="North line" />
            <Job time="14:00" name="Invoices" />
            <Job time="16:20" name="New tenant" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Job({ time, name }: { time: string; name: string }) {
  return (
    <div className="border border-white/10 bg-white/5 px-2.5 py-2 transition-colors hover:border-[#244df5]/40 hover:bg-blue-500/10">
      <p className="font-mono text-[10px] text-[#38bdf8]">{time}</p>
      <p className="mt-1 truncate text-xs text-white">{name}</p>
    </div>
  );
}

function CommerceFrame() {
  return (
    <div className="grid bg-[#f8fafd] text-[#090d1f] sm:grid-cols-2">
      <div className="relative min-h-52 border-r border-blue-900/30 bg-[#0b122c]">
        <div className="absolute top-4 left-4 text-[10px] font-medium tracking-[0.16em] uppercase text-[#38bdf8]">
          Object 04
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-6">
          <div className="w-16">
            <div className="mx-auto h-3 w-8 bg-[#244df5]" />
            <div className="h-28 bg-white shadow-md" />
            <div className="mx-auto h-2 w-10 bg-slate-300" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between p-5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#244df5]">
            Atelier
          </p>
          <p className="mt-3 font-serif text-3xl leading-none tracking-tight">
            Stone vessel
          </p>
          <p className="mt-3 text-sm text-slate-500">$48 · Ships in two days</p>
        </div>
        <div className="mt-6">
          <div className="flex gap-2 text-[11px]">
            <span className="border border-[#244df5] bg-blue-50/50 px-2 py-1 font-medium text-[#244df5]">Small</span>
            <span className="border border-slate-200 px-2 py-1 text-slate-500">
              Large
            </span>
          </div>
          <div className="mt-3 flex h-9 items-center justify-center bg-[#244df5] text-[11px] font-medium tracking-wide text-white shadow-xs transition-colors hover:bg-[#1a3ee8]">
            Add to bag
          </div>
        </div>
      </div>
    </div>
  );
}
