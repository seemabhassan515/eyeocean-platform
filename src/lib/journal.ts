import "server-only";
import { prisma } from "@/lib/db";

export type JournalArticle = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  publishedAt: string;
};

function toArticle(article: {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  publishedAt: Date;
}): JournalArticle {
  return { ...article, publishedAt: article.publishedAt.toISOString() };
}

export async function getAllArticles(): Promise<JournalArticle[]> {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: "desc" } });
  return articles.map(toArticle);
}

export async function findArticleBySlug(slug: string): Promise<JournalArticle | null> {
  const article = await prisma.article.findUnique({ where: { slug } });
  return article ? toArticle(article) : null;
}
