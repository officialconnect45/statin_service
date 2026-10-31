"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { problemSteps } from "@/lib/content";

/* ------------------------------------------------------------------ */
/* Scene geometry (SVG user units, viewBox 640 × 520)                  */
/* ------------------------------------------------------------------ */

const COLS = [110, 270, 430];
const ROWS = [170, 260, 350];

const nodes = [
  { label: "Storefront", chaos: [86, 92], col: 0, row: 0 },
  { label: "Website", chaos: [470, 446], col: 0, row: 1 },
  { label: "Dashboard", chaos: [300, 64], col: 0, row: 2 },
  { label: "Checkout", chaos: [548, 150], col: 1, row: 0 },
  { label: "Orders API", chaos: [140, 438], col: 1, row: 1 },
  { label: "Webhooks", chaos: [392, 262], col: 1, row: 2 },
  { label: "Catalog", chaos: [80, 280], col: 2, row: 0 },
  { label: "Inventory", chaos: [248, 344], col: 2, row: 1 },
  { label: "Customers", chaos: [560, 330], col: 2, row: 2 },
].map((node) => ({ ...node, order: [COLS[node.col], ROWS[node.row]] as const }));

const chaosLines: [number, number][] = [
  [0, 5],
  [1, 3],
  [2, 7],
  [4, 8],
  [6, 0],
  [3, 4],
  [5, 1],
  [7, 2],
  [8, 6],
  [0, 3],
  [2, 4],
  [1, 6],
  [5, 8],
];

const orderLines: [number, number][] = [
  [0, 3],
  [1, 4],
  [2, 5],
  [0, 4],
  [3, 6],
  [4, 7],
  [5, 8],
  [3, 7],
];

const AI = [270, 468] as const;
const INSIGHT = [586, 260] as const;

const BAND_TITLES = ["Interface", "Services", "Data"];

/**
 * The scene has 7 stages (0 tangled … 6 measured). Each of the 4 copy steps
 * shows one: tangled, connected, automated and secured, measured.
 */
const SCENE_STAGE = [1, 3, 5, 6] as const;

/* ------------------------------------------------------------------ */

export function ProblemStory() {
  const [step, setStep] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStep(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = problemSteps[step];

  return (
    <section aria-labelledby="story-title" className="tone-dark relative bg-night text-white">
      <div className="mx-auto w-full max-w-[1320px] px-5 pt-24 sm:px-8 md:pt-32 lg:px-10">
        <p className="t-eyebrow flex items-center gap-3 text-signal">
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
          The problem we solve
        </p>
        <h2 id="story-title" data-reveal className="t-h2 mt-6 max-w-[17ch] text-balance">
          From scattered systems to one that works.
        </h2>
      </div>

      <div className="mx-auto grid w-full max-w-[1320px] px-5 pb-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-32">
        {/* Visual */}
        <div className="sticky top-16 z-10 -mx-5 bg-night px-5 pt-4 pb-3 sm:-mx-8 sm:px-8 lg:order-2 lg:col-span-7 lg:mx-0 lg:h-[calc(100svh-6rem)] lg:px-0 lg:pt-10 lg:pb-10 lg:top-20 lg:flex lg:items-center">
          <div className="relative w-full overflow-hidden rounded-3xl border border-night-line bg-night-2">
            <div
              aria-hidden="true"
              className="bg-grid absolute inset-0 opacity-70"
              style={{ "--grid-size": "40px" } as CSSProperties}
            />
            <div className="relative flex items-center justify-between border-b border-night-line px-4 py-3 sm:px-5">
              <p className="t-eyebrow text-signal">
                {String(step + 1).padStart(2, "0")} · {current.phase}
              </p>
              <div aria-hidden="true" className="flex gap-1">
                {problemSteps.map((item, index) => (
                  <span
                    key={item.phase}
                    className={`h-1 rounded-full transition-[width,background-color] duration-500 ${
                      index === step ? "w-6 bg-signal" : index < step ? "w-2 bg-signal/50" : "w-2 bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>
            <Scene step={step} />
          </div>
        </div>

        {/* Steps */}
        <ol className="relative lg:order-1 lg:col-span-5">
          {problemSteps.map((item, index) => (
            <li
              key={item.phase}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-step={index}
              className={`flex min-h-[55svh] flex-col justify-center py-10 transition-opacity duration-500 lg:min-h-[78svh] ${
                index === step ? "opacity-100" : "opacity-45"
              }`}
            >
              <p className="font-mono text-[11px] tracking-[0.18em] text-fog uppercase">
                {String(index + 1).padStart(2, "0")} — {item.phase}
              </p>
              <h3 className="t-h3 mt-4 max-w-[20ch] text-balance">{item.title}</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-fog">{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Scene({ step: copyStep }: { step: number }) {
  const step: number = SCENE_STAGE[copyStep] ?? 0;
  const ordered = step >= 3;
  const pos = (index: number) => (ordered ? nodes[index].order : nodes[index].chaos);
  const visible = (on: boolean) => ({ opacity: on ? 1 : 0, transition: "opacity 0.8s var(--ease-out)" });

  return (
    <svg
      viewBox="0 0 640 520"
      role="img"
      aria-label={`Diagram: ${problemSteps[copyStep].title}`}
      className="relative block h-auto max-h-[34svh] w-full lg:max-h-none"
      fill="none"
    >
      <defs>
        <marker id="story-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 8 4 0 8Z" fill="#a5a2ff" />
        </marker>
      </defs>

      {/* Security perimeter */}
      <g style={visible(step >= 5)}>
        <rect
          x="26"
          y="66"
          width="498"
          height="356"
          rx="28"
          stroke="#a5a2ff"
          strokeOpacity="0.55"
          strokeDasharray="6 6"
        />
        <rect x="44" y="54" width="214" height="24" rx="12" fill="#0b0920" stroke="#a5a2ff" strokeOpacity="0.55" />
        <text x="151" y="70" textAnchor="middle" fill="#a5a2ff" fontSize="11" className="font-mono" letterSpacing="1.2">
          AUTH · ROLES · VALIDATION
        </text>
      </g>

      {/* Architecture bands */}
      <g style={visible(step >= 2)}>
        {COLS.map((x, index) => (
          <g key={x}>
            <rect
              x={x - 66}
              y="98"
              width="132"
              height="300"
              rx="16"
              fill="rgb(255 255 255 / 0.025)"
              stroke="rgb(255 255 255 / 0.1)"
            />
            <text
              x={x}
              y="124"
              textAnchor="middle"
              fill="rgb(255 255 255 / 0.5)"
              fontSize="10"
              className="font-mono"
              letterSpacing="1.6"
            >
              {BAND_TITLES[index].toUpperCase()}
            </text>
          </g>
        ))}
      </g>

      {/* Tangled connections */}
      {chaosLines.map(([a, b], index) => {
        const on = !ordered && (step === 1 || (step === 0 && index < 5) || (step === 2 && index < 4));
        const [x1, y1] = nodes[a].chaos;
        const [x2, y2] = nodes[b].chaos;
        return (
          <line
            key={`c-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgb(255 255 255 / 0.3)"
            strokeDasharray={index % 3 === 0 ? "3 5" : undefined}
            style={{ opacity: on ? (step === 2 ? 0.35 : 1) : 0, transition: "opacity 0.6s var(--ease-out)" }}
          />
        );
      })}

      {/* Structured connections */}
      {orderLines.map(([a, b], index) => {
        const [x1, y1] = nodes[a].order;
        const [x2, y2] = nodes[b].order;
        const mid = (x1 + x2) / 2;
        return (
          <path
            key={`o-${index}`}
            d={`M${x1 + 48} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2 - 48} ${y2}`}
            stroke="#a5a2ff"
            strokeOpacity={step >= 6 ? 0.9 : 0.55}
            className="dash-flow"
            style={visible(ordered)}
          />
        );
      })}

      {/* Intelligence */}
      <g style={visible(step >= 4)}>
        {[6, 7, 8].map((index) => {
          const [x, y] = nodes[index].order;
          return (
            <path
              key={`ai-${index}`}
              d={`M${x} ${y + 16} C ${x} ${AI[1] - 40}, ${AI[0] + 40} ${AI[1]}, ${AI[0] + 56} ${AI[1]}`}
              stroke="#5b46f0"
              strokeOpacity="0.8"
              className="dash-flow"
            />
          );
        })}
        {[3, 4].map((index) => {
          const [x, y] = nodes[index].order;
          return (
            <path
              key={`ai-s-${index}`}
              d={`M${x} ${y + 16} L ${x} ${AI[1] - 18}`}
              stroke="#5b46f0"
              strokeOpacity="0.6"
              className="dash-flow"
            />
          );
        })}
        <rect x={AI[0] - 56} y={AI[1] - 18} width="112" height="36" rx="18" fill="#5b46f0" />
        <text x={AI[0]} y={AI[1] + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
          AI · Automation
        </text>
      </g>

      {/* Outcome */}
      <g style={visible(step >= 6)}>
        <path
          d={`M524 ${INSIGHT[1]} L ${INSIGHT[0] - 50} ${INSIGHT[1]}`}
          stroke="#a5a2ff"
          strokeWidth="1.5"
          markerEnd="url(#story-arrow)"
        />
        <rect x={INSIGHT[0] - 48} y={INSIGHT[1] - 34} width="96" height="68" rx="14" fill="#a5a2ff" />
        <text x={INSIGHT[0]} y={INSIGHT[1] - 4} textAnchor="middle" fill="#0b0920" fontSize="12" fontWeight="600">
          Insight
        </text>
        <text x={INSIGHT[0]} y={INSIGHT[1] + 14} textAnchor="middle" fill="#0b0920" fontSize="10" className="font-mono">
          measured
        </text>
      </g>

      {/* Systems */}
      {nodes.map((node, index) => {
        const [x, y] = pos(index);
        return (
          <g
            key={node.label}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              transition: `transform 1.1s var(--ease-out) ${index * 40}ms`,
            }}
          >
            <g className={step === 1 ? "story-jitter" : undefined} style={{ "--j": index } as CSSProperties}>
              <rect
                x="-48"
                y="-16"
                width="96"
                height="32"
                rx="9"
                fill={step >= 6 ? "#1b1747" : "#120f33"}
                stroke={ordered ? "#a5a2ff" : "rgb(255 255 255 / 0.28)"}
                strokeOpacity={ordered ? 0.7 : 1}
                strokeDasharray={step <= 1 && index % 4 === 0 ? "4 4" : undefined}
                style={{ transition: "stroke 0.6s, fill 0.6s" }}
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11.5"
                fill={ordered ? "#ffffff" : "rgb(255 255 255 / 0.7)"}
              >
                {node.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
