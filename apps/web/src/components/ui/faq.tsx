"use client";

import { useId, useState } from "react";

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.q} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight text-ink transition-colors hover:text-cobalt md:text-xl"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`relative h-8 w-8 shrink-0 rounded-full border border-line transition-colors group-hover:border-cobalt ${
                    isOpen ? "bg-ink" : ""
                  }`}
                >
                  <span
                    className={`absolute top-1/2 left-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 ${
                      isOpen ? "bg-white" : "bg-ink"
                    }`}
                  />
                  <span
                    className={`absolute top-1/2 left-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-ink transition-transform duration-300 ${
                      isOpen ? "scale-y-0" : ""
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-2xl pb-7 text-base leading-relaxed text-ink-soft">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
