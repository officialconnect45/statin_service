import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Magnetic } from "@/components/ui/magnetic";
import { PointerField } from "@/components/ui/pointer-field";
import { Eyebrow, SplitText } from "@/components/ui/typography";

/* Lines converging on a single point: many inputs, one system. */
const rays = Array.from({ length: 14 }, (_, index) => {
  const angle = (index / 14) * Math.PI * 2;
  return {
    x: 600 + Math.cos(angle) * 760,
    y: 300 + Math.sin(angle) * 420,
  };
});

export function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="tone-dark relative overflow-hidden bg-night text-white">
      <PointerField className="group/cta relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          {rays.map((ray, index) => (
            <path
              key={index}
              d={`M${ray.x.toFixed(1)} ${ray.y.toFixed(1)} Q 600 ${index % 2 ? 180 : 420}, 600 300`}
              stroke={index % 3 === 0 ? "#2a4ff6" : "rgb(255 255 255 / 0.12)"}
              className="dash-flow"
              style={{ animationDuration: `${2.4 + (index % 4) * 0.6}s` }}
            />
          ))}
          <circle cx="600" cy="300" r="140" stroke="rgb(255 255 255 / 0.06)" />
          <circle cx="600" cy="300" r="240" stroke="rgb(255 255 255 / 0.05)" />
        </svg>
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(6_9_20/0.35),#060914_78%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/cta:opacity-100"
          style={{
            background:
              "radial-gradient(480px circle at var(--px, 50%) var(--py, 50%), rgb(42 79 246 / 0.18), transparent 65%)",
          }}
        />

        <Container className="relative py-28 text-center md:py-40">
          <Eyebrow className="justify-center text-signal">Start a project</Eyebrow>
          <SplitText
            id="cta-title"
            text="Let's build something that matters."
            className="t-display mx-auto mt-8 max-w-[13ch] text-balance"
          />
          <p
            data-reveal
            style={{ "--d": 250 } as CSSProperties}
            className="t-lede mx-auto mt-8 max-w-md text-fog"
          >
            Have a problem worth solving? Let&apos;s talk. We reply to every brief by email.
          </p>
          <div
            data-reveal
            style={{ "--d": 380 } as CSSProperties}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Magnetic>
              <ButtonLink href="/contact" variant="light">
                Talk to Statin
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="/work" variant="line-dark" arrow={false}>
              Explore our work
            </ButtonLink>
          </div>
        </Container>
      </PointerField>
    </section>
  );
}
