export function Specimen({
  variant,
}: {
  variant: "site" | "saas" | "commerce";
}) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border border-ink/10 bg-[#102820] text-paper shadow-[0_30px_70px_-40px_rgba(20,24,22,0.7)]"
    >
      {variant === "site" ? <SiteFrame /> : null}
      {variant === "saas" ? <SaasFrame /> : null}
      {variant === "commerce" ? <CommerceFrame /> : null}
    </div>
  );
}

function SiteFrame() {
  return (
    <div className="bg-[#f4f1ea] p-4 text-[#141816] sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[#d8d1c4] pb-3 text-[10px] tracking-[0.16em] uppercase">
        <span>Fieldnote</span>
        <span className="hidden text-[#4e5853] sm:inline">Product · Method · Contact</span>
      </div>
      <p className="mt-6 font-serif text-[2.1rem] leading-[0.92] tracking-[-0.03em] sm:text-5xl">
        The offer,
        <span className="italic text-[#14352c]"> clearly.</span>
      </p>
      <div className="mt-6 grid grid-cols-5 gap-3">
        <div className="col-span-3 space-y-2">
          <div className="h-1.5 w-full bg-[#d8d1c4]" />
          <div className="h-1.5 w-11/12 bg-[#d8d1c4]" />
          <div className="h-1.5 w-4/5 bg-[#d8d1c4]" />
          <div className="mt-4 inline-flex h-7 items-center bg-[#141816] px-3 text-[10px] tracking-wide text-[#f4f1ea]">
            Request a walkthrough
          </div>
        </div>
        <div className="col-span-2 bg-[#14352c] p-3 text-[#f4f1ea]">
          <p className="text-[10px] tracking-[0.16em] uppercase text-[#c4a574]">
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
        <span className="h-2 w-2 rounded-full bg-[#c4a574]" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-2 text-[11px] tracking-[0.14em] uppercase text-white/70">
          Operations
        </span>
        <span className="ml-auto border border-[#c4a574]/50 px-2 py-0.5 text-[10px] tracking-wide text-[#c4a574]">
          Live
        </span>
      </div>
      <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[120px_1fr]">
        <div className="space-y-3 border-r border-white/10 px-3 py-4 text-[11px] text-white/55">
          <p className="text-paper">Today</p>
          <p>Schedule</p>
          <p>Accounts</p>
          <p>Billing</p>
        </div>
        <div className="min-w-0 p-3 sm:p-4">
          <div className="flex items-end justify-between gap-3">
            <p className="font-serif text-2xl tracking-tight">Thursday</p>
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
    <div className="border border-white/10 bg-white/5 px-2.5 py-2">
      <p className="font-mono text-[10px] text-[#c4a574]">{time}</p>
      <p className="mt-1 truncate text-xs text-paper">{name}</p>
    </div>
  );
}

function CommerceFrame() {
  return (
    <div className="grid bg-[#f4f1ea] text-[#141816] sm:grid-cols-2">
      <div className="relative min-h-52 bg-[#1c463a]">
        <div className="absolute top-4 left-4 text-[10px] tracking-[0.16em] text-[#c4a574] uppercase">
          Object 04
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-6">
          <div className="w-16">
            <div className="mx-auto h-3 w-8 bg-[#c4a574]" />
            <div className="h-28 bg-[#f4f1ea]" />
            <div className="mx-auto h-2 w-10 bg-[#d8d1c4]" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between p-5">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-[#6d4c28] uppercase">
            Atelier
          </p>
          <p className="mt-3 font-serif text-3xl leading-none tracking-tight">
            Stone vessel
          </p>
          <p className="mt-3 text-sm text-[#4e5853]">$48 · Ships in two days</p>
        </div>
        <div className="mt-6">
          <div className="flex gap-2 text-[11px]">
            <span className="border border-[#141816] px-2 py-1">Small</span>
            <span className="border border-[#d8d1c4] px-2 py-1 text-[#4e5853]">
              Large
            </span>
          </div>
          <div className="mt-3 flex h-9 items-center justify-center bg-[#141816] text-[11px] tracking-wide text-[#f4f1ea]">
            Add to bag
          </div>
        </div>
      </div>
    </div>
  );
}
