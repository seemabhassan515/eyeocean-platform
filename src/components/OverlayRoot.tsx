"use client";

import { useEffect } from "react";
import { Scrim } from "@/components/overlays/Scrim";
import { CartDrawer } from "@/components/overlays/CartDrawer";
import { WishlistDrawer } from "@/components/overlays/WishlistDrawer";
import { SearchOverlay } from "@/components/overlays/SearchOverlay";
import { MobileNav } from "@/components/overlays/MobileNav";
import { useShell } from "@/lib/shell-context";

export function OverlayRoot() {
  const { overlay, closeOverlay } = useShell();

  useEffect(() => {
    if (!overlay) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [overlay, closeOverlay]);

  if (!overlay) return null;

  if (overlay === "search") return <SearchOverlay />;
  if (overlay === "mobileNav") return <MobileNav />;

  return (
    <>
      <Scrim onClick={closeOverlay} />
      {overlay === "cart" && <CartDrawer />}
      {overlay === "wishlist" && <WishlistDrawer />}
    </>
  );
}
