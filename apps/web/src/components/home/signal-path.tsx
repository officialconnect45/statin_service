"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { sampleRequests, signalPath } from "@/lib/content";

const STEP_MS = 2200;

/**
 * Signature visual: one request travelling through the layers Statin
 * engineers. Auto-advances while visible; hovering, focusing, or tapping a
 * layer takes control. Static under reduced motion.
 */
export function SignalPath() {
  // One monotonic tick drives both the active layer and the sample request.
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);

    const el = rootRef.current;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (el) io.observe(el);
    return () => {
      query.removeEventListener("change", update);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (paused || reduced || !visible) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setTick((t) => t + 1);
    }, STEP_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduced, visible]);

  const total = signalPath.length;
  const active = tick % total;
  const request = Math.floor(tick / total) % sampleRequests.length;
  const setActive = (index: number) => setTick((t) => t - (t % total) + index);
  const progress = (active / (total - 1)) * 100;
  const current = signalPath[active];

  return (
    <div
      ref={rootRef}
      onPointerEnter={(event) => event.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative overflow-hidden rounded-3xl border border-night-line bg-night-2"
      style={{
        transform:
          "perspective(1600px) rotateX(calc(var(--my, 0) * -1.2deg)) rotateY(calc(var(--mx, 0) * 1.2deg))",
        transition: "transform 0.8s var(--ease-out)",
      }}
    >
      {/* Header bar */}
      <div className="flex items-center gap-4 border-b border-night-line px-5 py-3.5 sm:px-6">
        <p className="t-eyebrow hidden text-fog sm:block">Signal path</p>
        <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-night-line bg-night px-3.5 py-1.5 font-mono text-[11px] text-white/80 sm:ml-auto sm:max-w-xs sm:flex-none">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="ping-soft absolute inset-0 rounded-full bg-signal" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          <span key={request} className="fade-load truncate">
            {sampleRequests[request]}
          </span>
        </div>
        <p className="hidden font-mono text-[11px] text-fog md:block">
          {String(active + 1).padStart(2, "0")} / {String(signalPath.length).padStart(2, "0")}
        </p>
      </div>

      {/* Layers */}
      <div className="relative px-3 py-4 sm:px-5 lg:px-6 lg:py-8">
        <ol className="relative grid gap-1 lg:grid-cols-7 lg:gap-2">
          {/* Bus line: vertical on small screens, horizontal on large */}
          <span
            aria-hidden="true"
            className="absolute top-5 bottom-5 left-[22px] w-px overflow-hidden bg-white/10 lg:top-[22px] lg:right-[calc((100%_-_48px)/7_-_22px)] lg:bottom-auto lg:left-[22px] lg:h-px lg:w-auto"
          >
            <span
              className="absolute inset-x-0 top-0 bg-gradient-to-b from-cobalt to-signal transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden"
              style={{ height: `${progress}%` }}
            />
            <span
              className="absolute inset-y-0 left-0 hidden bg-gradient-to-r from-cobalt to-signal transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block"
              style={{ width: `${progress}%` }}
            />
            <span className="motion-only comet-x absolute inset-y-0 left-0 hidden w-1/5 bg-gradient-to-r from-transparent via-white to-transparent lg:block" />
            <span
              className="motion-only comet-x absolute inset-y-0 left-0 hidden w-1/5 bg-gradient-to-r from-transparent via-signal to-transparent lg:block"
              style={{ "--delay": "1.6s" } as CSSProperties}
            />
            <span className="motion-only comet-y absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-transparent via-white to-transparent lg:hidden" />
          </span>

          {signalPath.map((stage, index) => {
            const isActive = index === active;
            const passed = index < active;
            return (
              <li key={stage.id} className="relative">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="signal-detail"
                  onClick={() => setActive(index)}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
                  onFocus={() => setActive(index)}
                  className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition-[background-color,border-color] duration-500 lg:h-full lg:flex-col lg:items-start lg:gap-0 lg:p-4 ${
                    isActive
                      ? "border-signal/40 bg-white/[0.05]"
                      : "border-transparent hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
                    {isActive ? (
                      <span className="ping-soft absolute inset-0 rounded-full bg-signal" />
                    ) : null}
                    <span
                      className={`relative h-3 w-3 rounded-full border transition-colors duration-500 ${
                        isActive
                          ? "border-signal bg-signal"
                          : passed
                            ? "border-signal/60 bg-signal/40"
                            : "border-white/30 bg-night-2"
                      }`}
                    />
                  </span>
                  <span className="font-mono text-[10px] text-fog lg:mt-5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[15px] font-medium tracking-tight transition-colors duration-500 lg:mt-1.5 lg:text-base ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="ml-auto min-w-0 truncate font-mono text-[10px] text-fog lg:mt-2 lg:ml-0 lg:w-full lg:whitespace-normal">
                    {stage.tag}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Security spans every layer */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-white/15 px-4 py-3 lg:mt-5">
          <ShieldIcon />
          <p className="text-xs leading-relaxed text-fog sm:text-[13px]">
            <span className="font-medium text-white">Security across every layer</span>
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">authentication, roles, validated inputs, trusted payment providers</span>
          </p>
        </div>
      </div>

      {/* Detail */}
      <div
        id="signal-detail"
        className="grid gap-2 border-t border-night-line px-5 py-5 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-8"
      >
        <p className="t-eyebrow text-signal lg:col-span-3">
          {String(active + 1).padStart(2, "0")} · {current.label}
        </p>
        <p key={current.id} className="fade-load text-sm leading-relaxed text-white/85 sm:text-[15px] lg:col-span-9">
          {current.detail}
        </p>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 text-signal">
      <path
        d="M10 2.5 4 4.8v4.6c0 3.7 2.5 6.6 6 8.1 3.5-1.5 6-4.4 6-8.1V4.8l-6-2.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="m7.3 10 1.9 1.9 3.6-3.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
