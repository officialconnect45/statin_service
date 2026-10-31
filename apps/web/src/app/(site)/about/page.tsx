import type { CSSProperties } from "react";
import { ClosingCta } from "@/components/home/closing-cta";
import { WhyStatin } from "@/components/home/why-statin";
import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
import { PageHero } from "@/components/ui/page-hero";
import { Photo, PhotoChip } from "@/components/ui/photo";
import { TiltCard } from "@/components/ui/tilt-card";
import { Eyebrow, SectionHeading } from "@/components/ui/typography";
import { principles, story } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { photos } from "@/lib/photos";
import { stats } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Statin is a small, founder-led product engineering company building web apps, commerce systems, and backend, data, and AI integrations.",
  path: "/about",
});

const roles = [
  {
    role: "Lead",
    detail: "Owns the scope, the weekly review, and the release boundary.",
  },
  {
    role: "Design",
    detail: "Owns the narrative, the interface, and the system the pages are built from.",
  },
  {
    role: "Engineering",
    detail: "Owns production: the product, the integrations, and the handover.",
  },
];

const storyIcons = [
  <path key="why" d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM10 6.5v4l2.5 1.5" />,
  <path key="what" d="M4 6.5 10 3l6 3.5v7L10 17l-6-3.5v-7ZM4 6.5l6 3.5 6-3.5M10 10v7" />,
  <path key="where" d="M3 10h14M11 4l6 6-6 6" />,
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Statin"
        title="A focused team. Software that works."
        lede="Statin works with teams whose website, store, or software has to carry real weight: a buyer, a customer, an order. We stay small so the person who scopes the work is still in it when it ships."
      />

      <section aria-label="Inside Statin" className="relative -mt-6 pb-8 md:-mt-10">
        <Container>
          <div data-reveal className="grid gap-4 md:grid-cols-12 md:grid-rows-2">
            <Photo
              {...photos.collaboration}
              preload
              sizes="(min-width: 768px) 58vw, 100vw"
              className="h-72 shadow-[0_40px_90px_-45px_rgb(46_35_140/0.6)] md:col-span-7 md:row-span-2 md:h-[540px]"
            >
              <PhotoChip className="bottom-6 left-6">One team from scope to launch</PhotoChip>
            </Photo>
            <Photo
              {...photos.strategyMeeting}
              eager
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-56 md:col-span-5 md:h-auto"
            />
            <Photo
              {...photos.workspace}
              eager
              sizes="(min-width: 768px) 40vw, 100vw"
              className="h-56 md:col-span-5 md:h-auto"
            >
              <PhotoChip className="right-5 bottom-5">Remote-first engineering</PhotoChip>
            </Photo>
          </div>
        </Container>
      </section>

      {/* Numbers, counted up on scroll */}
      <section aria-label="Statin in numbers" className="py-10">
        <Container>
          <dl
            data-reveal
            className="relative grid grid-cols-3 overflow-hidden rounded-[2rem] border border-line bg-white py-8 shadow-[0_24px_60px_-30px_rgb(79_70_229/0.35)]"
          >
            <span
              aria-hidden="true"
              className="bg-grid bg-grid-light mask-radial absolute inset-0 [--grid-size:28px]"
            />
            {stats.map((stat, index) => (
              <div key={stat.label} className={`relative px-3 text-center ${index > 0 ? "border-l border-line" : ""}`}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-[family-name:var(--font-orbitron)] text-[clamp(1.9rem,5vw,3.25rem)] leading-none font-extrabold">
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
        </Container>
      </section>

      {/* Story as a timeline that draws itself while scrolling */}
      <section aria-labelledby="story-heading" className="bg-white py-24 md:py-32">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                id="story-heading"
                eyebrow="Our story"
                title="Software that has to work, built properly."
              />
            </div>
          </div>
          <ol className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[23px] w-0.5 rounded-full bg-line" />
            <span
              aria-hidden="true"
              className="timeline-progress bg-brand absolute top-2 bottom-2 left-[23px] w-0.5 rounded-full"
            />
            {story.map((item, index) => (
              <li
                key={item.label}
                data-reveal
                style={{ "--d": index * 120 } as CSSProperties}
                className="group relative pb-12 pl-20 last:pb-0"
              >
                <span className="bg-brand absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_12px_28px_-10px_rgb(91_70_240/0.8)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {storyIcons[index % storyIcons.length]}
                  </svg>
                </span>
                <p className="t-eyebrow pt-1 text-cobalt">{item.label}</p>
                <p className="mt-3 text-lg leading-relaxed text-ink-soft">{item.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Principles as tilt cards */}
      <section aria-labelledby="beliefs-title" className="relative overflow-hidden bg-paper py-24 md:py-32">
        <div aria-hidden="true" className="aurora">
          <span
            className="orb top-[20%] -left-20 h-80 w-80 bg-indigo-300"
            style={{ "--o": 0.35, "--dx": "60px", "--dy": "40px" } as CSSProperties}
          />
          <span
            className="orb -right-20 bottom-0 h-96 w-96 bg-fuchsia-200"
            style={{ "--o": 0.45, "--dx": "-50px", "--dy": "-30px", "--delay": "-6s" } as CSSProperties}
          />
        </div>
        <Container className="relative">
          <SectionHeading id="beliefs-title" eyebrow="What we believe" title="Four principles we do not trade." />
          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {principles.map((item, index) => (
              <li key={item.index} data-reveal style={{ "--d": (index % 2) * 100 } as CSSProperties}>
                <TiltCard className="h-full rounded-[2rem]">
                  <div className="card-premium h-full overflow-hidden rounded-[2rem] p-8 md:p-10">
                    <p className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight">
                      <span className="text-gradient">{item.index}</span>
                    </p>
                    <h3 className="mt-8 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-soft">{item.detail}</p>
                  </div>
                </TiltCard>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Who you work with: one card per role */}
      <section aria-labelledby="staffing-title" className="tone-dark relative overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="aurora">
          <span
            className="orb -top-32 left-[20%] h-96 w-[520px] bg-indigo-600"
            style={{ "--o": 0.35, "--dx": "70px", "--dy": "30px" } as CSSProperties}
          />
          <div className="bg-grid mask-radial absolute inset-0" />
        </div>
        <Container className="relative py-24 md:py-32">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <Eyebrow className="text-signal">How we staff</Eyebrow>
              <h2 id="staffing-title" className="t-h2 mt-6 max-w-[14ch] text-balance">
                Every engagement has names, not a pool.
              </h2>
            </div>
            <p data-reveal className="t-lede max-w-md text-fog lg:col-span-5 lg:col-start-8">
              Statin is founder-led. You know who is designing, who is engineering, and who answers when the week goes
              sideways.
            </p>
          </div>
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {roles.map((item, index) => (
              <li key={item.role} data-reveal style={{ "--d": index * 100 } as CSSProperties}>
                <TiltCard className="h-full rounded-[2rem]" max={6}>
                  <div className="group relative h-full overflow-hidden rounded-[2rem] border border-night-line bg-white/[0.04] p-8 backdrop-blur transition-colors duration-500 hover:border-signal/40 hover:bg-white/[0.07]">
                    <span
                      aria-hidden="true"
                      className="bg-brand absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
                    />
                    <span className="bg-brand relative flex h-14 w-14 items-center justify-center rounded-2xl font-[family-name:var(--font-display)] text-lg font-semibold shadow-[0_14px_30px_-12px_rgb(91_70_240/0.9)]">
                      {item.role.slice(0, 1)}
                    </span>
                    <h3 className="relative mt-8 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
                      {item.role}
                    </h3>
                    <p className="relative mt-3 text-base leading-relaxed text-fog">{item.detail}</p>
                  </div>
                </TiltCard>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <WhyStatin />
      {/* <SocialSection /> */}
      <ClosingCta />
    </>
  );
}
