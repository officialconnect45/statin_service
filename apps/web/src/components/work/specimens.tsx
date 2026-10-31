import type { SpecimenVariant } from "@/lib/services";

/**
 * Abstract interface specimens: illustrative product surfaces, not
 * screenshots of client work. Decorative, so hidden from assistive tech.
 */
export function Specimen({
  variant,
  className = "",
  fill = false,
}: {
  variant: SpecimenVariant;
  className?: string;
  /** Stretch to the parent's height (the SaaS frame grows its chart and adds activity). */
  fill?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-2xl border border-white/10 bg-night-2 text-white shadow-[0_40px_80px_-40px_rgb(11_9_32/0.6)] ${
        fill ? "flex flex-col" : ""
      } ${className}`}
    >
      <Chrome variant={variant} />
      {variant === "saas" ? <SaasFrame fill={fill} /> : null}
      {variant === "commerce" ? <CommerceFrame /> : null}
      {variant === "integration" ? <IntegrationFrame /> : null}
      {variant === "site" ? <SiteFrame /> : null}
      {variant === "agency" ? <AgencyFrame /> : null}
    </div>
  );
}

const chromeLabel: Record<SpecimenVariant, string> = {
  saas: "app / operations",
  commerce: "store / product",
  integration: "services / sync",
  site: "site / home",
  agency: "agency / delivery",
};

function Chrome({ variant }: { variant: SpecimenVariant }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="h-2 w-2 rounded-full bg-white/20" />
      <span className="ml-3 font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">
        {chromeLabel[variant]}
      </span>
      <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] text-signal">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        live
      </span>
    </div>
  );
}

const activity = [
  { label: "Invoice #2041 paid", meta: "Billing", tone: "bg-emerald-400" },
  { label: "New tenant: Nordlys AB", meta: "Accounts", tone: "bg-signal" },
  { label: "Role updated: Finance admin", meta: "Roles", tone: "bg-amber-300" },
];

function SaasFrame({ fill = false }: { fill?: boolean }) {
  return (
    <div className={`grid grid-cols-[72px_1fr] sm:grid-cols-[112px_1fr] ${fill ? "min-h-0 flex-1" : ""}`}>
      <div className="space-y-3 border-r border-white/10 px-3 py-4 text-[11px] text-white/50">
        <p className="font-medium text-white">Today</p>
        <p>Accounts</p>
        <p>Billing</p>
        <p>Roles</p>
      </div>
      <div className={`min-w-0 p-4 ${fill ? "flex flex-col" : ""}`}>
        <div className="flex items-end justify-between gap-3">
          <p className="text-xl font-medium tracking-tight">Operations</p>
          <p className="shrink-0 font-mono text-[10px] text-white/50">4 teams</p>
        </div>
        <div className={`mt-4 flex items-end gap-1.5 ${fill ? "min-h-20 flex-1" : "h-16"}`}>
          {[38, 52, 44, 66, 58, 72, 64, 86, 78, 92].map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-sm bg-gradient-to-t from-cobalt/40 to-signal/80"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {["Invoices", "New tenant", "Permissions", "Exports"].map((name) => (
            <div key={name} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-2">
              <p className="truncate text-xs">{name}</p>
            </div>
          ))}
        </div>
        {fill ? (
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">Recent activity</p>
            <ul className="mt-3 space-y-2">
              {activity.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-2"
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.tone}`} />
                  <span className="min-w-0 flex-1 truncate text-xs">{item.label}</span>
                  <span className="shrink-0 font-mono text-[10px] text-white/45">{item.meta}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CommerceFrame() {
  return (
    <div className="grid sm:grid-cols-2">
      <div className="relative min-h-48 border-b border-white/10 bg-gradient-to-br from-night-3 to-night sm:border-r sm:border-b-0">
        <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.14em] text-signal uppercase">
          SKU 0418
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-6">
          <div className="w-14">
            <div className="mx-auto h-2.5 w-7 rounded-t-sm bg-cobalt" />
            <div className="h-24 rounded-sm bg-gradient-to-b from-white to-white/80" />
            <div className="mx-auto h-1.5 w-9 bg-white/20" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between p-5 text-white">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">Catalog</p>
          <p className="mt-3 text-2xl leading-none font-medium tracking-tight">Stone vessel</p>
          <div className="mt-4 space-y-1.5 font-mono text-[10px] text-white/60">
            <p className="flex justify-between"><span>Stock · ERP</span><span className="text-signal">synced</span></p>
            <p className="flex justify-between"><span>Markets</span><span>SE · DK · NO</span></p>
          </div>
        </div>
        <div className="mt-5 flex h-9 items-center justify-center rounded-full bg-cobalt text-[11px] font-medium">
          Add to bag
        </div>
      </div>
    </div>
  );
}

function IntegrationFrame() {
  const sources = ["Store", "ERP", "CRM"];
  return (
    <div className="relative p-5">
      <svg viewBox="0 0 320 170" className="h-auto w-full" fill="none">
        {sources.map((_, index) => {
          const y = 30 + index * 55;
          return (
            <g key={index}>
              <path
                d={`M78 ${y} C 130 ${y}, 130 85, 160 85`}
                stroke="rgb(165 162 255 / 0.5)"
                className="dash-flow"
              />
              <path d={`M210 85 C 240 85, 240 ${y}, 252 ${y}`} stroke="rgb(255 255 255 / 0.18)" />
            </g>
          );
        })}
        {sources.map((label, index) => (
          <g key={label}>
            <rect x="8" y={16 + index * 55} width="70" height="28" rx="6" fill="rgb(255 255 255 / 0.04)" stroke="rgb(255 255 255 / 0.14)" />
            <text x="43" y={34 + index * 55} textAnchor="middle" fill="white" fontSize="11">{label}</text>
          </g>
        ))}
        <rect x="160" y="62" width="50" height="46" rx="10" fill="#5b46f0" />
        <text x="185" y="89" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">API</text>
        {["Orders", "Stock", "AI"].map((label, index) => (
          <g key={label}>
            <rect x="252" y={16 + index * 55} width="60" height="28" rx="6" fill="rgb(165 162 255 / 0.08)" stroke="rgb(165 162 255 / 0.35)" />
            <text x="282" y={34 + index * 55} textAnchor="middle" fill="white" fontSize="11">{label}</text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-white/50">
        <span>POST /webhooks/inventory</span>
        <span className="text-signal">validated</span>
      </div>
    </div>
  );
}

function SiteFrame() {
  return (
    <div className="bg-paper p-5 text-ink">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3 text-[10px] tracking-[0.16em] uppercase">
        <span className="font-semibold">Fieldnote</span>
        <span className="hidden text-mist sm:inline">Services · Work · Contact</span>
      </div>
      <p className="mt-6 text-[2rem] leading-[0.92] font-medium tracking-[-0.04em] sm:text-[2.6rem]">
        The offer,
        <br />
        <span className="text-cobalt">clearly.</span>
      </p>
      <div className="mt-6 grid grid-cols-5 gap-3">
        <div className="col-span-3 space-y-2">
          <div className="h-1.5 w-full rounded-full bg-line" />
          <div className="h-1.5 w-11/12 rounded-full bg-line" />
          <div className="h-1.5 w-4/5 rounded-full bg-line" />
          <div className="mt-4 inline-flex h-7 items-center rounded-full bg-ink px-3 text-[10px] font-medium text-white">
            Book a call
          </div>
        </div>
        <div className="col-span-2 rounded-lg bg-night p-3 text-white">
          <p className="font-mono text-[9px] tracking-[0.14em] text-signal uppercase">Speed</p>
          <div className="mt-3 h-1.5 rounded-full bg-white/10">
            <div className="h-full w-4/5 rounded-full bg-signal" />
          </div>
          <p className="mt-3 font-mono text-[9px] tracking-[0.14em] text-signal uppercase">SEO</p>
          <div className="mt-2 h-1.5 rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-signal" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AgencyFrame() {
  const rows = [
    { name: "Store rebuild", state: "In review", tone: "text-signal" },
    { name: "Landing pages", state: "Delivered", tone: "text-white/60" },
    { name: "Client portal", state: "Building", tone: "text-white" },
  ];
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium tracking-tight">Your agency</p>
        <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-white/60">
          white-label
        </span>
      </div>
      <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
        {rows.map((row) => (
          <li key={row.name} className="flex items-center justify-between py-3 text-xs">
            <span>{row.name}</span>
            <span className={`font-mono text-[10px] ${row.tone}`}>{row.state}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-white/50">
        <span className="h-px flex-1 bg-white/10" />
        delivered by Statin, under your brand
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}
