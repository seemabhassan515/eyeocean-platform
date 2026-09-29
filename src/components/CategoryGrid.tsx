"use client";

import { useMemo, useState } from "react";
import { type CatalogProduct } from "@/lib/catalog-types";
import { ProductCard } from "@/components/ProductCard";

type Sort = "newest" | "price-asc" | "price-desc";

export function CategoryGrid({ products }: { products: CatalogProduct[] }) {
  const [sort, setSort] = useState<Sort>("newest");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const visible = useMemo(() => {
    let list = products;
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, selectedBrands, sort]);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-56">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
          Brand
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 accent-eo-obsidian"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-eo-platinum pb-4">
          <p className="text-sm text-eo-grey">
            {visible.length} item{visible.length === 1 ? "" : "s"}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-eo-grey">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="border border-eo-platinum bg-transparent px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-eo-grey">
            No pieces match these filters.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
