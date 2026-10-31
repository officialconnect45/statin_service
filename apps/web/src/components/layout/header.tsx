"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonClass } from "@/components/ui/button-link";
import { ArrowIcon, ChevronIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { services } from "@/lib/services";
import { companyNav } from "@/lib/site";

type Menu = "solutions" | "company" | null;

export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<Menu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const closeTimer = useRef<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  // Close everything after a navigation.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const trigger = document.getElementById(`nav-trigger-${menu}`);
        setMenu(null);
        trigger?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menu]);

  const openMenu = useCallback((next: Menu) => {
    window.clearTimeout(closeTimer.current);
    setMenu(next);
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 160);
  }, []);

  const closeAll = useCallback(() => {
    setMenu(null);
    setMobileOpen(false);
  }, []);

  const raised = scrolled || menu !== null;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5" onPointerLeave={scheduleClose}>
      {/* The pill carries the blur. The fullscreen mobile nav is its sibling, so the blur can't trap it. */}
      <div
        className={`relative z-[60] mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between rounded-full border pr-2 pl-5 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-6 ${
          mobileOpen
            ? "border-transparent bg-transparent shadow-none"
            : raised
              ? "glass"
              : "border-white/70 bg-white/55 shadow-[0_10px_40px_-24px_rgb(79_70_229/0.35)] backdrop-blur-md"
        }`}
      >
        <Logo tone={mobileOpen ? "dark" : "light"} onNavigate={closeAll} />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <MenuTrigger
            id="solutions"
            label="Solutions"
            open={menu === "solutions"}
            active={isActive("/services")}
            onOpen={openMenu}
            onToggle={() => setMenu(menu === "solutions" ? null : "solutions")}
          />
          <SolutionsPanel
            open={menu === "solutions"}
            onNavigate={closeAll}
            onPointerEnter={() => window.clearTimeout(closeTimer.current)}
          />
          <NavLink href="/work" active={isActive("/work")} onPointerEnter={() => openMenu(null)}>
            Work
          </NavLink>
          <MenuTrigger
            id="company"
            label="Company"
            open={menu === "company"}
            active={isActive("/about") || isActive("/approach")}
            onOpen={openMenu}
            onToggle={() => setMenu(menu === "company" ? null : "company")}
          />
          <CompanyPanel
            open={menu === "company"}
            onNavigate={closeAll}
            onPointerEnter={() => window.clearTimeout(closeTimer.current)}
          />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className={buttonClass("solid", "h-11 px-5")}>
            Let&apos;s talk
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors lg:hidden ${
            mobileOpen ? "border-white/20 text-white" : "border-ink/10 bg-white text-ink shadow-sm"
          }`}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <span className="relative block h-3 w-4" aria-hidden="true">
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${
                mobileOpen ? "top-1.5 rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${
                mobileOpen ? "top-1.5 -rotate-45" : "top-2.5"
              }`}
            />
          </span>
        </button>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
  onPointerEnter,
}: {
  href: string;
  active: boolean;
  children: string;
  onPointerEnter?: () => void;
}) {
  return (
    <Link
      href={href}
      onPointerEnter={onPointerEnter}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? "bg-cobalt/10 text-cobalt" : "text-ink-soft hover:bg-paper-deep hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

function MenuTrigger({
  id,
  label,
  open,
  active,
  onOpen,
  onToggle,
}: {
  id: Exclude<Menu, null>;
  label: string;
  open: boolean;
  active: boolean;
  onOpen: (menu: Menu) => void;
  onToggle: () => void;
}) {
  return (
    <button
      id={`nav-trigger-${id}`}
      type="button"
      aria-expanded={open}
      aria-controls={`nav-panel-${id}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onOpen(id);
      }}
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        open || active ? "bg-cobalt/10 text-cobalt" : "text-ink-soft hover:bg-paper-deep hover:text-ink"
      }`}
    >
      {label}
      <ChevronIcon className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

type PanelProps = {
  open: boolean;
  onNavigate: () => void;
  onPointerEnter: () => void;
};

/**
 * Rendered directly after its trigger so keyboard focus moves into the menu.
 * Positioned against the pill, so the panel matches its width just below it.
 */
function Panel({
  id,
  open,
  onPointerEnter,
  children,
}: {
  id: string;
  open: boolean;
  onPointerEnter: () => void;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      inert={!open}
      onPointerEnter={onPointerEnter}
      className={`absolute inset-x-0 top-[calc(100%+10px)] overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_40px_90px_-30px_rgb(46_35_140/0.35)] transition-[opacity,translate] duration-300 ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="w-full p-8">{children}</div>
    </div>
  );
}

function SolutionsPanel({ open, onNavigate, onPointerEnter }: PanelProps) {
  return (
    <Panel id="nav-panel-solutions" open={open} onPointerEnter={onPointerEnter}>
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <p className="t-eyebrow text-mist">What we build</p>
          <ul className="mt-5 grid grid-cols-2 gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  onClick={onNavigate}
                  className="group flex gap-4 rounded-2xl p-4 transition-colors hover:bg-paper"
                >
                  <span className="bg-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgb(91_70_240/0.7)]">
                    {service.index}
                  </span>
                  <span>
                    <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                      {service.title}
                      <ArrowIcon className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-mist">{service.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-4">
          <Link
            href="/approach"
            onClick={onNavigate}
            className="bg-brand group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 text-white"
          >
            <span aria-hidden="true" className="bg-grid absolute inset-0 opacity-50" />
            <span
              aria-hidden="true"
              className="orb -top-10 -right-10 h-40 w-40 bg-fuchsia-300"
              style={{ "--o": 0.5 } as CSSProperties}
            />
            <span className="relative t-eyebrow text-white/80">How we work</span>
            <span className="relative mt-16 block">
              <span className="block font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
                Discover. Define. Build. Launch.
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-white/80">
                A written scope with milestones and acceptance criteria before any build begins.
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                <span className="link-line">See our approach</span>
                <ArrowIcon className="h-3.5 w-3.5" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </Panel>
  );
}

function CompanyPanel({ open, onNavigate, onPointerEnter }: PanelProps) {
  return (
    <Panel id="nav-panel-company" open={open} onPointerEnter={onPointerEnter}>
      <ul className="grid grid-cols-3 gap-4">
        {companyNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={onNavigate} className="card-premium group block h-full rounded-2xl p-6">
              <span className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-ink">
                {item.label}
                <ArrowIcon className="h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
              <span className="mt-2 block text-sm text-mist">{item.detail}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
