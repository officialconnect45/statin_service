import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="tone-dark relative overflow-hidden bg-night text-white">
        <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0" />
        <Container className="relative pt-40 pb-28 md:pt-52 md:pb-40">
          <Eyebrow className="text-signal">404 · Not found</Eyebrow>
          <h1 className="t-h1 mt-7 max-w-[14ch] text-balance">This page is not on the site.</h1>
          <p className="t-lede mt-7 max-w-md text-fog">
            The address may be old. The solutions, the work, and the contact form are still here.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/">Back to the homepage</ButtonLink>
            <ButtonLink href="/contact" variant="line-dark">
              Talk to Statin
            </ButtonLink>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
