import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllBrands } from "@/lib/brands";
import { absoluteUrl } from "@/lib/site";
import { getDemoImage } from "@/lib/demo-images";

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
            className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-eo-sm p-6 text-white"
          >
            <Image
              src={getDemoImage(`brand-${brand.slug}`, 900, 675)}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
            <span className="relative text-lg font-display font-medium transition-transform duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:-translate-y-1">
              {brand.name}
            </span>
            {brand.description && (
              <p className="relative mt-2 text-sm leading-6 text-white/85">
                {brand.description}
              </p>
            )}
            <p className="relative mt-3 text-[11px] uppercase tracking-[0.12em] text-white/70">
              {brand.productCount} {brand.productCount === 1 ? "piece" : "pieces"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
