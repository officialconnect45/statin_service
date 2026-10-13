"use client";

import { useEffect } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * One IntersectionObserver for the whole site. Elements with `data-reveal`
 * start hidden (see globals.css) and are animated in with the Web Animations
 * API when they scroll into view. Nothing React renders is mutated, so this
 * cannot cause hydration mismatches even if it runs before a segment hydrates.
 * `data-reveal="split"` animates each word of a SplitText heading instead.
 */
export function RevealObserver() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = (el: HTMLElement) => {
      const delay = Number.parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;

      if (el.dataset.reveal === "split") {
        el.querySelectorAll<HTMLElement>(".split-word > span").forEach((word, index) => {
          word.animate([{ transform: "translate3d(0, 108%, 0)" }, { transform: "none" }], {
            duration: reduced ? 0 : 950,
            delay: reduced ? 0 : delay + index * 42,
            easing: EASE,
            fill: "both",
          });
        });
        return;
      }

      el.animate(
        [
          { opacity: 0, transform: reduced ? "none" : "translate3d(0, 18px, 0)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: reduced ? 400 : 850,
          delay: reduced ? 0 : delay,
          easing: reduced ? "linear" : EASE,
          fill: "both",
        },
      );
    };

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  io?.unobserve(entry.target);
                  reveal(entry.target as HTMLElement);
                }
              }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0 },
          )
        : null;

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (io) io.observe(el);
        else reveal(el);
      });
    };
    scan();

    // Client-side navigations add new sections; observe them as they mount.
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io?.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
