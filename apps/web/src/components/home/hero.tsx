import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Magnetic } from "@/components/ui/magnetic";
import { PointerField } from "@/components/ui/pointer-field";
import { Eyebrow, SplitText } from "@/components/ui/typography";
import { Specimen } from "@/components/work/specimens";
import { CountUp } from "@/components/ui/count-up";
import { ArrowIcon } from "@/components/ui/icons";
import { stats } from "@/lib/site";

/**
 * Capability cards around the hero visual. Each links to a service and lights
 * up the matching screen on hover (see `.showcase` in globals.css).
 */
const chips: {
  id: "saas" | "ai" | "commerce" | "security";
  title: string;
  detail: string;
  href: string;
  /** Position when floating beside the frame (xl and up). */
  className: string;
  delay: string;
  icon: ReactNode;
}[] = [
  {
    id: "saas",
    title: "Web apps & SaaS",
    detail: "Built to scale",
    href: "/services/saas",
    className: "top-[16%] -left-24",
    delay: "0s",
    icon: <path d="M3 5.5h14v9H3zM3 8.5h14M7 17.5h6" />,
  },
  {
    id: "ai",
    title: "AI integrations",
    detail: "Into real workflows",
    href: "/services/integrations",
    className: "-right-24 bottom-[18%]",
    delay: "-2s",
    icon: (
      <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3M5.2 5.2l2 2M12.8 12.8l2 2M14.8 5.2l-2 2M7.2 12.8l-2 2M10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    ),
  },
  {
    id: "commerce",
    title: "Commerce",
    detail: "Shopify · WooCommerce",
    href: "/services/ecommerce",
    className: "top-[16%] -right-24",
    delay: "-4s",
    icon: <path d="M3 3.5h2l1.6 9h8.9l1.5-6.5H6M8 16.5h.01M14 16.5h.01" />,
  },
  {
    id: "security",
    title: "Security built in",
    detail: "From the first release",
    href: "/approach",
    className: "bottom-[18%] -left-24",
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
            className="fade-load relative mx-auto mt-14 grid max-w-3xl grid-cols-3 overflow-hidden rounded-[2rem] border border-white/80 bg-white/60 py-7 shadow-[0_24px_60px_-30px_rgb(79_70_229/0.45)] backdrop-blur"
            style={{ "--d": 760 } as CSSProperties}
          >
            <span
              aria-hidden="true"
              className="bg-grid bg-grid-light mask-radial absolute inset-0 [--grid-size:28px]"
            />
            {stats.map((stat, index) => (
              <div key={stat.label} className={`relative px-3 ${index > 0 ? "border-l border-line" : ""}`}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-[family-name:var(--font-orbitron)] text-[clamp(1.9rem,5vw,3.25rem)] leading-none font-extrabold tracking-tight">
                  <span className="text-gradient">
                    <CountUp value={stat.value} />
                    {stat.suffix}
                  </span>
                </dd>
                <dd aria-hidden="true" className="mt-3 text-xs font-medium text-mist sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          {/* Signature visual in a glowing glass frame, with floating capability cards */}
          <div
            className="showcase fade-load relative mx-auto mt-20 max-w-[980px] text-left"
            style={{ "--d": 900 } as CSSProperties}
          >
            <div
              aria-hidden="true"
              className="bg-brand absolute inset-x-[8%] top-[10%] bottom-0 rounded-[3rem] opacity-40 blur-[80px]"
            />
            <div className="relative rounded-[2.25rem] border border-white/80 bg-white/50 p-0 shadow-[0_50px_120px_-50px_rgb(46_35_140/0.6)] backdrop-blur-xl sm:p-3">
              <span aria-hidden="true" className="glow-ring" />
              {/* Product showcase: what we build, as the screens a customer would see */}
              <div className="grid gap-2 sm:gap-3 lg:grid-cols-12">
                <Showcase tile="saas" label="Web apps & SaaS" className="lg:col-span-7 lg:row-span-2">
                  <Specimen variant="saas" fill className={FRAMELESS} />
                </Showcase>
                <Showcase tile="commerce" label="Commerce" className="hidden sm:block lg:col-span-5">
                  <Specimen variant="commerce" className={FRAMELESS} />
                </Showcase>
                <Showcase tile="ai" label="Integrations & AI" className="hidden sm:block lg:col-span-5">
                  <Specimen variant="integration" className={FRAMELESS} />
                </Showcase>
              </div>
            </div>

            {/* Floating beside the frame, above everything (xl and up) */}
            {chips.map((chip) => (
              <Chip
                key={chip.id}
                chip={chip}
                className={`float-y absolute z-20 hidden w-[216px] xl:flex ${chip.className}`}
                style={{ "--delay": chip.delay } as CSSProperties}
              />
            ))}

            {/* Below the frame on smaller screens */}
            <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:hidden">
              {chips.map((chip) => (
                <li key={chip.id}>
                  <Chip chip={chip} className="flex h-full" />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </PointerField>
    </section>
  );
}

/** A specimen fills its showcase tile; the tile supplies the corners. */
const FRAMELESS = "h-full rounded-none border-0 shadow-none";

function Showcase({
  tile,
  label,
  className = "",
  children,
}: {
  tile: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-tile={tile} className={`relative overflow-hidden rounded-[1.5rem] bg-night ${className}`}>
      {children}
      <span className="absolute top-3 right-3 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
        {label}
      </span>
    </div>
  );
}

function Chip({
  chip,
  className = "",
  style,
}: {
  chip: (typeof chips)[number];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Link
      href={chip.href}
      data-chip={chip.id}
      style={style}
      className={`glass group/chip items-center gap-3 rounded-2xl px-4 py-3 transition-[box-shadow,translate,scale] duration-300 hover:scale-[1.04] hover:shadow-[0_24px_50px_-18px_rgb(91_70_240/0.6)] ${className}`}
    >
      <span className="bg-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_8px_20px_-8px_rgb(91_70_240/0.8)] transition-transform duration-300 group-hover/chip:rotate-[-8deg]">
        <svg
          aria-hidden="true"
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
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{chip.title}</span>
        <span className="block truncate text-xs text-mist">{chip.detail}</span>
      </span>
      <ArrowIcon className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-cobalt opacity-0 transition-[opacity,translate] duration-300 group-hover/chip:translate-x-0 group-hover/chip:opacity-100" />
    </Link>
  );
}
