import Link from "next/link";
import type { ReactNode } from "react";
import { ProfileMenu } from "@/components/admin/profile-menu";
import { Logo } from "@/components/ui/logo";

const sections = [
  {
    id: "leads",
    label: "Leads",
    href: "/admin/leads",
    icon: <path d="M2.5 13.5c0-2.2 2.5-3.5 5.5-3.5s5.5 1.3 5.5 3.5M8 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2v-7Z" />,
  },
  {
    id: "outreach",
    label: "Outreach",
    href: "/admin/outreach",
    icon: <path d="M13.5 2.5 7 9M13.5 2.5l-4 11-2.5-4.5-4.5-2.5 11-4Z" />,
  },
  {
    id: "templates",
    label: "Templates",
    href: "/admin/mail-templates",
    icon: <path d="M3.5 2.5h9v11h-9v-11ZM5.5 5.5h5M5.5 8h5M5.5 10.5h3" />,
  },
  {
    id: "emails",
    label: "Sent mail",
    href: "/admin/emails",
    icon: <path d="M2.5 4h11v8h-11V4ZM2.5 4.5 8 8.5l5.5-4" />,
  },
  {
    id: "audit",
    label: "Audit",
    href: "/admin/audit",
    icon: <path d="M8 2 3 4v4c0 3 2.2 5.2 5 6 2.8-.8 5-3 5-6V4L8 2ZM5.75 8l1.6 1.6L10.5 6.5" />,
  },
] as const;

export type AdminSection = (typeof sections)[number]["id"];

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function AdminBadge() {
  return (
    <span className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.16em] text-fog uppercase">
      Admin
    </span>
  );
}

/**
 * Admin navigation: a fixed sidebar from `lg` up, a top bar with a scrolling
 * section row below that. The admin layout pads `main` for the sidebar
 * whenever a page renders one (see `data-admin-sidebar`).
 *
 * Without `username` (loading states) the profile menu is a placeholder.
 */
export function AdminBar({ username, active }: { username?: string; active?: AdminSection }) {
  const links = (layout: "column" | "row") =>
    sections.map((section) => {
      const current = section.id === active;
      return (
        <Link
          key={section.id}
          href={section.href}
          aria-current={current ? "page" : undefined}
          className={
            layout === "column"
              ? `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  current ? "bg-white/10 text-white" : "text-fog hover:bg-white/5 hover:text-white"
                }`
              : `shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  current ? "bg-white/10 text-white" : "text-fog hover:text-white"
                }`
          }
        >
          {layout === "column" ? <Icon>{section.icon}</Icon> : null}
          {section.label}
        </Link>
      );
    });

  const profile = username ? (
    <ProfileMenu username={username} />
  ) : (
    <div aria-hidden="true" className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
  );

  return (
    <>
      <aside
        data-admin-sidebar
        className="tone-dark fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-night-line bg-night text-white lg:flex"
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-night-line px-5">
          <Logo />
          <AdminBadge />
        </div>
        <nav aria-label="Admin sections" className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {links("column")}
        </nav>
        <div className="shrink-0 border-t border-night-line p-3">
          {username ? <ProfileMenu username={username} placement="up" /> : profile}
        </div>
      </aside>

      <header className="tone-dark sticky top-0 z-40 border-b border-night-line bg-night text-white lg:hidden">
        <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden sm:inline">
              <AdminBadge />
            </span>
          </div>
          {profile}
        </div>
        <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto px-4 pb-3 sm:px-7">
          {links("row")}
        </nav>
      </header>
    </>
  );
}
