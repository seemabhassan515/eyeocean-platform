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
    console.error("Meilisearch query failed:", error);
    return NextResponse.json(
      { products: [], error: "Search is temporarily unavailable." },
      { status: 502 }
    );
  }
}
