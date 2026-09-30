import Link from "next/link";
import Image from "next/image";
import { type JournalArticle } from "@/lib/journal";
import { getDemoImage } from "@/lib/demo-images";

export function JournalCard({ article }: { article: JournalArticle }) {
  return (
    <Link href={`/journal/${article.slug}`} className="group block text-left">
      <div className="relative aspect-[4/5] overflow-hidden rounded-eo-sm bg-eo-taupe">
        <Image
          src={getDemoImage(`journal-${article.slug}`, 800, 1000)}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:scale-[1.02]"
        />
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-eo-grey">
        {article.category}
      </p>
      <p className="mt-2 font-display text-xl italic">{article.title}</p>
      <p className="mt-2 text-[15px] leading-7 text-eo-grey">{article.excerpt}</p>
    </Link>
  );
}
