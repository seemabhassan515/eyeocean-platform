import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { DEPARTMENTS } from "@/lib/departments";
import { getAllProducts } from "@/lib/catalog";
import { getAllBrands } from "@/lib/brands";
import { getAllArticles } from "@/lib/journal";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, brands, articles] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllArticles(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/new-arrivals`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/brands`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/journal`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = DEPARTMENTS.map((d) => ({
    url: `${SITE_URL}/category/${d.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${SITE_URL}/brand/${b.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/journal/${a.slug}`,
    lastModified: a.publishedAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...brandRoutes,
    ...articleRoutes,
  ];
}
