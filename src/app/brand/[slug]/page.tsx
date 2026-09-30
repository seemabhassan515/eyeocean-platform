import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryGrid } from "@/components/CategoryGrid";
import { findBrandBySlug, getAllBrands } from "@/lib/brands";
import { getProductsByBrand } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllBrands()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: PageProps<"/brand/[slug]">) {
  const { slug } = await props.params;
  const brand = await findBrandBySlug(slug);
  if (!brand) return { title: "Designers" };

  const description = brand.description ?? `Shop ${brand.name} at EYEOCEAN.`;
  const url = absoluteUrl(`/brand/${slug}`);
  return {
    title: brand.name,
    description,
    alternates: { canonical: url },
    openGraph: { title: brand.name, description, url },
    twitter: { card: "summary_large_image", title: brand.name, description },
  };
}

export default async function BrandPage(props: PageProps<"/brand/[slug]">) {
  const { slug } = await props.params;
  const brand = await findBrandBySlug(slug);
  if (!brand) notFound();
  const products = await getProductsByBrand(slug);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Designers", href: "/brands" },
          { label: brand.name },
        ]}
      />

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        Designer
      </p>
      <h1 className="mt-3 text-heading font-display font-medium">{brand.name}</h1>
      {brand.description && (
        <p className="mt-3 max-w-lg text-sm leading-6 text-eo-grey">{brand.description}</p>
      )}

      <div className="mt-12">
        <CategoryGrid products={products} />
      </div>
    </div>
  );
}
