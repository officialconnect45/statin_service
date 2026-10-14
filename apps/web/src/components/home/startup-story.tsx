import Link from "next/link";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { Eyebrow, SplitText } from "@/components/ui/typography";
import { principles, story } from "@/lib/content";

export function StartupStory() {
  return (
    <section aria-labelledby="about-title" className="bg-white py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow>About Statin</Eyebrow>
            <SplitText
              id="about-title"
              text="We're early. We're focused. We build software that has to work."
              accentFrom={4}
              accentClass="text-cobalt"
              className="t-h2 mt-6 max-w-[15ch] text-balance"
            />
            <Link
              href="/about"
              className="group mt-10 inline-flex items-center gap-3 text-sm font-medium"
            >
              <span className="link-line">More about Statin</span>
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <dl className="space-y-10 lg:col-span-5 lg:col-start-8">
            {story.map((item, index) => (
              <div
                key={item.label}
                data-reveal
                style={{ "--d": index * 100 } as CSSProperties}
                className="border-t border-line pt-6"
              >
                <dt className="t-eyebrow text-mist">{item.label}</dt>
                <dd className="mt-4 text-lg leading-relaxed text-ink-soft">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-24">
          <p className="t-eyebrow text-mist">What we believe</p>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, index) => (
              <li
                key={item.index}
                data-reveal
                style={{ "--d": index * 80 } as CSSProperties}
                className="bg-white p-7"
              >
                <p className="font-mono text-xs text-cobalt">{item.index}</p>
                <h3 className="mt-8 text-lg font-medium tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
