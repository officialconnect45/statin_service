import { Container } from "@/components/container";

export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="border-b border-line">
      <Container className="py-16 md:py-24">
        <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase font-semibold">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.7rem,6vw,5.2rem)] leading-[0.95] tracking-[-0.03em] text-balance">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {lede}
        </p>
      </Container>
    </header>
  );
}
