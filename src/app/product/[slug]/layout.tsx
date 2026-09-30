import { notFound } from "next/navigation";
import { findProductBySlug } from "@/lib/catalog";

// Guards the route before `loading.tsx`'s Suspense boundary takes over.
//
// `loading.tsx` in this same segment automatically wraps `page.tsx` (and its
// `notFound()` call) in a Suspense boundary. Once that boundary's child
// suspends — which it always does here, since the product lookup is a real
// async DB call — Next.js immediately starts streaming the loading skeleton
// with a 200 status, and the status can no longer change once page.tsx later
// calls `notFound()`. A layout in the same segment is NOT wrapped by that
// sibling loading.tsx, so doing the existence check here means it resolves
// (and can throw the NEXT_HTTP_ERROR_FALLBACK;404 from notFound()) before any
// streaming begins, giving a real 404 status for missing slugs.
export default async function ProductSlugLayout(
  props: LayoutProps<"/product/[slug]">
) {
  const { slug } = await props.params;
  const product = await findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return props.children;
}
