import { NextRequest, NextResponse } from "next/server";
import { getProductsBySlugs } from "@/lib/catalog";

/**
 * Backs the client-side product cache in shell-context.tsx. Cart/wishlist
 * state only stores product ids; drawers need full product details to
 * render, and client components can't call the server-only catalog module
 * directly. Requires `?ids=a,b,c` — deliberately does NOT support "return
 * everything", so nothing can accidentally reintroduce a full-catalog fetch
 * (see getProductsBySlugs in src/lib/catalog.ts for why that matters).
 */
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  const ids = idsParam
    ? idsParam.split(",").map((id) => id.trim()).filter(Boolean)
    : [];

  const products = await getProductsBySlugs(ids);
  return NextResponse.json({ products });
}
