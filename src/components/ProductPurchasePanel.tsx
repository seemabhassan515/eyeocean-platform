"use client";

import { useState } from "react";
import Link from "next/link";
import { type CatalogProduct } from "@/lib/catalog-types";
import { formatPrice } from "@/lib/format";
import { useShell } from "@/lib/shell-context";
import { WishlistIcon } from "@/components/icons/utility-icons";
import { Button } from "@/components/ui/Button";

export function ProductPurchasePanel({ product }: { product: CatalogProduct }) {
  const { addToCart, toggleWishlist, wishlist } = useShell();
  const inWishlist = wishlist.includes(product.id);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        (product.variants ?? []).map((variant) => [variant.label, variant.options[0]])
      )
  );
  const [quantity, setQuantity] = useState(1);

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(10, q + 1));

  return (
    <div>
      <Link href={`/brand/${product.brandSlug}`} className="text-xs text-eo-grey hover:text-eo-obsidian">
        {product.brand}
      </Link>
      <h1 className="mt-2 text-heading font-display font-medium">{product.name}</h1>
      <p className="mt-3 text-lg">{formatPrice(product.price, product.currency)}</p>
      <p className="mt-6 max-w-lg text-eo-grey leading-7">{product.description}</p>

      {product.variants?.map((variant) => (
        <div key={variant.label} className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-eo-obsidian">
            {variant.label}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variant.options.map((option) => {
              const isSelected = selectedOptions[variant.label] === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedOptions((prev) => ({ ...prev, [variant.label]: option }))
                  }
                  className={`border px-4 py-2 text-sm transition-colors duration-[var(--eo-duration)] ease-[var(--eo-ease)] ${
                    isSelected
                      ? "border-eo-obsidian text-eo-obsidian"
                      : "border-eo-platinum text-eo-grey hover:border-eo-obsidian hover:text-eo-obsidian"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-eo-obsidian">
          Quantity
        </p>
        <div
          className="mt-3 flex w-fit items-center gap-3 border border-eo-platinum px-3 py-1"
          role="group"
          aria-label={`Quantity for ${product.name}`}
        >
          <button type="button" aria-label="Decrease quantity" onClick={decreaseQty}>
            −
          </button>
          <span className="text-sm">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={increaseQty}>
            +
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => addToCart(product.id, quantity)}
        >
          Add to Bag
        </Button>
        <button
          type="button"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          onClick={() => toggleWishlist(product.id)}
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center border border-eo-platinum"
        >
          <WishlistIcon
            className={`h-4 w-4 ${inWishlist ? "text-eo-champagne-text" : "text-eo-obsidian"}`}
          />
        </button>
      </div>
    </div>
  );
}
