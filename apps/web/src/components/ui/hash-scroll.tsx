"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const USER_SCROLL = ["wheel", "touchstart", "keydown"] as const;

/**
 * The element with this id that is actually rendered. The router can keep
 * hidden copies of other routes in the DOM with the same ids.
 */
function visibleById(id: string) {
  return [...document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`)].find(
    (el) => el.getClientRects().length > 0,
  );
}

/**
 * Makes every page open at its top, or at its section for links like
 * `/#testimonials` and `/work#saas-platform`.
 *
 * Section links are handled here for the whole site. On the same page they
 * scroll straight to the section. To another page they navigate to the bare
 * path first and add the hash once it has rendered: letting the router
 * navigate to a URL with a hash leaves the shared layout (the header's active
 * item) stuck on the previous page.
 */
export function HashScroll() {
  const pathname = usePathname();
  const router = useRouter();
  const pendingHash = useRef<string | null>(null);
  const fromHistory = useRef(false);

  // Don't let the browser put back an old scroll position on reload or
  // back/forward.
  useEffect(() => {
    history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });

    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Capture phase, so this runs before next/link, which then skips its own
  // navigation because the event is already handled.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin || !url.hash) return;

      if (url.pathname === window.location.pathname) {
        const target = visibleById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(window.history.state, "", url.hash);
        return;
      }

      event.preventDefault();
      pendingHash.current = url.hash;
      router.push(url.pathname + url.search);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  // After a navigation, scroll to its section, waiting for the target to
  // appear: sections that stream in later (testimonials) aren't rendered yet.
  useEffect(() => {
    const hash = pendingHash.current ?? window.location.hash;
    pendingHash.current = null;
    const id = decodeURIComponent(hash.slice(1));
    // Back/forward doesn't scroll by itself once restoration is manual.
    if (fromHistory.current && !id) window.scrollTo({ top: 0, behavior: "instant" });
    fromHistory.current = false;
    if (!id) return;
    if (window.location.hash !== hash) window.history.replaceState(window.history.state, "", hash);

    let tries = 0;
    const stop = () => {
      window.clearInterval(timer);
      for (const type of USER_SCROLL) window.removeEventListener(type, stop);
    };
    const timer = window.setInterval(() => {
      const target = visibleById(id);
      if (target) {
        stop();
        // A fresh page: land on the section rather than animating down to it.
        target.scrollIntoView({ behavior: "instant", block: "start" });
      } else if (++tries > 100) {
        stop();
      }
    }, 100);
    // If the visitor starts scrolling themselves, don't jump later.
    for (const type of USER_SCROLL) window.addEventListener(type, stop, { passive: true, once: true });
    return stop;
  }, [pathname]);

  return null;
}
