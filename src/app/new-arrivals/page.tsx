import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryGrid } from "@/components/CategoryGrid";
import { getAllProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

const description = "Newly selected pieces from exceptional houses and emerging names.";
const url = absoluteUrl("/new-arrivals");

export const metadata = {
  title: "New Arrivals",
  description,
  alternates: { canonical: url },
  openGraph: { title: "New Arrivals", description, url },
  twitter: { card: "summary_large_image", title: "New Arrivals", description },
};

export const revalidate = 3600;

export default async function NewArrivalsPage() {
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "New Arrivals" }]} />

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        The New Season
      </p>
      <h1 className="mt-3 text-heading font-display font-medium">
        Newly Selected
      </h1>

      <div className="mt-12">
        <CategoryGrid products={products} />
      </div>
    </div>
  );
}
