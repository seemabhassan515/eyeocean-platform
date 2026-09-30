import { notFound } from "next/navigation";
import { findBrandBySlug } from "@/lib/brands";

// See src/app/product/[slug]/layout.tsx for why this check lives in a
// same-segment layout rather than page.tsx: it runs outside the Suspense
// boundary that this segment's loading.tsx creates around page.tsx, so a
// missing brand gets a real 404 status instead of a 200 with "Not Found" UI.
export default async function BrandSlugLayout(
  props: LayoutProps<"/brand/[slug]">
) {
  const { slug } = await props.params;
  const brand = await findBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  return props.children;
}
