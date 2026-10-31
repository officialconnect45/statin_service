import type { CSSProperties, ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "p";

/**
 * Splits text into words that rise individually. Words stay real text,
 * so screen readers and search engines read the heading normally.
 * `load` animates on first paint; otherwise RevealObserver triggers it.
 */
export function SplitText({
  text,
  as: Tag = "h2",
  className = "",
  load = false,
  delay = 0,
  id,
  accentFrom,
  accentClass = "text-gradient",
}: {
  text: string;
  as?: HeadingTag;
  className?: string;
  load?: boolean;
  delay?: number;
  id?: string;
  /** Word index from which words take `accentClass`. */
  accentFrom?: number;
  accentClass?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag
      id={id}
      className={`${load ? "split-load" : ""} ${className}`}
      data-reveal={load ? undefined : "split"}
      style={{ "--d": delay } as CSSProperties}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="split-word">
            <span
              style={{ "--i": index } as CSSProperties}
              className={accentFrom !== undefined && index >= accentFrom ? accentClass : undefined}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({
  children,
  className = "text-cobalt",
  index,
}: {
  children: ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <p
      className={`t-eyebrow inline-flex w-fit items-center gap-2.5 rounded-full border border-current/20 bg-current/[0.06] px-3.5 py-1.5 ${className}`}
    >
      <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
        <span className="ping-soft absolute inset-0 rounded-full bg-current" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {index ? <span className="opacity-60">{index}</span> : null}
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  lede,
  tone = "light",
  id,
  className = "",
}: {
  eyebrow: string;
  index?: string;
  title: string;
  lede?: string;
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={className}>
      <Eyebrow index={index} className={dark ? "text-signal" : "text-cobalt"}>
        {eyebrow}
      </Eyebrow>
      <SplitText
        id={id}
        text={title}
        className={`t-h2 mt-6 max-w-[18ch] text-balance ${dark ? "text-white" : "text-ink"}`}
      />
      {lede ? (
        <p
          data-reveal
          style={{ "--d": 150 } as CSSProperties}
          className={`t-lede mt-6 max-w-xl ${dark ? "text-fog" : "text-ink-soft"}`}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
