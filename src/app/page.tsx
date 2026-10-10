import Link from "next/link";
import { CaseStudiesGrid } from "@/components/case-studies-grid";
import { ComparisonMatrix } from "@/components/comparison-matrix";
import { Container } from "@/components/container";
import { EnterpriseFaq } from "@/components/enterprise-faq";
import { EnterpriseLeadForm } from "@/components/enterprise-lead-form";
import { LeadCalculator } from "@/components/lead-calculator";
import { SaasInteractiveHero } from "@/components/saas-interactive-hero";
import { SocialProofMarquee } from "@/components/social-proof-marquee";
import {
  engagements,
  fit,
  method,
  services,
  standards,
} from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* ========================================================
          HERO SECTION: ENTERPRISE POSITIONING & LEAD MAGNET
      ======================================================== */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-white via-blue-50/20 to-white py-16 md:py-24">
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/15 via-[#38bdf8]/10 to-transparent blur-3xl"
        />

        <Container className="space-y-12">
          {/* Top Headline block */}
          <div className="mx-auto max-w-4xl text-center">
            {/* Live cohort availability badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-[#244df5] shadow-xs backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#244df5] animate-pulse" />
              <span>Now Accepting Q4 Founder Cohorts · 3 Sprint Slots Remaining</span>
            </div>

            <h1 className="mt-6 font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.96] tracking-[-0.035em] text-balance text-slate-900">
              Enterprise-Grade SaaS & Websites{" "}
              <span className="italic text-[#244df5]">for startups & SMBs.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Skip the technical debt, fragmented freelancers, and 6-month agency meetings. Statin designs, engineers, and launches production-grade digital products in 3 to 6 weeks with 100% source code ownership.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#lead-intake"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#244df5] px-6 text-sm font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#1a3ee8] hover:shadow-lg"
              >
                Get Custom Scope & Proposal →
              </a>
              <a
                href="#calculator"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold tracking-wide text-slate-800 shadow-xs transition-all hover:border-[#244df5] hover:text-[#244df5] hover:bg-blue-50/40"
              >
                Estimate Scope & Timeline
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> 100% IP & Code Ownership
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Fixed-Scope & Price Guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> 14–28 Day MVP Sprints
              </span>
            </div>
          </div>

          {/* Interactive SaaS and Web Specimen */}
          <div className="pt-2">
            <SaasInteractiveHero />
          </div>
        </Container>
      </section>

      {/* ========================================================
          SOCIAL PROOF MARQUEE & CLIENT METRICS
      ======================================================== */}
      <SocialProofMarquee />

      {/* ========================================================
          HOW ENGAGEMENTS RUN (STANDARDS)
      ======================================================== */}
      <section aria-label="How an engagement runs" className="border-b border-line bg-white">
        <Container className="grid sm:grid-cols-2 lg:grid-cols-4">
          {standards.map((item, index) => (
            <div
              key={item.label}
              className={`py-8 px-4 lg:px-6 ${
                index > 0 ? "lg:border-l lg:border-line" : "lg:pl-0"
              } ${index % 2 === 1 ? "sm:border-l sm:border-line sm:pl-6" : ""} ${
                index > 1 ? "border-t border-line sm:border-t-0" : ""
              }`}
            >
              <p className="font-sans text-sm font-bold text-slate-900">{item.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.detail}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* ========================================================
          CORE SERVICE PRACTICES (TAILORED FOR STARTUPS & SMBs)
      ======================================================== */}
      <section id="services" className="border-b border-line bg-slate-50/50 py-20 md:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
                Core Service Capabilities
              </p>
              <h2 className="mt-3 max-w-xl font-serif text-4xl font-normal tracking-tight text-slate-900 md:text-5xl">
                Engineered for rapid growth and revenue capture.
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold tracking-wide text-[#244df5] underline decoration-blue-200 underline-offset-4 hover:decoration-[#244df5]"
            >
              Explore all technical practices →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-[#244df5]/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#244df5]">
                      {service.index}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      {service.timeline}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#244df5] transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {service.summary}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    {service.includes.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[#244df5]">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244df5] hover:underline"
                  >
                    <span>View deliverables & process</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================================================
          INTERACTIVE LEAD CALCULATOR (PROJECT SCOPE ESTIMATOR)
      ======================================================== */}
      <LeadCalculator />

      {/* ========================================================
          PROVEN CASE STUDIES GRID
      ======================================================== */}
      <CaseStudiesGrid />

      {/* ========================================================
          THE STANDARD SECTION (DEEP OBSIDIAN BLUE ACCENT)
      ======================================================== */}
      <section className="border-b border-line bg-[#070b1e] text-white py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#38bdf8] uppercase">
              The Engineering Standard
            </p>
            <p className="mt-6 font-serif text-[clamp(2.2rem,4.5vw,3.7rem)] leading-[1.05] tracking-[-0.03em] text-balance">
              An MVP can be tight in scope. It must never be sloppy in code.
            </p>
          </div>
          <div className="flex flex-col justify-end md:col-span-5">
            <p className="text-base leading-relaxed text-slate-300">
              Startup founders and growing businesses partner with Statin when slide decks and mockups aren&apos;t enough. The website must capture real customers. The SaaS product must process payments securely. We engineer those foundations to handle scale on day one.
            </p>
          </div>
        </Container>
      </section>

      {/* ========================================================
          COMPARISON MATRIX TABLE (WHY STATIN WINS)
      ======================================================== */}
      <ComparisonMatrix />

      {/* ========================================================
          FIT CRITERIA (FOUNDER ALIGNMENT)
      ======================================================== */}
      <section className="border-b border-line bg-white py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
              Ideal Fit
            </p>
            <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight text-slate-900 md:text-5xl">
              Built for founders with a clear market focus.
            </h2>
            <ul className="mt-8 space-y-4">
              {fit.yes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#244df5]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-7 md:p-10">
            <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
              When We Are Not A Fit
            </p>
            <ul className="mt-6 space-y-4">
              {fit.no.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-slate-200 pt-5 text-sm font-medium text-slate-900">
              If your offer is specific and you value direct founder-to-engineer collaboration, we should talk.
            </p>
          </div>
        </Container>
      </section>

      {/* ========================================================
          METHODOLOGY / PROCESS TIMELINE
      ======================================================== */}
      <section className="border-b border-line bg-slate-50/50 py-20 md:py-28">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
              Methodology
            </p>
            <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight text-balance text-slate-900 md:text-5xl">
              A transparent plan before any code is written.
            </h2>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {method.map((step) => (
              <li key={step.index} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <p className="font-mono text-xs font-bold text-[#244df5]">
                  {step.index} · {step.time}
                </p>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900">{step.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ========================================================
          ENGAGEMENT MODELS / PRICING STRUCTURE
      ======================================================== */}
      <section id="pricing" className="border-b border-line bg-white py-20 md:py-28">
        <Container>
          <div className="text-center">
            <p className="font-mono text-[11px] font-semibold tracking-[0.22em] text-[#244df5] uppercase">
              Engagement Models
            </p>
            <h2 className="mt-3 font-serif text-4xl font-normal tracking-tight text-balance text-slate-900 md:text-5xl">
              Transparent, Milestone-Based Models
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600">
              Choose the engagement structure that aligns with your runway and release milestones.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {engagements.map((engagement) => {
              const isFeatured = "featured" in engagement && engagement.featured;
              return (
                <article
                  key={engagement.name}
                  className={`flex flex-col justify-between rounded-2xl border p-7 md:p-8 transition-all ${
                    isFeatured
                      ? "border-blue-500/40 bg-[#070b1e] text-white shadow-xl ring-1 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-3xl tracking-tight">{engagement.name}</h3>
                      {isFeatured && (
                        <span className="rounded-full bg-[#244df5] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                          Most Popular
                        </span>
                      )}
                    </div>

                    <p className={`mt-2 text-xs font-semibold ${isFeatured ? "text-[#38bdf8]" : "text-[#244df5]"}`}>
                      {engagement.fit}
                    </p>

                    <p className={`mt-5 text-xs leading-relaxed ${isFeatured ? "text-slate-300" : "text-slate-600"}`}>
                      {engagement.detail}
                    </p>

                    <ul className={`mt-6 space-y-2.5 border-t pt-5 text-xs ${isFeatured ? "border-white/10" : "border-slate-100"}`}>
                      {engagement.points.map((point) => (
                        <li key={point} className="flex items-center gap-2">
                          <span className={isFeatured ? "text-[#38bdf8]" : "text-[#244df5]"}>✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4">
                    <a
                      href="#lead-intake"
                      className={`block w-full rounded-xl py-3 text-center text-xs font-semibold transition-all ${
                        isFeatured
                          ? "bg-[#244df5] text-white hover:bg-[#1a3ee8] shadow-md"
                          : "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      Inquire for this model →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ========================================================
          FREQUENTLY ASKED QUESTIONS
      ======================================================== */}
      <EnterpriseFaq />

      {/* ========================================================
          ENTERPRISE LEAD CAPTURE FORM SECTION
      ======================================================== */}
      <EnterpriseLeadForm />
    </>
  );
}
