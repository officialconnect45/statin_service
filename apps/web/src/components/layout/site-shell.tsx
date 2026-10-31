import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CursorLabel } from "@/components/ui/cursor-label";
import { HashScroll } from "@/components/ui/hash-scroll";
import { RevealObserver } from "@/components/ui/reveal-observer";

/** Public site chrome: header, footer, and the global interaction layers. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div aria-hidden="true" className="scroll-progress bg-brand" />
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <RevealObserver />
      <CursorLabel />
      <Suspense fallback={null}>
        <HashScroll />
      </Suspense>
    </>
  );
}
