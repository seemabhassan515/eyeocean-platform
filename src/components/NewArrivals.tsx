import { getAllProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export async function NewArrivals() {
  const products = await getAllProducts();

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 lg:px-8" id="new-arrivals">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
            The New Season
          </p>
          <h2 className="mt-3 text-heading font-display font-medium">
            Newly Selected
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-7 text-eo-grey">
            Discover newly selected pieces from exceptional houses and emerging names.
          </p>
        </div>
      </div>

      <div className="mt-12 flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[220px] shrink-0 sm:w-[260px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
