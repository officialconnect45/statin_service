import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-24 md:py-36">
      <p className="font-mono text-[11px] tracking-[0.22em] text-brass uppercase">
        404
      </p>
      <h1 className="mt-4 max-w-xl font-serif text-5xl tracking-tight text-balance md:text-6xl">
        This page is not on the site.
      </h1>
      <p className="mt-5 max-w-md text-ink-soft">
        The address may be old. The work, the practices, and the brief are
        still here.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Back to the index</ButtonLink>
        <ButtonLink href="/contact" variant="line">
          Start a project
        </ButtonLink>
      </div>
    </Container>
  );
}
