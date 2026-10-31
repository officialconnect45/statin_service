"use client";

import { useState, type PointerEvent } from "react";
import { layers, rails } from "@/lib/content";

type Focus = string;

type SelectProps = {
  onPointerEnter: (event: PointerEvent) => void;
  onFocus: () => void;
  onClick: () => void;
  "aria-pressed": boolean;
  "aria-controls": string;
};

const railList = [rails.security, rails.measurement];

/**
 * Interactive blueprint of how a Statin system is layered. Hovering or
 * focusing a layer highlights its connections; the rails (security and
 * measurement) light up every layer they span.
 */
export function Architecture() {
  const [focus, setFocus] = useState<Focus>("services");

  const all = [...layers, ...railList];
  const current = all.find((item) => item.id === focus) ?? layers[0];
  const isRail = focus === "security" || focus === "measurement";

  const select = (id: string): SelectProps => ({
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === "mouse") setFocus(id);
    },
    onFocus: () => setFocus(id),
    onClick: () => setFocus(id),
    "aria-pressed": focus === id,
    "aria-controls": "architecture-detail",
  });

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Detail */}
      <div className="lg:col-span-4 lg:order-2">
        <div
          id="architecture-detail"
          className="rounded-3xl border border-night-line bg-night-2 p-7 lg:sticky lg:top-28"
        >
          <p className="t-eyebrow text-signal">
            {"code" in current ? `${current.code} · ` : ""}
            {current.role}
          </p>
          <p key={current.id} className="fade-load mt-5 text-3xl font-medium tracking-tight text-white">
            {current.name}
          </p>
          <p key={`${current.id}-d`} className="fade-load mt-4 text-[15px] leading-relaxed text-fog">
            {current.detail}
          </p>
          <ul key={`${current.id}-s`} className="fade-load mt-6 flex flex-wrap gap-2">
            {current.stack.map((item) => (
              <li
                key={item}
                className="rounded-full border border-night-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Blueprint */}
      <div className="lg:col-span-8 lg:order-1">
        <div className="relative grid grid-cols-[36px_1fr_36px] gap-2 sm:grid-cols-[52px_1fr_52px] sm:gap-3">
          <Rail rail={rails.security} side="left" active={focus === "security"} props={select("security")} />

          <ol className="relative flex flex-col">
            {layers.map((layer, index) => {
              const active = focus === layer.id;
              const lit = active || isRail;
              return (
                <li key={layer.id} className="relative">
                  {index > 0 ? (
                    <svg aria-hidden="true" viewBox="0 0 20 28" className="mx-auto block h-6 w-5 sm:h-7" fill="none">
                      <line
                        x1="10" y1="0" x2="10" y2="28"
                        stroke={lit || focus === layers[index - 1].id ? "#a5a2ff" : "rgb(255 255 255 / 0.18)"}
                        className="dash-flow"
                        style={{ transition: "stroke 0.4s" }}
                      />
                    </svg>
                  ) : null}
                  <button
                    type="button"
                    {...select(layer.id)}
                    className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-[border-color,background-color] duration-500 sm:px-6 sm:py-5 ${
                      active
                        ? "border-signal/60 bg-cobalt/15"
                        : lit
                          ? "border-signal/30 bg-white/[0.04]"
                          : "border-night-line bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-0 w-0.5 transition-colors duration-500 ${
                        active ? "bg-signal" : "bg-transparent"
                      }`}
                    />
                    <span className="font-mono text-[11px] text-fog">{layer.code}</span>
                    <span className="min-w-0">
                      <span className="block text-lg font-medium tracking-tight text-white sm:text-xl">
                        {layer.name}
                      </span>
                      <span className="block text-xs text-fog sm:text-sm">{layer.role}</span>
                    </span>
                    <span className="ml-auto hidden flex-wrap justify-end gap-1.5 md:flex">
                      {layer.stack.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition-colors duration-500 ${
                            active ? "border-signal/40 text-white" : "border-night-line text-white/50"
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              );
            })}

          </ol>

          <Rail rail={rails.measurement} side="right" active={focus === "measurement"} props={select("measurement")} />
        </div>

        {/* Output */}
        <div className="grid grid-cols-[36px_1fr_36px] gap-2 sm:grid-cols-[52px_1fr_52px] sm:gap-3">
          <div className="col-start-2">
            <svg aria-hidden="true" viewBox="0 0 20 34" className="mx-auto block h-8 w-5" fill="none">
              <line x1="10" y1="0" x2="10" y2="26" stroke="#a5a2ff" className="dash-flow" />
              <path d="M5 24 10 32 15 24" stroke="#a5a2ff" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="flex items-center justify-between gap-4 rounded-2xl bg-signal px-5 py-4 text-night sm:px-6">
              <span className="text-lg font-medium tracking-tight sm:text-xl">Business insight</span>
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase">Outcome</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Rail({
  rail,
  side,
  active,
  props,
}: {
  rail: (typeof railList)[number];
  side: "left" | "right";
  active: boolean;
  props: SelectProps;
}) {
  return (
    <button
      type="button"
      {...props}
      className={`group relative flex items-center justify-center rounded-2xl border transition-[border-color,background-color] duration-500 ${
        active
          ? "border-signal/60 bg-cobalt/20"
          : "border-dashed border-white/15 bg-white/[0.02] hover:border-white/30"
      }`}
    >
      <span
        className={`font-mono text-[10px] tracking-[0.22em] whitespace-nowrap uppercase transition-colors sm:text-[11px] ${
          active ? "text-white" : "text-fog"
        }`}
        style={{ writingMode: "vertical-rl", transform: side === "left" ? "rotate(180deg)" : undefined }}
      >
        {rail.name} · {rail.role}
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 mx-auto h-full w-px overflow-hidden ${active ? "" : "opacity-0"}`}
      >
        <span className="motion-only comet-y absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-transparent via-signal to-transparent" />
      </span>
    </button>
  );
}
