"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "@/components/overlays/Drawer";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { useShell } from "@/lib/shell-context";

export function CartDrawer() {
  const { cart, setCartQty, removeFromCart, closeOverlay, findProduct } = useShell();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const lines = cart
    .map((l) => ({ line: l, product: findProduct(l.id) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce(
    (sum, l) => sum + (l.product ? l.product.price * l.line.qty : 0),
    0
  );

  async function handleCheckout() {
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: cart }),
      });

      if (res.status === 401) {
        closeOverlay();
        router.push("/account");
        return;
      }

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setCheckoutError(data.error ?? "Checkout is temporarily unavailable.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setCheckoutError("Checkout is temporarily unavailable. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <Drawer
      title="Your Bag"
      onClose={closeOverlay}
      footer={
        lines.length > 0 ? (
          <div>
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, "AED")}</span>
            </div>
            <p className="mt-1 text-xs text-eo-grey">
              Shipping and taxes calculated at checkout.
            </p>
            {checkoutError && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {checkoutError}
              </p>
            )}
            <Button
              variant="primary"
              className="mt-5 w-full"
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? "Redirecting..." : "Checkout"}
            </Button>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-eo-grey">Your bag is empty.</p>
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
          {lines.map(({ line, product }) => (
            <li key={line.id} className="flex gap-4">
              <div className="h-24 w-20 shrink-0 bg-eo-taupe" />
              <div className="flex flex-1 flex-col">
                <p className="text-xs text-eo-grey">{product!.brand}</p>
                <p className="text-sm">{product!.name}</p>
                <p className="mt-1 text-sm">{formatPrice(product!.price, product!.currency)}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 border border-eo-platinum px-3 py-1"
                    role="group"
                    aria-label={`Quantity for ${product!.name}`}
                  >
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setCartQty(line.id, line.qty - 1)}
                    >
                      −
                    </button>
                    <span className="text-sm">{line.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setCartQty(line.id, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.1em] text-eo-grey hover:text-eo-obsidian"
                    onClick={() => removeFromCart(line.id)}
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
