import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a Statin project. Send a brief for a website, SaaS product, or ecommerce store.",
};

const expects = [
  "A reply by email within two business days.",
  "A point of view on the brief, including a no if we are the wrong fit.",
  "A proposed shape, timeline, and who would lead the work.",
  "No deck required. A clear description is enough.",
];

export default function ContactPage() {
  return (
    <section>
      <Container className="grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
            Contact
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.8rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.03em] text-balance">
            Bring the brief.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            Tell us what you are building, who it is for, and what has to be
            true on launch day. We read every note.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block text-sm font-medium underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            {site.email}
          </a>
          <ol className="mt-10 space-y-4">
            {expects.map((item, index) => (
              <li key={item} className="grid grid-cols-[2rem_1fr] gap-2 text-sm leading-relaxed text-mist">
                <span className="font-mono text-xs text-brass">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="md:col-span-7">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
