import { ClosingCta } from "@/components/home/closing-cta";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PatternCard } from "@/components/work/pattern-card";
import { patterns } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "The builds Statin delivers: SaaS platforms, commerce systems, integration and automation layers, business websites, and white-label agency delivery.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Patterns, not borrowed logos."
        lede="We do not publish client names or numbers we cannot stand behind. These are the builds we are set up to deliver: the situation, what we make, and what your team receives."
      />
      <nav aria-label="Build patterns" className="sticky top-16 z-30 border-b border-line bg-white/90 backdrop-blur-md">
        <Container>
          <ul className="flex gap-6 overflow-x-auto py-4 text-sm whitespace-nowrap">
            {patterns.map((pattern) => (
              <li key={pattern.slug}>
                <a href={`#${pattern.slug}`} className="text-mist transition-colors hover:text-ink">
                  <span className="mr-2 font-mono text-[11px] text-cobalt">{pattern.index}</span>
                  {pattern.eyebrow}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
      <section aria-label="Build patterns" className="bg-white py-20 md:py-28">
        <Container className="space-y-28 md:space-y-36">
          {patterns.map((pattern, index) => (
            <PatternCard
              key={pattern.slug}
              pattern={pattern}
              flip={index % 2 === 1}
              detailed
              headingLevel="h2"
            />
          ))}
        </Container>
      </section>
      <ClosingCta />
    </>
  );
}
