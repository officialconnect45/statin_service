import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Eyebrow, SplitText } from "@/components/ui/typography";

export function PageHero({
  eyebrow,
  title,
  lede,
  aside,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  aside?: ReactNode;
}) {
  // The last word takes the brand gradient.
  const accentFrom = Math.max(0, title.split(" ").length - 1);

  return (
    <header className="relative overflow-hidden">
      <div aria-hidden="true" className="aurora">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f3f1ff_70%,#f6f6ff_100%)]" />
        <span
          className="orb -top-40 -left-24 h-[440px] w-[440px] bg-indigo-400"
          style={{ "--o": 0.3, "--dx": "70px", "--dy": "50px", "--dur": "18s" } as CSSProperties}
        />
        <span
          className="orb -top-20 right-[-8%] h-[400px] w-[400px] bg-violet-400"
          style={{ "--o": 0.3, "--dx": "-60px", "--dy": "40px", "--dur": "15s", "--delay": "-5s" } as CSSProperties}
        />
        <span
          className="orb bottom-[-30%] left-[40%] h-[300px] w-[480px] bg-fuchsia-300"
          style={{ "--o": 0.22, "--dx": "40px", "--dy": "-30px", "--dur": "20s", "--delay": "-9s" } as CSSProperties}
        />
        <div className="bg-grid bg-grid-light mask-radial absolute inset-0" />
      </div>

      <Container className="relative grid gap-10 pt-40 pb-20 md:pt-48 md:pb-28 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <Eyebrow className="fade-load bg-white/70 text-cobalt shadow-[0_8px_24px_-12px_rgb(91_70_240/0.45)] backdrop-blur">
            {eyebrow}
          </Eyebrow>
          <SplitText
            as="h1"
            load
            text={title}
            accentFrom={accentFrom}
            className="t-h1 mt-7 max-w-[16ch] text-balance text-ink"
          />
          <p className="fade-load t-lede mt-8 max-w-2xl text-ink-soft" style={{ "--d": 350 } as CSSProperties}>
            {lede}
          </p>
        </div>
        {aside ? <div className="self-end lg:col-span-3">{aside}</div> : null}
      </Container>
    </header>
  );
}
