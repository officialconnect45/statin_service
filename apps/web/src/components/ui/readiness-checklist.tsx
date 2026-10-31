"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";

/**
 * "What we need from you" as a checklist the visitor can tick. A ring fills
 * as items are checked; with all of them ticked, a call to action appears.
 */
export function ReadinessChecklist({ items }: { items: readonly string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const done = checked.filter(Boolean).length;
  const ready = done === items.length;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="card-premium overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="flex items-center gap-5">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
            <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--color-paper-deep)" strokeWidth="6" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="url(#readiness-gradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - done / items.length)}
              style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
            />
            <defs>
              <linearGradient id="readiness-gradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#4f46e5" />
                <stop offset="1" stopColor="#c06bf0" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
            {done}/{items.length}
          </span>
        </div>
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
            {ready ? "You're ready to start." : "Are you ready to start?"}
          </p>
          <p className="text-sm text-mist">Tick what you already have in place.</p>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((item, index) => {
          const on = checked[index];
          return (
            <li key={item}>
              <label
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-[background-color,border-color] duration-300 ${
                  on ? "border-cobalt/30 bg-cobalt/[0.06]" : "border-line bg-white hover:border-cobalt/25"
                }`}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={on}
                  onChange={() => setChecked((list) => list.map((value, i) => (i === index ? !value : value)))}
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-[background-color,border-color] duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-cobalt/40 ${
                    on ? "bg-brand border-transparent" : "border-line bg-white"
                  }`}
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="2.4">
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 4.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="14"
                      strokeDashoffset={on ? 0 : 14}
                      style={{ transition: "stroke-dashoffset 0.35s ease-out" }}
                    />
                  </svg>
                </span>
                <span className={`text-base leading-relaxed ${on ? "text-ink" : "text-ink-soft"}`}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ${
          ready ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden" inert={!ready}>
          <div className="bg-brand flex flex-col items-start justify-between gap-4 rounded-2xl p-5 text-white sm:flex-row sm:items-center">
            <p className="font-medium">Everything&apos;s in place. Let&apos;s plan your project.</p>
            <ButtonLink href="/contact" variant="light" className="h-11 px-5">
              Let&apos;s talk
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
