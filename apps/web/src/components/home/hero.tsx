import type { CSSProperties, ReactNode } from "react";
import { SignalPath } from "@/components/home/signal-path";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Magnetic } from "@/components/ui/magnetic";
import { PointerField } from "@/components/ui/pointer-field";
import { Eyebrow, SplitText } from "@/components/ui/typography";
import { patterns, processSteps } from "@/lib/content";
import { services } from "@/lib/services";

const facts = [
  { value: String(services.length), label: "Core capabilities" },
  { value: String(patterns.length), label: "Build patterns" },
  { value: String(processSteps.length), label: "Delivery phases" },
];

/** Floating capability cards around the hero visual. */
const chips: {
  title: string;
  detail: string;
  className: string;
  delay: string;
  icon: ReactNode;
}[] = [
  {
    title: "Web apps & SaaS",
    detail: "Built to scale",
    className: "-top-10 -left-6 xl:-left-12",
    delay: "0s",
    icon: <path d="M3 5.5h14v9H3zM3 8.5h14M7 17.5h6" />,
  },
  {
    title: "AI integrations",
    detail: "Into real workflows",
    className: "-top-10 -right-6 xl:-right-12",
    delay: "-2s",
    icon: (
      <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3M5.2 5.2l2 2M12.8 12.8l2 2M14.8 5.2l-2 2M7.2 12.8l-2 2M10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    ),
  },
  {
    title: "Commerce",
    detail: "Shopify · WooCommerce",
    className: "-bottom-10 -left-6 xl:-left-12",
    delay: "-4s",
    icon: <path d="M3 3.5h2l1.6 9h8.9l1.5-6.5H6M8 16.5h.01M14 16.5h.01" />,
  },
  {
    title: "Security built in",
    detail: "From the first release",
    className: "-right-6 -bottom-10 xl:-right-12",
    delay: "-1s",
    icon: <path d="M10 2.5 4 5v4.5c0 3.6 2.6 6.4 6 7.5 3.4-1.1 6-3.9 6-7.5V5l-6-2.5ZM7.5 10l1.8 1.8L13 8" />,
  },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Aurora backdrop */}
      <div aria-hidden="true" className="aurora">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f3f1ff_55%,#f6f6ff_100%)]" />
        <span
          className="orb -top-40 -left-32 h-[520px] w-[520px] bg-indigo-400"
          style={{ "--o": 0.35, "--dx": "80px", "--dy": "60px", "--dur": "20s" } as CSSProperties}
        />
        <span
          className="orb -top-24 right-[-10%] h-[460px] w-[460px] bg-violet-400"
          style={{ "--o": 0.35, "--dx": "-70px", "--dy": "50px", "--dur": "16s", "--delay": "-4s" } as CSSProperties}
        />
        <span
          className="orb top-[38%] left-1/2 h-[380px] w-[620px] -translate-x-1/2 bg-fuchsia-300"
          style={{ "--o": 0.28, "--dx": "50px", "--dy": "-40px", "--dur": "22s", "--delay": "-8s" } as CSSProperties}
        />
        <span
          className="orb top-[20%] left-[8%] h-56 w-56 bg-sky-300"
          style={{ "--o": 0.3, "--dx": "40px", "--dy": "70px", "--dur": "14s", "--delay": "-2s" } as CSSProperties}
        />
        <div className="bg-grid bg-grid-light mask-radial absolute inset-0" />
      </div>

      <PointerField className="group/hero relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/hero:opacity-100"
          style={{
            background:
              "radial-gradient(520px circle at var(--px, 50%) var(--py, 30%), rgb(124 77 255 / 0.12), transparent 65%)",
          }}
        />

        <Container className="relative pt-44 pb-20 text-center sm:pt-35 lg:pt-40 lg:pb-28">
          <Eyebrow className="fade-load mx-auto bg-white/70 text-cobalt shadow-[0_8px_24px_-12px_rgb(91_70_240/0.45)] backdrop-blur">
            Product engineering · Web · Commerce · AI
          </Eyebrow>

          <SplitText
            as="h1"
            id="hero-title"
            load
            text="We engineer the systems your business runs on."
            accentFrom={5}
            className="t-display mx-auto mt-8 max-w-[15ch] text-balance text-ink"
          />

          <p className="fade-load t-lede mx-auto mt-8 max-w-2xl text-ink-soft" style={{ "--d": 500 } as CSSProperties}>
            Statin designs and builds custom web apps, commerce platforms, and backend, data, and AI integrations, with
            security, performance, and measurement built in from the first release.
          </p>

          <div
            className="fade-load mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ "--d": 650 } as CSSProperties}
          >
            <Magnetic className="w-full sm:w-auto">
              <ButtonLink href="/contact" className="h-13 w-full px-7 sm:w-auto">
                Talk to Statin
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="#capabilities" variant="line" arrow={false} className="h-13 w-full px-7 sm:w-auto">
              See what we build
            </ButtonLink>
          </div>

          <dl
            className="fade-load mx-auto mt-12 grid max-w-2xl grid-cols-3 divide-x divide-line rounded-3xl border border-white/80 bg-white/60 py-5 shadow-[0_20px_50px_-30px_rgb(79_70_229/0.4)] backdrop-blur"
            style={{ "--d": 760 } as CSSProperties}
          >
            {facts.map((fact) => (
              <div key={fact.label} className="px-3">
                <dt className="sr-only">{fact.label}</dt>
                <dd className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
                  <span className="text-gradient">{fact.value}</span>
                </dd>
                <dd aria-hidden="true" className="mt-1 text-xs text-mist md:text-sm">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>

          {/* Signature visual in a glowing glass frame, with floating capability cards */}
          <div
            className="fade-load relative mx-auto mt-20 max-w-[1120px] text-left"
            style={{ "--d": 900 } as CSSProperties}
          >
            <div
              aria-hidden="true"
              className="bg-brand absolute inset-x-[8%] top-[10%] bottom-0 rounded-[3rem] opacity-40 blur-[80px]"
            />
            <div className="relative rounded-[2.25rem] border border-white/80 bg-white/50 p-0 shadow-[0_50px_120px_-50px_rgb(46_35_140/0.6)] backdrop-blur-xl sm:p-3">
              <span aria-hidden="true" className="glow-ring" />
              <SignalPath />
            </div>

            {chips.map((chip) => (
              <div
                key={chip.title}
                aria-hidden="true"
                className={`float-y glass absolute hidden items-center gap-3 rounded-2xl px-4 py-3 lg:flex ${chip.className}`}
                style={{ "--delay": chip.delay } as CSSProperties}
              >
                <span className="bg-brand flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-[0_8px_20px_-8px_rgb(91_70_240/0.8)]">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-[18px] w-[18px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {chip.icon}
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{chip.title}</span>
                  <span className="block text-xs text-mist">{chip.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </Container>
      </PointerField>
    </section>
  );
}
