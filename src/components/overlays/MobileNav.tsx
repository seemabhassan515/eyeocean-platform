"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CloseIcon, ChevronIcon, SearchIcon, AccountIcon, WishlistIcon } from "@/components/icons/utility-icons";
import { DEPARTMENTS } from "@/lib/departments";
import { MEGA_MENU } from "@/lib/mega-menu";
import { useShell } from "@/lib/shell-context";

export function MobileNav() {
  const { closeOverlay, openOverlay } = useShell();
  const [openDept, setOpenDept] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Opening this dialog leaves focus on the now-hidden hamburger button
  // behind it unless we move it in ourselves — same pattern SearchOverlay
  // uses for its input.
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-eo-ivory"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="flex items-center justify-between border-b border-eo-platinum px-6 py-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em]">Menu</p>
        <button ref={closeButtonRef} type="button" aria-label="Close menu" onClick={closeOverlay}>
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <button
        type="button"
        className="flex items-center gap-3 border-b border-eo-platinum px-6 py-5 text-left"
        onClick={() => {
          closeOverlay();
          openOverlay("search");
        }}
      >
        <SearchIcon className="h-[18px] w-[18px]" />
        <span className="text-sm text-eo-grey">Search products, designers...</span>
      </button>

      <ul className="flex flex-col">
        {DEPARTMENTS.map((d) => {
          const expanded = openDept === d.slug;
          const content = MEGA_MENU[d.slug];
          return (
            <li key={d.slug} className="border-b border-eo-platinum">
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-5"
                aria-expanded={expanded}
                onClick={() => setOpenDept(expanded ? null : d.slug)}
              >
                <span className="text-sm font-medium uppercase tracking-[0.12em]">
                  {d.label}
                </span>
                <ChevronIcon
                  className={`h-3 w-3 transition-transform duration-[var(--eo-duration)] ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              {expanded && content && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-6">
                    {content.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-eo-grey">
                          {col.heading}
                        </p>
                        <ul className="mt-3 flex flex-col gap-2">
                          {col.links.map((link) => (
                            <li key={link}>
                              <button type="button" className="text-sm text-eo-obsidian/85">
                                {link}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/category/${d.slug}`}
                    onClick={closeOverlay}
                    className="mt-6 inline-block text-[11px] font-medium uppercase tracking-[0.12em] text-eo-obsidian underline underline-offset-4"
                  >
                    Shop All {d.label}
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-5 border-t border-eo-platinum px-6 py-6">
        <button
          type="button"
          className="flex items-center gap-3 text-sm"
          onClick={() => {
            closeOverlay();
            openOverlay("wishlist");
          }}
        >
          <WishlistIcon className="h-[18px] w-[18px]" />
          Wishlist
        </button>
        <Link href="/account" onClick={closeOverlay} className="flex items-center gap-3 text-sm">
          <AccountIcon className="h-[18px] w-[18px]" />
          Account
        </Link>
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.12em] text-eo-grey">
          <span>United Arab Emirates</span>
          <span>AED</span>
          <span>English</span>
        </div>
      </div>
    </div>
  );
}
