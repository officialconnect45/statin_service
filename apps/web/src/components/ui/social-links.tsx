import { SocialIcon } from "@/components/ui/icons";
import { social } from "@/lib/site";

/** Compact icon row for the footer, contact page, and mobile navigation. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {social.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Statin on ${item.label} (opens in a new tab)`}
            data-cursor="Open"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-[background-color,color,border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-cobalt hover:bg-cobalt hover:text-white"
          >
            <SocialIcon id={item.id} className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
