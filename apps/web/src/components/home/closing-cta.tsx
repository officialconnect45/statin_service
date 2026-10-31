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
    <section aria-labelledby="cta-title" className="relative bg-paper py-20 md:py-28">
      <Container>
        <PointerField className="group/cta bg-brand tone-dark relative overflow-hidden rounded-[2.5rem] text-white shadow-[0_60px_120px_-50px_rgb(79_70_229/0.7)]">
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
                stroke={index % 3 === 0 ? "rgb(255 255 255 / 0.45)" : "rgb(255 255 255 / 0.14)"}
                className="dash-flow"
                style={{ animationDuration: `${2.4 + (index % 4) * 0.6}s` }}
              />
            ))}
            <circle cx="600" cy="300" r="140" stroke="rgb(255 255 255 / 0.14)" />
            <circle cx="600" cy="300" r="240" stroke="rgb(255 255 255 / 0.09)" />
          </svg>
          <div aria-hidden="true" className="aurora">
            <span
              className="orb -top-24 -left-16 h-80 w-80 bg-sky-300"
              style={{ "--o": 0.35, "--dx": "60px", "--dy": "40px" } as CSSProperties}
            />
            <span
              className="orb -right-20 -bottom-24 h-96 w-96 bg-fuchsia-400"
              style={{ "--o": 0.45, "--dx": "-50px", "--dy": "-40px", "--delay": "-6s" } as CSSProperties}
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/cta:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--px, 50%) var(--py, 50%), rgb(255 255 255 / 0.16), transparent 65%)",
            }}
          />

          <div className="relative px-6 py-20 text-center md:px-12 md:py-28">
            <Eyebrow className="mx-auto text-white">Start a project</Eyebrow>
            <SplitText
              id="cta-title"
              text="Let's build something that matters."
              className="t-display mx-auto mt-8 max-w-[13ch] text-balance"
            />
            <p
              data-reveal
              style={{ "--d": 250 } as CSSProperties}
              className="t-lede mx-auto mt-8 max-w-md text-white/80"
            >
              Have a problem worth solving? Let&apos;s talk. We reply to every brief by email.
            </p>
            <div
              data-reveal
              style={{ "--d": 380 } as CSSProperties}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Magnetic>
                <ButtonLink href="/contact" variant="light" className="h-13 px-7">
                  Talk to Statin
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="/work" variant="line-dark" arrow={false} className="h-13 px-7">
                Explore our work
              </ButtonLink>
            </div>
          </div>
        </PointerField>
      </Container>
    </section>
  );
}
