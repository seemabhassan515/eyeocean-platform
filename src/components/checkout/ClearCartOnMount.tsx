"use client";

import { useEffect } from "react";
import { useShell } from "@/lib/shell-context";

export function ClearCartOnMount() {
  const { clearCart } = useShell();
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
