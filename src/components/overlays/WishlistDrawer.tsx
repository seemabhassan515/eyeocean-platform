import Image from "next/image";
import { Drawer } from "@/components/overlays/Drawer";
import { formatPrice } from "@/lib/format";
import { useShell } from "@/lib/shell-context";
import { getDemoImage } from "@/lib/demo-images";

export function WishlistDrawer() {
  const { wishlist, toggleWishlist, addToCart, closeOverlay, findProduct } = useShell();

  const items = wishlist
    .map((id) => findProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Drawer title="Wishlist" onClose={closeOverlay}>
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-eo-grey">Your wishlist is empty.</p>
          <button
            type="button"
            onClick={closeOverlay}
            className="text-[11px] font-medium uppercase tracking-[0.12em] underline decoration-eo-champagne underline-offset-4"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {items.map((product) => (
            <li key={product.id} className="flex gap-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-eo-sm bg-eo-taupe">
                <Image src={getDemoImage(product.id, 160, 192)} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-xs text-eo-grey">{product.brand}</p>
                <p className="text-sm">{product.name}</p>
                <p className="mt-1 text-sm">{formatPrice(product.price, product.currency)}</p>
                <div className="mt-3 flex items-center gap-4">
                  <button
                    type="button"
                    className="text-[11px] font-medium uppercase tracking-[0.12em] underline decoration-eo-champagne underline-offset-4"
                    onClick={() => {
                      addToCart(product.id);
                      toggleWishlist(product.id);
                    }}
                  >
                    Move to Bag
                  </button>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.1em] text-eo-grey hover:text-eo-obsidian"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
