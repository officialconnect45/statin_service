import { initials } from "@/lib/initials";

export type TestimonialCardData = {
  name: string;
  description: string;
  quote: string;
  logo: string;
  highlight: boolean;
};

/** Shared by the home page and the admin live preview. */
export function TestimonialCard({ item }: { item: TestimonialCardData }) {
  const name = item.name.trim() || "Business name";

  return (
    <figure
      className={`relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white p-7 md:p-9 ${
        item.highlight ? "border-cobalt/40 shadow-[0_0_0_1px_rgb(91_70_240/0.12)]" : "border-line"
      }`}
    >
      <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-1" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-violet-300/30 blur-3xl"
      />

      <svg aria-hidden="true" viewBox="0 0 32 24" className="relative h-7 w-9">
        <defs>
          <linearGradient id="quote-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#4f46e5" />
            <stop offset="1" stopColor="#c06bf0" />
          </linearGradient>
        </defs>
        <path
          fill="url(#quote-gradient)"
          d="M0 24V13.3C0 5.9 4.1 1.4 11.6 0l1.3 3.3C8.6 4.6 6.5 7 6.2 10.5H12V24H0Zm19 0V13.3C19 5.9 23.1 1.4 30.6 0l1.3 3.3c-4.3 1.3-6.4 3.7-6.7 7.2H31V24H19Z"
        />
      </svg>

      <blockquote className="relative mt-6 flex-1 text-[17px] leading-relaxed break-words text-ink md:text-lg">
        <p>{item.quote.trim() || "The quote appears here."}</p>
      </blockquote>

      <figcaption className="relative mt-8 flex items-center gap-4 border-t border-line pt-6">
        {item.logo ? (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white">
            {/* Logos are admin-provided URLs or uploaded data URLs of any size. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.logo} alt={`${name} logo`} loading="lazy" className="h-full w-full object-contain p-1" />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="bg-brand inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(91_70_240/0.8)]"
          >
            {initials(name)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block font-[family-name:var(--font-display)] font-semibold tracking-tight">{name}</span>
          {item.description ? <span className="block text-sm text-mist">{item.description}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}
