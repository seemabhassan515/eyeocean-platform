import { JournalCard } from "@/components/JournalCard";
import { getAllArticles } from "@/lib/journal";

export async function JournalTeaser() {
  const articles = (await getAllArticles()).slice(0, 3);

  return (
    <section className="border-t border-eo-platinum bg-eo-ivory px-6 py-24 lg:px-8" id="journal">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
              The Journal
            </p>
            <h2 className="mt-3 text-heading font-display font-medium">
              Editorial Confidence
            </h2>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {articles.map((article) => (
            <JournalCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
