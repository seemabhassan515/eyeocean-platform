import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { findArticleBySlug, getAllArticles } from "@/lib/journal";
import { absoluteUrl } from "@/lib/site";
import { getDemoImage } from "@/lib/demo-images";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllArticles()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/journal/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await findArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  const url = absoluteUrl(`/journal/${slug}`);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function JournalArticlePage(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const article = await findArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paragraphs = article.body.split("\n\n");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    datePublished: article.publishedAt,
    url: absoluteUrl(`/journal/${slug}`),
  };

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <JsonLd data={articleSchema} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "The Journal", href: "/journal" },
          { label: article.title },
        ]}
      />

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        {article.category}
      </p>
      <h1 className="mt-3 max-w-[900px] text-display font-display font-medium">
        {article.title}
      </h1>
      <p className="mt-4 text-[13px] uppercase tracking-[0.1em] text-eo-grey">
        {publishedDate}
      </p>

      <div className="relative mt-8 aspect-[16/9] max-w-[1000px] overflow-hidden rounded-eo-sm">
        <Image
          src={getDemoImage(`journal-hero-${article.slug}`, 1200, 675)}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 1000px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-12 max-w-[680px] space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[15px] leading-7 text-eo-grey">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
