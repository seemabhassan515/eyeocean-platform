import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEPARTMENTS } from "@/lib/departments";
import { findProductBySlug, getProductsByDepartment } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata(
  props: PageProps<"/product/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await findProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = `${product.brand} — ${product.name}`;
  const url = absoluteUrl(`/product/${slug}`);
  return {
    title,
    description: product.description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description: product.description, url },
    twitter: { card: "summary_large_image", title, description: product.description },
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const department = DEPARTMENTS.find((d) => d.slug === product.departmentSlug);
  const relatedProducts = (await getProductsByDepartment(product.departmentSlug))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    url: absoluteUrl(`/product/${slug}`),
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/product/${slug}`),
    },
  };

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-8">
      <JsonLd data={productSchema} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          {
            label: department?.label ?? product.departmentSlug,
            href: `/category/${product.departmentSlug}`,
          },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery productId={product.id} productName={product.name} />
        <ProductPurchasePanel product={product} />
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="text-heading font-display font-medium">You May Also Like</h2>
          <div className="mt-12 flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {relatedProducts.map((p) => (
              <div key={p.id} className="w-[220px] shrink-0 sm:w-[260px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
