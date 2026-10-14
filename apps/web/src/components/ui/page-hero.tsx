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
  return (
    <header className="tone-dark relative overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0" />
      <Container className="relative grid gap-10 pt-36 pb-20 md:pt-44 md:pb-28 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <Eyebrow className="fade-load text-signal">{eyebrow}</Eyebrow>
          <SplitText as="h1" load text={title} className="t-h1 mt-7 max-w-[16ch] text-balance" />
          <p
            className="fade-load t-lede mt-8 max-w-2xl text-fog"
            style={{ "--d": 350 } as CSSProperties}
          >
            {lede}
          </p>
        </div>
        {aside ? <div className="self-end lg:col-span-3">{aside}</div> : null}
      </Container>
    </header>
  );
}
