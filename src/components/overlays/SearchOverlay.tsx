"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CloseIcon, SearchIcon } from "@/components/icons/utility-icons";
import { useShell } from "@/lib/shell-context";
import { searchProvider, type SearchResults } from "@/lib/search";
import { formatPrice } from "@/lib/format";
import { getDemoImage } from "@/lib/demo-images";

const POPULAR_SEARCHES = [
  "New Arrivals",
  "Fine Jewelry",
  "Designer Bags",
  "Watches",
  "Skincare",
];

const EMPTY_RESULTS: SearchResults = { products: [], departments: [] };

export function SearchOverlay() {
  const { closeOverlay } = useShell();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      searchProvider.search(query).then((r) => {
        if (!cancelled) setResults(r);
      });
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const hasResults = results.products.length > 0 || results.departments.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-eo-ivory"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-6 pt-24 pb-16 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-4 border-b border-eo-obsidian pb-4">
            <SearchIcon className="h-5 w-5 text-eo-grey" />
            <input
              ref={inputRef}
              type="search"
              aria-label="Search products, designers, departments"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, designers, departments..."
              className="w-full bg-transparent font-display text-2xl italic placeholder:text-eo-grey outline-none focus-visible:[outline:2px_solid_var(--eo-obsidian)] focus-visible:outline-offset-2"
            />
          </div>
          <button
            type="button"
            aria-label="Close search"
            onClick={closeOverlay}
            className="ml-6"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {!hasQuery && (
          <div className="mt-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
              Popular Searches
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="border border-eo-platinum px-4 py-2 text-sm hover:border-eo-obsidian"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasQuery && !hasResults && (
          <p className="mt-10 text-sm text-eo-grey">No results for &ldquo;{query}&rdquo;.</p>
        )}

        {hasQuery && results.departments.length > 0 && (
          <div className="mt-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
              Departments
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {results.departments.map((d) => (
                <Link
                  key={d.slug}
                  href={`/category/${d.slug}`}
                  onClick={closeOverlay}
                  className="border border-eo-platinum px-4 py-2 text-sm hover:border-eo-obsidian"
                >
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {hasQuery && results.products.length > 0 && (
          <div className="mt-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
              Products
            </p>
            <ul className="mt-4 flex flex-col gap-4">
              {results.products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.id}`}
                    onClick={closeOverlay}
                    className="flex items-center gap-4"
                  >
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-eo-sm bg-eo-taupe">
                      <Image src={getDemoImage(p.id, 112, 128)} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs text-eo-grey">{p.brand}</p>
                      <p className="text-sm">{p.name}</p>
                      <p className="text-sm text-eo-grey">{formatPrice(p.price, p.currency)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
