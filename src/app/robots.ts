import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private/transactional routes — nothing here is useful to index, and
      // checkout/account pages shouldn't be crawled at all.
      disallow: ["/account", "/checkout", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
