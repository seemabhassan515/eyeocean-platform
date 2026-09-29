"use client";

import Link from "next/link";
import { EyeoceanWordmark } from "@/components/icons/eyeocean-marks";
import {
  AccountIcon,
  BagIcon,
  MenuIcon,
  SearchIcon,
  WishlistIcon,
} from "@/components/icons/utility-icons";
import { MegaMenu } from "@/components/MegaMenu";
import { DEPARTMENTS } from "@/lib/departments";
import { useShell } from "@/lib/shell-context";

export function Header() {
  const {
    activeDepartment,
    setActiveDepartment,
    openOverlay,
    cartCount,
    wishlist,
  } = useShell();

  return (
    <header
      className="sticky top-0 z-30 bg-eo-ivory"
      onMouseLeave={() => setActiveDepartment(null)}
    >
      <div className="hidden border-b border-eo-platinum lg:block">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-2 text-[11px] uppercase tracking-[0.12em] text-eo-grey">
          <div className="flex items-center gap-5">
            <span>United Arab Emirates</span>
            <span>AED</span>
            <span>English</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/#concierge" className="hover:text-eo-obsidian">
              Customer Service
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-5 lg:px-8">
        <button
          type="button"
          className="p-1 lg:hidden"
          aria-label="Open menu"
          onClick={() => openOverlay("mobileNav")}
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <Link href="/" className="text-eo-obsidian" aria-label="EYEOCEAN, home">
          <EyeoceanWordmark className="h-4 w-auto lg:h-[18px]" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Departments">
          {DEPARTMENTS.map((d) => (
            <Link
              key={d.slug}
              href={`/category/${d.slug}`}
              className={`text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
                activeDepartment === d.slug ? "text-eo-obsidian" : "text-eo-obsidian/80 hover:text-eo-obsidian"
              }`}
              aria-expanded={activeDepartment === d.slug}
              onMouseEnter={() => setActiveDepartment(d.slug)}
              onFocus={() => setActiveDepartment(d.slug)}
              onClick={() =>
                setActiveDepartment(activeDepartment === d.slug ? null : d.slug)
              }
            >
              {d.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-eo-obsidian">
          <button
            type="button"
            aria-label="Search"
            className="hidden sm:block"
            onClick={() => openOverlay("search")}
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>
          <Link href="/account" aria-label="Account" className="hidden sm:block">
            <AccountIcon className="h-[18px] w-[18px]" />
          </Link>
          <button
            type="button"
            aria-label={`Wishlist, ${wishlist.length} item${wishlist.length === 1 ? "" : "s"}`}
            className="relative hidden sm:block"
            onClick={() => openOverlay("wishlist")}
          >
            <WishlistIcon className="h-[18px] w-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-eo-obsidian text-[9px] text-eo-ivory">
                {wishlist.length}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label={`Bag, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative"
            onClick={() => openOverlay("cart")}
          >
            <BagIcon className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-eo-obsidian text-[9px] text-eo-ivory">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {activeDepartment && <MegaMenu key={activeDepartment} slug={activeDepartment} />}
      </div>
    </header>
  );
}
