import { useEffect, useState } from "react";
import Image from "next/image";
import { MEGA_MENU } from "@/lib/mega-menu";
import { formatPrice } from "@/lib/format";
import { useShell } from "@/lib/shell-context";
import { WishlistIcon } from "@/components/icons/utility-icons";
import { getDemoImage } from "@/lib/demo-images";
import type { CatalogProduct } from "@/lib/catalog-types";

// Module-level cache: once a department's featured product has been fetched
// this session, reuse it instead of re-fetching on every hover.
const featuredCache = new Map<string, CatalogProduct | null>();

export function MegaMenu({ slug }: { slug: string }) {
  const content = MEGA_MENU[slug];
  const { addToCart, toggleWishlist, wishlist, setActiveDepartment } = useShell();
  const [entered, setEntered] = useState(false);
  const [featured, setFeatured] = useState<CatalogProduct | null>(
    featuredCache.get(slug) ?? null
  );

  // Opened via hover/focus on a header department link (see Header.tsx),
  // not through the overlay system OverlayRoot's Escape handler covers — so
  // it needs its own, closing back to the triggering link rather than
  // leaving a keyboard user stuck with no way to dismiss it.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveDepartment(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setActiveDepartment]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Skip the entrance animation for reduced-motion users, but still defer
      // the state update out of the effect body itself (react-hooks/set-state-in-effect).
      const id = window.setTimeout(() => setEntered(true), 0);
      return () => window.clearTimeout(id);
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // Header keys <MegaMenu> by department slug, so this effect only ever
    // runs once per genuine mount — a cache hit is already reflected by the
    // useState initializer above, nothing to do here for that case.
    if (featuredCache.has(slug)) return;

    let cancelled = false;
    fetch(`/api/featured?department=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: { product: CatalogProduct | null }) => {
        featuredCache.set(slug, data.product);
        if (!cancelled) setFeatured(data.product);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!content) return null;

  const inWishlist = featured ? wishlist.includes(featured.id) : false;

  return (
    <div
      className="absolute inset-x-0 top-full z-40 border-t border-eo-platinum bg-eo-ivory shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)] transition-[opacity,transform] duration-[var(--eo-duration)] ease-[var(--eo-ease)]"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(-6px)",
      }}
      role="region"
      aria-label={`${slug} menu`}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-4 gap-10 px-8 py-12">
        {content.columns.map((col) => (
          <div key={col.heading}>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
              {col.heading}
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    className="text-sm text-eo-obsidian/85 hover:text-eo-obsidian"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
            {content.editorial.label}
          </p>
          <div className="relative mt-5 aspect-[4/5] overflow-hidden rounded-eo-sm bg-eo-taupe">
            <Image
              src={getDemoImage(`menu-${slug}`, 500, 625)}
              alt=""
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>
          <p className="mt-4 font-display text-xl italic text-eo-obsidian">
            {content.editorial.title}
          </p>

          {featured ? (
            <div className="mt-6 flex items-center justify-between border-t border-eo-platinum pt-4">
              <div>
                <p className="text-xs text-eo-grey">{featured.brand}</p>
                <p className="text-sm text-eo-obsidian">{featured.name}</p>
                <p className="text-sm text-eo-obsidian">
                  {formatPrice(featured.price, featured.currency)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={inWishlist}
                  onClick={() => toggleWishlist(featured.id)}
                >
                  <WishlistIcon
                    className={`h-[18px] w-[18px] ${inWishlist ? "text-eo-champagne-text" : "text-eo-obsidian"}`}
                  />
                </button>
                <button
                  type="button"
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-eo-obsidian underline decoration-eo-champagne underline-offset-4"
                  onClick={() => addToCart(featured.id)}
                >
                  Quick Add
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
