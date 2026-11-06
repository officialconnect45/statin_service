import { ClosingCta } from "@/components/home/closing-cta";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PatternCard } from "@/components/work/pattern-card";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { patterns, products } from "@/lib/content";
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
      <section aria-label="Our products" className="border-b border-line bg-white pt-20 pb-16 md:pt-28 md:pb-20">
        <Container>
          <p className="t-eyebrow text-cobalt">Our products</p>
          <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance">
            Built and run by Statin.
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {products.map((product) => (
              <li key={product.url}>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-3xl border border-line p-7 transition-colors hover:border-cobalt"
                >
                  <span className="font-mono text-[11px] tracking-[0.12em] text-mist uppercase">
                    {product.host}
                  </span>
                  <span className="mt-4 text-xl font-medium tracking-[-0.02em] text-ink">
                    {product.name}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {product.description}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink group-hover:text-cobalt">
                    Visit {product.host}
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>
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
