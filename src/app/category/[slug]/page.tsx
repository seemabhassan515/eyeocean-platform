import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryGrid } from "@/components/CategoryGrid";
import { DEPARTMENTS } from "@/lib/departments";
import { getProductsByDepartment } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const department = DEPARTMENTS.find((d) => d.slug === slug);
  if (!department) return {};

  const description = `Shop ${department.label} at EYEOCEAN — curated pieces from exceptional houses.`;
  const url = absoluteUrl(`/category/${slug}`);
  return {
    title: department.label,
    description,
    alternates: { canonical: url },
    openGraph: { title: department.label, description, url },
    twitter: { card: "summary_large_image", title: department.label, description },
  };
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const department = DEPARTMENTS.find((d) => d.slug === slug);
  if (!department) notFound();
  const products = await getProductsByDepartment(slug);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: department.label }]} />

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        Department
      </p>
      <h1 className="mt-3 text-heading font-display font-medium">
        {department.label}
      </h1>

      <div className="mt-12">
        <CategoryGrid products={products} />
      </div>
    </div>
  );
}
