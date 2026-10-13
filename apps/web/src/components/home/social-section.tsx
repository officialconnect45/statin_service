import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { ArrowUpRightIcon, SocialIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/typography";
import { social } from "@/lib/site";

export function SocialSection() {
  return (
    <section id="updates" aria-labelledby="updates-title" className="bg-paper-deep py-24 md:py-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            id="updates-title"
            eyebrow="Updates"
            title="Follow what we're building."
            className="lg:col-span-7"
          />
          <p data-reveal className="t-lede text-ink-soft lg:col-span-5">
            Engineering notes, product updates, and a look at how the work gets made.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {social.map((item, index) => (
            <li key={item.id} data-reveal style={{ "--d": index * 100 } as CSSProperties}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Open"
                className="group relative flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white p-7 transition-[background-color,border-color,color] duration-500 hover:border-night hover:bg-night hover:text-white md:p-8"
              >
                <span
                  aria-hidden="true"
                  className="bg-grid absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
                <span className="relative flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white transition-[background-color,scale] duration-500 group-hover:scale-110 group-hover:bg-cobalt">
                    <SocialIcon id={item.id} className="h-5 w-5" />
                  </span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/15 transition-[rotate,background-color] duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-ink">
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </span>
                </span>
                <span className="relative mt-14 block">
                  <span className="block text-3xl font-medium tracking-tight">{item.label}</span>
                  <span className="mt-1 block font-mono text-xs text-mist transition-colors group-hover:text-signal">
                    {item.handle}
                  </span>
                  <span className="mt-4 block text-sm leading-relaxed text-ink-soft transition-colors group-hover:text-fog">
                    {item.detail}
                  </span>
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
