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
      className={`flex h-full flex-col rounded-3xl border bg-white p-7 md:p-8 ${
        item.highlight ? "border-cobalt/40 shadow-[0_0_0_1px_rgb(91_70_240/0.12)]" : "border-line"
      }`}
    >
      <figcaption className="flex items-center gap-4">
        {item.logo ? (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white">
            {/* Logos are admin-provided URLs or uploaded data URLs of any size. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.logo} alt={`${name} logo`} loading="lazy" className="h-full w-full object-contain p-1" />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cobalt/10 text-sm font-semibold text-cobalt"
          >
            {initials(name)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block font-medium tracking-tight">{name}</span>
          {item.description ? <span className="block text-sm text-mist">{item.description}</span> : null}
        </span>
      </figcaption>
      <blockquote className="mt-6 text-[15px] leading-relaxed break-words text-ink-soft">
        <p>&ldquo;{item.quote.trim() || "The quote appears here."}&rdquo;</p>
      </blockquote>
    </figure>
  );
}
