"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Specimen } from "@/components/work/specimens";
import { ArrowIcon } from "@/components/ui/icons";
import { services } from "@/lib/services";

export function Capabilities() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const current = services[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <ol className="border-t border-line lg:col-span-7">
        {services.map((service, index) => {
          const open = index === active;
          const panelId = `${baseId}-${service.slug}`;
          return (
            <li key={service.slug} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setActive(index)}
                  data-cursor={open ? undefined : "Expand"}
                  className="group flex w-full items-baseline gap-5 py-7 text-left md:gap-8 md:py-8"
                >
                  <span
                    className={`font-mono text-xs transition-colors duration-300 ${
                      open ? "text-cobalt" : "text-mist"
                    }`}
                  >
                    {service.index}
                  </span>
                  <span
                    className={`flex-1 font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.1vw,2.6rem)] leading-[1.06] font-semibold tracking-[-0.035em] transition-[color,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      open ? "translate-x-1 text-ink" : "text-ink/50 group-hover:text-ink/75"
                    }`}
                  >
                    {service.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`hidden h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border transition-[background-color,border-color,color,rotate] duration-500 sm:inline-flex ${
                      open
                        ? "rotate-0 border-cobalt bg-cobalt text-white"
                        : "-rotate-45 border-line text-ink/50"
                    }`}
                  >
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-label={service.title}
                className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden" inert={!open}>
                  <div className="grid gap-6 pb-9 pl-9 md:pl-14 xl:grid-cols-2">
                    <div>
                      <p className="text-base leading-relaxed text-ink-soft">{service.summary}</p>
                      <p className="mt-4 text-sm leading-relaxed text-mist">
                        <span className="font-medium text-ink">Best fit · </span>
                        {service.audience}
                      </p>
                    </div>
                    <div>
                      <ul className="space-y-2.5 text-sm text-ink-soft">
                        {service.includes.slice(0, 4).map((item) => (
                          <li key={item} className="flex gap-3">
                            <span aria-hidden="true" className="mt-2 h-1 w-3 shrink-0 bg-cobalt" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/services/${service.slug}`}
                        data-cursor="Explore"
                        className="group/link mt-6 inline-flex items-center gap-2 text-sm font-medium text-cobalt"
                      >
                        <span className="link-line">Explore {service.short.toLowerCase()}</span>
                        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                  <div className="pb-9 lg:hidden">
                    <Specimen variant={service.specimen} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Sticky visual for large screens */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-24">
          <div className="relative overflow-hidden rounded-3xl bg-night p-6 text-white shadow-[0_50px_100px_-45px_rgb(79_70_229/0.7)]">
            <div
              aria-hidden="true"
              className="bg-grid absolute inset-0 transition-[background-position] duration-1000 ease-out"
              style={{ backgroundPosition: `${active * 24}px ${active * -16}px` }}
            />
            <div className="relative flex items-center justify-between">
              <p className="t-eyebrow text-signal">
                {current.index} · {current.short}
              </p>
              <div aria-hidden="true" className="flex gap-1">
                {services.map((service, index) => (
                  <span
                    key={service.slug}
                    className={`h-1 rounded-full transition-[width,background-color] duration-500 ${
                      index === active ? "w-6 bg-signal" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative mt-6 grid">
              {services.map((service, index) => (
                <div
                  key={service.slug}
                  className={`col-start-1 row-start-1 transition-[opacity,translate,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    index === active
                      ? "translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none translate-y-4 scale-[0.98] opacity-0"
                  }`}
                >
                  <Specimen variant={service.specimen} />
                </div>
              ))}
            </div>

            <div className="relative mt-6 border-t border-night-line pt-5">
              <p className="t-eyebrow text-fog">Typical stack</p>
              <ul key={current.slug} className="fade-load mt-3 flex flex-wrap gap-2">
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
        </div>
      </div>
    </div>
  );
}
