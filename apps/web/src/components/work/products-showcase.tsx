"use client";

import { useState } from "react";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { products, type Product } from "@/lib/content";

/* ------------------------------------------------------------------ */
/* Demos: illustrative only, nothing is sent to the real products.      */
/* ------------------------------------------------------------------ */

function slugFor(input: string) {
  let hash = 5381;
  for (const char of input) hash = ((hash << 5) + hash + char.charCodeAt(0)) >>> 0;
  return hash.toString(36).slice(0, 6).padEnd(6, "x");
}

function ShortenDemo() {
  const [value, setValue] = useState("https://example.com/summer-campaign");
  const [result, setResult] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (trimmed) setResult(slugFor(trimmed));
      }}
    >
      <label htmlFor="demo-url" className="font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
        Paste a long link
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="demo-url"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setResult(null);
          }}
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
          placeholder="https://"
        />
        <button
          type="submit"
          className="rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-cobalt hover:text-white"
        >
          Shorten
        </button>
      </div>
      {result ? (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <p className="font-mono text-lg text-white">statin.io/{result}</p>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-white/60">
            <div>
              <dt>Clicks</dt>
              <dd className="mt-1 text-base font-medium text-white">1,284</dd>
            </div>
            <div>
              <dt>Top country</dt>
              <dd className="mt-1 text-base font-medium text-white">India</dd>
            </div>
            <div>
              <dt>Conversions</dt>
              <dd className="mt-1 text-base font-medium text-white">96</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-white/40">Sample numbers shown for illustration.</p>
        </div>
      ) : (
        <p className="text-xs text-white/40">Every short link comes with click and conversion analytics.</p>
      )}
    </form>
  );
}

type Scenario = {
  label: string;
  proxy: boolean;
  vpn: boolean;
  tor: boolean;
  hosting: boolean;
};

const scenarios: Scenario[] = [
  { label: "Home network", proxy: false, vpn: false, tor: false, hosting: false },
  { label: "Commercial VPN", proxy: true, vpn: true, tor: false, hosting: false },
  { label: "Cloud server", proxy: false, vpn: false, tor: false, hosting: true },
  { label: "Tor exit node", proxy: true, vpn: false, tor: true, hosting: false },
];

function TrafficDemo() {
  const [index, setIndex] = useState(1);
  const scenario = scenarios[index];

  const reasons: { label: string; risk: number }[] = [];
  if (scenario.tor) reasons.push({ label: "Tor exit node", risk: 40 });
  if (scenario.vpn) reasons.push({ label: "VPN IP range", risk: 30 });
  if (scenario.hosting) reasons.push({ label: "Hosting / datacenter IP", risk: 20 });
  const risk = Math.min(100, reasons.reduce((sum, reason) => sum + reason.risk, 0));
  const level = risk >= 40 ? "High risk" : risk > 0 ? "Medium risk" : "Low risk";

  const signals: [string, boolean][] = [
    ["Proxy", scenario.proxy],
    ["VPN", scenario.vpn],
    ["Tor", scenario.tor],
    ["Hosting", scenario.hosting],
  ];

  return (
    <div className="space-y-5">
      <p className="font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">Pick a visitor type</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Visitor type">
        {scenarios.map((item, i) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              i === index
                ? "border-white bg-white text-ink"
                : "border-white/20 text-white/80 hover:border-white/60"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ul className="grid grid-cols-4 gap-2 text-center text-xs">
        {signals.map(([name, on]) => (
          <li
            key={name}
            className={`rounded-xl border px-2 py-3 ${
              on ? "border-white/60 bg-white/15 text-white" : "border-white/10 text-white/40"
            }`}
          >
            <span className="block">{name}</span>
            <span className="mt-1 block font-medium">{on ? "Yes" : "No"}</span>
          </li>
        ))}
      </ul>
      <div>
        <div className="flex items-baseline justify-between text-sm text-white">
          <span>Risk score</span>
          <span className="font-mono">
            {risk} · {level}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-500"
            style={{ width: `${risk}%` }}
          />
        </div>
        <p className="mt-3 min-h-5 text-xs text-white/60">
          {reasons.length
            ? reasons.map((reason) => `${reason.label} (+${reason.risk})`).join(" · ")
            : "No risk signals detected."}
        </p>
      </div>
    </div>
  );
}

function EarnDemo() {
  const [clicks, setClicks] = useState(50000);
  const [creator, setCreator] = useState(false);
  const rate = creator ? 4.5 : 4;
  const earnings = (clicks / 1000) * rate;

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="demo-clicks" className="flex items-baseline justify-between text-sm text-white">
          <span className="font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
            Monthly visits
          </span>
          <span className="font-mono">{clicks.toLocaleString("en-US")}</span>
        </label>
        <input
          id="demo-clicks"
          type="range"
          min={1000}
          max={500000}
          step={1000}
          value={clicks}
          onChange={(event) => setClicks(Number(event.target.value))}
          className="mt-3 w-full accent-white"
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-white/80">
        <input
          type="checkbox"
          checked={creator}
          onChange={(event) => setCreator(event.target.checked)}
          className="h-4 w-4 accent-white"
        />
        I&apos;m a YouTuber or Telegram channel owner
      </label>
      <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
        <p className="text-xs text-white/60">Estimated monthly earnings at ${rate.toFixed(2)} CPM</p>
        <p className="mt-1 font-mono text-3xl text-white">
          ${earnings.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="mt-3 text-xs text-white/40">
          Estimate only. Rates and payouts are set by YouLinks and may change.
        </p>
      </div>
    </div>
  );
}

function Demo({ product }: { product: Product }) {
  if (product.demo === "shorten") return <ShortenDemo />;
  if (product.demo === "traffic") return <TrafficDemo />;
  return <EarnDemo />;
}

/* ------------------------------------------------------------------ */

function ProductBlock({ product, flip }: { product: Product; flip: boolean }) {
  const [openFeature, setOpenFeature] = useState(0);

  return (
    <article id={product.id} className="grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
        <p className="t-eyebrow flex flex-wrap items-center gap-x-3 text-cobalt">
          <span>{product.category}</span>
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
          <span>{product.host}</span>
        </p>
        <h3 className="mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance">
          {product.name}: {product.tagline}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.description}</p>

        <ul className="mt-6 divide-y divide-line border-y border-line">
          {product.features.map((feature, i) => {
            const open = i === openFeature;
            return (
              <li key={feature.title}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFeature(open ? -1 : i)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-ink"
                >
                  {feature.title}
                  <span aria-hidden="true" className="font-mono text-cobalt">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? <p className="pb-4 text-sm leading-relaxed text-ink-soft">{feature.detail}</p> : null}
              </li>
            );
          })}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Highlights">
          {product.facts.map((fact) => (
            <li key={fact} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-soft">
              {fact}
            </li>
          ))}
        </ul>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-cobalt"
        >
          Visit {product.host}
          <ArrowUpRightIcon className="h-4 w-4" />
        </a>
      </div>

      <div className={`rounded-3xl bg-night p-6 sm:p-8 lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
        <p className="mb-5 font-mono text-[11px] tracking-[0.12em] text-white/40 uppercase">
          Try it · interactive preview
        </p>
        <Demo product={product} />
      </div>
    </article>
  );
}

export function ProductsShowcase() {
  return (
    <div className="space-y-20 md:space-y-28">
      {products.map((product, index) => (
        <ProductBlock key={product.id} product={product} flip={index % 2 === 1} />
      ))}
    </div>
  );
}
