import type { CSSProperties } from "react";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/ui/social-links";
import { Eyebrow, SplitText } from "@/components/ui/typography";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Talk to Statin. Send a brief for a web app, commerce system, integration, business website, or white-label agency delivery.",
  path: "/contact",
});

const expects = [
  "A reply by email within two business days.",
  "A point of view on the brief, including a no if we are the wrong fit.",
  "A proposed scope, the next step, and who would lead the work.",
  "No deck required. A clear description is enough.",
];

export default function ContactPage() {
  return (
    <section aria-labelledby="contact-title" className="tone-dark relative overflow-hidden bg-night text-white">
      <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0" />
      <Container className="relative grid gap-14 pt-36 pb-24 md:pt-44 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow className="fade-load text-signal">Contact</Eyebrow>
          <SplitText
            as="h1"
            id="contact-title"
            load
            text="Let's talk about the problem."
            className="t-h1 mt-7 max-w-[11ch] text-balance"
          />
          <p
            className="fade-load t-lede mt-7 text-fog"
            style={{ "--d": 350 } as CSSProperties}
          >
            Tell us what you are building, who it is for, and what has to be true on launch day.
            We read every note.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="fade-load link-line mt-8 inline-block text-lg text-white"
            style={{ "--d": 450 } as CSSProperties}
          >
            {site.email}
          </a>
          <address className="fade-load mt-3 text-sm not-italic text-fog" style={{ "--d": 450 } as CSSProperties}>
            {site.address.street}, {site.address.city}, {site.address.country}
          </address>
          <ol className="mt-12 space-y-4 border-t border-night-line pt-8">
            {expects.map((item, index) => (
              <li key={item} className="grid grid-cols-[2rem_1fr] gap-2 text-sm leading-relaxed text-fog">
                <span className="font-mono text-xs text-signal">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex items-center gap-4">
            <p className="t-eyebrow text-fog">Follow</p>
            <SocialLinks className="text-white" />
          </div>
        </div>
        <div className="fade-load lg:col-span-7" style={{ "--d": 300 } as CSSProperties}>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
