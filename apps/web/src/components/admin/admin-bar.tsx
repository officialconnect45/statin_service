import Link from "next/link";
import { ProfileMenu } from "@/components/admin/profile-menu";
import { Logo } from "@/components/ui/logo";

const sections = [
  { id: "leads", label: "Leads", href: "/admin/leads" },
  { id: "testimonials", label: "Testimonials", href: "/admin/testimonials" },
  { id: "outreach", label: "Outreach", href: "/admin/outreach" },
  { id: "emails", label: "Sent mail", href: "/admin/emails" },
] as const;

export function AdminBar({
  username,
  active = "leads",
}: {
  username: string;
  active?: (typeof sections)[number]["id"];
}) {
  return (
    <header className="tone-dark border-b border-night-line bg-night text-white">
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.16em] text-fog uppercase sm:inline">
            Admin
          </span>
          <nav aria-label="Admin sections" className="ml-2 flex items-center gap-1">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                aria-current={section.id === active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  section.id === active ? "bg-white/10 text-white" : "text-fog hover:text-white"
                }`}
              >
                {section.label}
              </Link>
            ))}
          </nav>
        </div>
        <ProfileMenu username={username} />
      </div>
    </header>
  );
}
