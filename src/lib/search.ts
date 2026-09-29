/**
 * Search abstraction (Phase 5).
 *
 * The frontend (src/components/overlays/SearchOverlay.tsx) talks to this
 * interface only — never directly to Meilisearch or any other provider.
 * `meilisearchProvider` calls /api/search, a Next.js Route Handler that holds
 * the Meilisearch host/API key server-side (see src/lib/meilisearch-client.ts
 * and src/app/api/search/route.ts) — those credentials never reach the browser.
 *
 * Swapping providers later (Algolia, Typesense...) means writing a new
 * SearchProvider implementation and changing the `searchProvider` export
 * below — nothing else in the app should need to change.
 */
import { DEPARTMENTS, type Department } from "@/lib/departments";
import type { CatalogProduct } from "@/lib/catalog-types";

export type SearchResults = {
  products: CatalogProduct[];
  departments: Department[];
};

export interface SearchProvider {
  search(query: string): Promise<SearchResults>;
}

const EMPTY_RESULTS: SearchResults = { products: [], departments: [] };

function matchingDepartments(query: string): Department[] {
  const q = query.trim().toLowerCase();
  return DEPARTMENTS.filter((d) => d.label.toLowerCase().includes(q));
}

export const meilisearchProvider: SearchProvider = {
  async search(query: string) {
    const q = query.trim();
    if (!q) return EMPTY_RESULTS;

    const departments = matchingDepartments(query);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) return { products: [], departments };
      const data = (await res.json()) as { products: CatalogProduct[] };
      return { products: data.products, departments };
    } catch {
      return { products: [], departments };
    }
  },
};

export const searchProvider: SearchProvider = meilisearchProvider;
