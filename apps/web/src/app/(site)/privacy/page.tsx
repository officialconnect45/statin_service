import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy & cookies",
  description: "How Statin handles the details you send with a project brief, and which cookies this site uses.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="What we do with a brief."
        lede="The contact form exists so we can reply. It is not a list, and it is not shared."
      />
      <section className="bg-paper">
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl space-y-14 text-base leading-relaxed text-ink-soft">
            <div className="space-y-5">
              <h2 className="text-2xl font-medium tracking-tight text-ink">Information you send</h2>
              <p>
                If you write to {site.email} or use the contact form, we keep your name, email,
                company, and the description of the work so we can respond. Optional fields cover
                stage and timing.
              </p>
              <p>
                We do not sell this information, and we do not add you to a mailing list because
                you asked about a project. Messages are stored for our own follow-up.
              </p>
              <p>
                To ask for a copy or for deletion, email{" "}
                <a className="text-ink underline underline-offset-4" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </p>
            </div>

            <div id="cookies" className="scroll-mt-28 space-y-5">
              <h2 className="text-2xl font-medium tracking-tight text-ink">Cookies</h2>
              <p>
                This site does not use advertising or analytics cookies, and it does not run
                third-party tracking scripts.
              </p>
              <p>
                Links to LinkedIn, X, and Instagram open those services in a new tab. Their own
                privacy and cookie policies apply once you are there.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
