"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
 * Click handler for in-page section links like `/#testimonials`. On the target
 * page it scrolls straight to the section; elsewhere it lets the link
 * navigate and HashScroll finishes the job.
 */
export function scrollToSectionOnPage(event: React.MouseEvent<HTMLAnchorElement>, pathname: string) {
  const url = new URL(event.currentTarget.href);
  if (url.pathname !== pathname || !url.hash) return;
  const target = visibleById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(window.history.state, "", url.hash);
}

/**
 * Scrolls to the URL hash after a navigation, waiting for the target to
 * appear. Sections that stream in later (testimonials) aren't rendered when
 * the router's own hash scroll runs, so `/#testimonials` from another page
 * would otherwise land at the top.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let tries = 0;
    const stop = () => {
      window.clearInterval(timer);
      for (const type of USER_SCROLL) window.removeEventListener(type, stop);
    };
    const timer = window.setInterval(() => {
      const target = visibleById(id);
      if (target) {
        stop();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
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
