import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllBrands } from "@/lib/brands";
import { absoluteUrl } from "@/lib/site";

const description = "The houses and studios carried by EYEOCEAN.";
const url = absoluteUrl("/brands");

export const metadata = {
  title: "Designers",
  description,
  alternates: { canonical: url },
  openGraph: { title: "Designers", description, url },
  twitter: { card: "summary_large_image", title: "Designers", description },
};

export const revalidate = 3600;

export default async function BrandsPage() {
  const brands = await getAllBrands();

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Designers" }]} />

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        Designers
      </p>
      <h1 className="mt-3 text-heading font-display font-medium">
        The Houses We Carry
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brand/${brand.slug}`}
            className="group flex aspect-[4/3] flex-col justify-end bg-eo-taupe p-6 text-eo-obsidian"
          >
            <span className="text-lg font-display font-medium transition-transform duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:-translate-y-1">
              {brand.name}
            </span>
            {brand.description && (
              <p className="mt-2 text-sm leading-6 text-eo-obsidian/80">
                {brand.description}
              </p>
            )}
            <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-eo-obsidian/70">
              {brand.productCount} {brand.productCount === 1 ? "piece" : "pieces"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
