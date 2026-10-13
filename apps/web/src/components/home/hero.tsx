import type { CSSProperties } from "react";
import { SignalPath } from "@/components/home/signal-path";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Magnetic } from "@/components/ui/magnetic";
import { PointerField } from "@/components/ui/pointer-field";
import { Eyebrow, SplitText } from "@/components/ui/typography";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="tone-dark relative overflow-hidden bg-night text-white">
      <PointerField className="group/hero relative">
        <div
          aria-hidden="true"
          className="bg-grid mask-radial absolute -inset-10 transition-transform duration-1000 ease-out"
          style={{
            transform: "translate3d(calc(var(--mx, 0) * -12px), calc(var(--my, 0) * -10px), 0)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/hero:opacity-100"
          style={{
            background:
              "radial-gradient(560px circle at var(--px, 50%) var(--py, 30%), rgb(42 79 246 / 0.16), transparent 65%)",
          }}
        />

        <Container className="relative pt-32 pb-16 sm:pt-40 lg:pt-44 lg:pb-24">
          <Eyebrow className="fade-load text-signal">Product engineering · Web · Commerce · AI</Eyebrow>

          <SplitText
            as="h1"
            id="hero-title"
            load
            text="We engineer the systems your business runs on."
            accentFrom={5}
            className="t-display mt-7 max-w-[15ch] text-balance"
          />

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-end">
            <p
              className="fade-load t-lede max-w-xl text-fog lg:col-span-6"
              style={{ "--d": 500 } as CSSProperties}
            >
              Statin designs and builds custom web apps, commerce platforms, and backend, data, and
              AI integrations, with security, performance, and measurement built in from the first
              release.
            </p>
            <div
              className="fade-load flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end"
              style={{ "--d": 650 } as CSSProperties}
            >
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href="/contact" className="w-full sm:w-auto">
                  Talk to Statin
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="#capabilities" variant="line-dark" arrow={false}>
                See what we build
              </ButtonLink>
            </div>
          </div>

          <div className="fade-load mt-14 lg:mt-20" style={{ "--d": 800 } as CSSProperties}>
            <SignalPath />
          </div>
        </Container>
      </PointerField>
    </section>
  );
}
