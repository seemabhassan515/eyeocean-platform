import { NextRequest, NextResponse } from "next/server";
import { getMeiliClient, PRODUCTS_INDEX } from "@/lib/meilisearch-client";
import type { CatalogProduct } from "@/lib/catalog-types";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ products: [] });
  }

  try {
    const client = getMeiliClient();
    const index = client.index<CatalogProduct>(PRODUCTS_INDEX);
    const result = await index.search(q, { limit: 6 });
    return NextResponse.json({ products: result.hits });
  } catch (error) {
    // Meilisearch being unreachable (connection refused, DNS failure, no
    // MEILI_HOST configured, timeout, ...) is an expected, self-contained
    // degradation, not an upstream gateway failure — so this responds with
    // 503 Service Unavailable, not 502. (Contrast with
    // src/app/api/checkout/route.ts, which uses 502 for a failed call to
    // Stripe: that failure really is "this app, acting as a gateway to a
    // payment processor, got a bad/no response from it". Here the app isn't
    // proxying to Meilisearch on the client's behalf; it's a local feature
    // that is temporarily down, which 503 describes more precisely.)
    //
    // Whatever the failure, it MUST be caught and turned into an explicit
    // JSON response here — never let it propagate out of the handler, or
    // Next.js/Vercel will turn it into an opaque runtime-level 502 with no
    // JSON body at all, which is strictly worse for the client than this.
    console.error("Meilisearch query failed:", error);
    return NextResponse.json(
      { products: [], error: "Search is temporarily unavailable." },
      { status: 503 }
    );
  }
}
