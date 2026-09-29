import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JournalCard } from "@/components/JournalCard";
import { getAllArticles } from "@/lib/journal";
import { absoluteUrl } from "@/lib/site";

const description =
  "Editorial stories on design, craft and contemporary luxury from EYEOCEAN.";
const url = absoluteUrl("/journal");

export const metadata = {
  title: "The Journal",
  description,
  alternates: { canonical: url },
  openGraph: { title: "The Journal", description, url },
  twitter: { card: "summary_large_image", title: "The Journal", description },
};

export const revalidate = 3600;

export default async function JournalPage() {
  const articles = await getAllArticles();

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "The Journal" }]} />

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        The Journal
      </p>
      <h1 className="mt-3 text-heading font-display font-medium">Editorial Confidence</h1>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <JournalCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
