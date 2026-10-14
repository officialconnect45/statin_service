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
  accentClass = "text-signal",
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
    <p className={`t-eyebrow flex items-center gap-3 ${className}`}>
      {index ? <span className="opacity-60">{index}</span> : null}
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
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
