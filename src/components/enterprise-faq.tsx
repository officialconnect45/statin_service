"use client";

import { useState } from "react";

export function EnterpriseFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who owns the code, design, and intellectual property?",
      a: "You own 100% of all source code, design systems, and intellectual property from day one. Everything is committed directly to your private GitHub organization with full documentation and deployment scripts. There is zero vendor lock-in.",
    },
    {
      q: "How fast can you take our SaaS or website from brief to launch?",
      a: "Our focused SaaS MVP sprint is structured to launch within 3 to 6 weeks. Company website systems and lead engines typically launch within 2 to 3 weeks. We work with strict milestone boundaries to ensure your launch date is reliable.",
    },
    {
      q: "Can our existing or future in-house engineers easily maintain this?",
      a: "Yes. We strictly adhere to clean enterprise TypeScript, modern Next.js 16 App Router architecture, and standard relational databases (PostgreSQL/Supabase). Every component is typed, documented, and linted to standard conventions so any senior engineer can step in seamlessly.",
    },
    {
      q: "How do we collaborate and communicate during the build?",
      a: "You have direct access to your lead architect via a dedicated Slack/Discord channel, asynchronous Loom video walkthroughs, and weekly live staging demos where you test real software, not PowerPoint slides.",
    },
    {
      q: "What happens after launch? Do you offer ongoing engineering support?",
      a: "Every engagement includes 30 days of post-launch stewardship, monitoring, and bug warranty at no additional cost. Following that, we offer monthly fractional partnership retainers for teams that want continuous feature velocity without hiring a full engineering department.",
    },
    {
      q: "How are project costs and milestone payments structured?",
      a: "We do not believe in open-ended hourly billing. Following our discovery session, you receive a transparent, fixed-price proposal broken into milestone deliverables. You only pay for agreed-upon deliverables.",
    },
  ];

  return (
    <section className="border-b border-line bg-slate-50/40 py-20 md:py-28">
      <div className="mx-auto w-full max-w-[900px] px-5 md:px-8">
        <div className="text-center">
          <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
            Frequently Asked Questions
          </p>
          <h2 className="mt-3 font-serif text-4xl font-normal tracking-tight text-slate-900 md:text-5xl">
            Everything Founders Ask Us
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Clear answers about ownership, timelines, and how we deliver.
          </p>
        </div>

        <div className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className="py-5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full cursor-pointer items-center justify-between text-left text-base font-semibold text-slate-900 transition-colors hover:text-[#244df5]"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
