"use client";

import { useEffect, useId, useRef, useState } from "react";
import { logout } from "@/app/admin/actions";
import { initials } from "@/lib/initials";

/**
 * Avatar button in the admin bar; opens a menu with the signed-in account and
 * account actions. Add future items (profile, password, preferences...) to the
 * list between the header and Sign out.
 */
export function ProfileMenu({ username, role = "Super admin" }: { username: string; role?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const badge = initials(username) || "A";

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex items-center gap-2.5 rounded-full border border-white/15 py-1 pr-3 pl-1 text-sm transition-colors hover:border-white/40 aria-expanded:border-white/40 aria-expanded:bg-white/5"
      >
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-cobalt text-xs font-semibold text-white"
        >
          {badge}
        </span>
        <span className="hidden max-w-[140px] truncate text-white md:inline">{username}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-2.5 w-2.5 text-fog transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Account menu</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-4">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cobalt text-sm font-semibold text-white"
            >
              {badge}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{username}</span>
              <span className="mt-0.5 inline-flex rounded-full bg-cobalt/10 px-2 py-0.5 text-[11px] font-medium text-cobalt">
                {role}
              </span>
            </span>
          </div>

          {/* Future account items (profile, password, preferences) go here. */}

          <form action={logout} className="p-1.5">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-danger transition-colors hover:bg-danger/5"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
                <path
                  d="M6 2.5H3.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1H6M10.5 11l3-3-3-3M13.5 8H6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
