import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Statin handles the details you send with a project brief.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="What we do with a brief."
        lede="The contact form exists so we can reply. It is not a list, and it is not shared."
      />
      <section>
        <Container className="py-16 md:py-20">
          <div className="max-w-3xl space-y-8 text-sm leading-relaxed text-ink-soft">
            <p>
              If you write to {site.email} or use the form, we keep your name,
              email, company, and the description of the work so the studio can
              respond. Optional fields cover stage and timing.
            </p>
            <p>
              We do not sell this information, and we do not add you to a
              mailing list because you asked about a project. Messages are
              stored for the studio’s own follow-up.
            </p>
            <p>
              To ask for a copy or for deletion, email{" "}
              <a className="text-ink underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
