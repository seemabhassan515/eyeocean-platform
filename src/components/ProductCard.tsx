"use client";

import Link from "next/link";
import { type CatalogProduct } from "@/lib/catalog-types";
import { formatPrice } from "@/lib/format";
import { useShell } from "@/lib/shell-context";
import { WishlistIcon } from "@/components/icons/utility-icons";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { addToCart, toggleWishlist, wishlist } = useShell();
  const inWishlist = wishlist.includes(product.id);
  const href = `/product/${product.id}`;

  return (
    <div className="group w-full shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-eo-taupe">
        <Link href={href} className="absolute inset-0 z-0" aria-label={product.name}>
          <div className="h-full w-full transition-transform duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:scale-[1.03]" />
        </Link>
        <button
          type="button"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-eo-ivory/90"
        >
          <WishlistIcon
            className={`h-4 w-4 ${inWishlist ? "text-eo-champagne-text" : "text-eo-obsidian"}`}
          />
        </button>
        <button
          type="button"
          onClick={() => addToCart(product.id)}
          className="absolute inset-x-3 bottom-3 z-10 translate-y-2 bg-eo-obsidian py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-eo-ivory opacity-0 transition-[opacity,transform] duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          Quick Add
        </button>
      </div>
      <Link href={href} className="mt-4 block">
        <p className="text-xs text-eo-grey">{product.brand}</p>
        <p className="text-sm text-eo-obsidian">{product.name}</p>
        <p className="mt-1 text-sm text-eo-obsidian">
          {formatPrice(product.price, product.currency)}
        </p>
      </Link>
    </div>
  );
}
