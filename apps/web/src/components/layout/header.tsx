"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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

  // backdrop-filter would make the fullscreen mobile overlay position against the header.
  const solid = (scrolled || menu !== null) && !mobileOpen;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      ref={headerRef}
      className={`tone-dark fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid
          ? "border-b border-night-line bg-night/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
      onPointerLeave={scheduleClose}
    >
      <div className="relative z-[60] mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Logo onNavigate={closeAll} />

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
          <Link href="/contact" className={buttonClass("light", "h-10 px-5")}>
            Let&apos;s talk
            <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
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
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        active ? "text-white" : "text-fog hover:text-white"
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
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
        open || active ? "text-white" : "text-fog hover:text-white"
      }`}
    >
      {label}
      <ChevronIcon
        className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      />
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
 * `fixed` resolves against the fixed, full-width header either way, so the
 * panel spans the viewport just below the bar.
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
      className={`fixed inset-x-0 top-16 border-b border-night-line bg-night shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)] transition-[opacity,translate] duration-300 ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-[1320px] px-10 py-10">{children}</div>
    </div>
  );
}

function SolutionsPanel({ open, onNavigate, onPointerEnter }: PanelProps) {
  return (
    <Panel id="nav-panel-solutions" open={open} onPointerEnter={onPointerEnter}>
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <p className="t-eyebrow text-fog">What we build</p>
          <ul className="mt-6 grid grid-cols-2 gap-x-8">
            {services.map((service) => (
              <li key={service.slug} className="border-t border-night-line">
                <Link
                  href={`/services/${service.slug}`}
                  onClick={onNavigate}
                  className="group flex gap-4 py-5"
                >
                  <span className="t-eyebrow pt-1 text-signal">{service.index}</span>
                  <span>
                    <span className="flex items-center gap-2 text-base font-medium text-white">
                      {service.title}
                      <ArrowIcon className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-fog">
                      {service.summary}
                    </span>
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
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-night-line bg-night-2 p-7"
          >
            <span aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
            <span className="relative t-eyebrow text-signal">How we work</span>
            <span className="relative mt-16 block">
              <span className="block text-2xl font-medium tracking-tight text-white">
                Discover. Define. Build. Launch.
              </span>
              <span className="mt-3 block text-sm leading-relaxed text-fog">
                A written scope with milestones and acceptance criteria before any build begins.
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-white">
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
      <ul className="grid grid-cols-3 gap-8">
        {companyNav.map((item) => (
          <li key={item.href} className="border-t border-night-line">
            <Link href={item.href} onClick={onNavigate} className="group block py-5">
              <span className="flex items-center gap-2 text-xl font-medium tracking-tight text-white">
                {item.label}
                <ArrowIcon className="h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
              <span className="mt-2 block text-sm text-fog">{item.detail}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
