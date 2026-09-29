"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CatalogProduct } from "@/lib/catalog-types";

export type CartLine = { id: string; qty: number };
export type Overlay = "search" | "cart" | "wishlist" | "mobileNav" | null;

type ShellState = {
  overlay: Overlay;
  openOverlay: (overlay: Exclude<Overlay, null>) => void;
  closeOverlay: () => void;

  activeDepartment: string | null;
  setActiveDepartment: (slug: string | null) => void;

  cart: CartLine[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;

  wishlist: string[];
  toggleWishlist: (id: string) => void;

  findProduct: (id: string) => CatalogProduct | undefined;
};

const ShellContext = createContext<ShellState | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Phase 11 perf fix: only fetch product details for ids actually in the
  // cart/wishlist (a handful, ever), never the whole catalog. `fetchedIds`
  // is a ref (not state) purely for request dedup/in-flight tracking, so it
  // doesn't need to be an effect dependency.
  const [productCache, setProductCache] = useState<Record<string, CatalogProduct>>({});
  const fetchedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const neededIds = Array.from(new Set([...cart.map((l) => l.id), ...wishlist]));
    const missing = neededIds.filter((id) => !fetchedIds.current.has(id));
    if (missing.length === 0) return;

    missing.forEach((id) => fetchedIds.current.add(id));

    fetch(`/api/products?ids=${missing.map(encodeURIComponent).join(",")}`)
      .then((r) => r.json())
      .then((data: { products: CatalogProduct[] }) => {
        setProductCache((prev) => {
          const next = { ...prev };
          for (const p of data.products) next[p.id] = p;
          return next;
        });
      })
      .catch(() => {
        missing.forEach((id) => fetchedIds.current.delete(id));
      });
  }, [cart, wishlist]);

  const openOverlay = useCallback((next: Exclude<Overlay, null>) => {
    setOverlay(next);
  }, []);
  const closeOverlay = useCallback(() => setOverlay(null), []);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const line = prev.find((l) => l.id === id);
      if (line) {
        return prev.map((l) =>
          l.id === id ? { ...l, qty: Math.min(10, l.qty + qty) } : l
        );
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const setCartQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty < 1
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(10, qty) } : l))
    );
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, l) => sum + l.qty, 0),
    [cart]
  );

  const findProduct = useCallback(
    (id: string) => productCache[id],
    [productCache]
  );

  const value = useMemo<ShellState>(
    () => ({
      overlay,
      openOverlay,
      closeOverlay,
      activeDepartment,
      setActiveDepartment,
      cart,
      addToCart,
      removeFromCart,
      setCartQty,
      clearCart,
      cartCount,
      wishlist,
      toggleWishlist,
      findProduct,
    }),
    [
      overlay,
      openOverlay,
      closeOverlay,
      activeDepartment,
      cart,
      addToCart,
      removeFromCart,
      setCartQty,
      clearCart,
      cartCount,
      wishlist,
      toggleWishlist,
      findProduct,
    ]
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within ShellProvider");
  return ctx;
}
