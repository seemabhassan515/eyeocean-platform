import { notFound } from "next/navigation";
import { findArticleBySlug } from "@/lib/journal";

// See src/app/product/[slug]/layout.tsx for why this check lives in a
// same-segment layout rather than page.tsx: it runs outside the Suspense
// boundary that this segment's loading.tsx creates around page.tsx, so a
// missing article gets a real 404 status instead of a 200 with "Not Found" UI.
export default async function JournalSlugLayout(
  props: LayoutProps<"/journal/[slug]">
) {
  const { slug } = await props.params;
  const article = await findArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return props.children;
}
