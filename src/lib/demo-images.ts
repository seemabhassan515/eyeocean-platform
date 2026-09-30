/**
 * DEMO PHOTOGRAPHY — design-refresh branch only, not merged into main.
 *
 * The real catalog (prisma/schema.prisma's ProductImage model) has no image
 * URL field, only a `colorHex` swatch placeholder — there's no real product
 * photography or upload pipeline yet. To let this design review actually be
 * judged with real photography instead of flat color blocks, this file maps
 * each existing seed product's slug to a stable picsum.photos URL (real
 * stock photography, deterministic per seed, always resolves).
 *
 * This is intentionally NOT a database change: no schema migration, no new
 * product rows, nothing written to Postgres. Preview and production share
 * one database (confirmed via `vercel env ls` — DATABASE_URL is scoped to
 * both), so anything that writes new rows — new demo products, seeded
 * images — would leak into production immediately, before this branch is
 * even merged. This file sidesteps that entirely: it's pure presentation
 * code, applied only to the 10 products that already exist, and it never
 * reaches production because the branch itself isn't merged.
 *
 * To remove: delete this file and the two `getDemoImage` call sites (see
 * ProductCard.tsx and product/[slug]/page.tsx). To use real photography
 * later: that needs an actual `imageUrl` column on ProductImage (a schema
 * migration) plus an upload/CDN pipeline — out of scope for this pass.
 */
const DEMO_IMAGE_SEEDS: Record<string, string> = {
  p1: "eyeocean-coat",
  p2: "eyeocean-pendant",
  p3: "eyeocean-lamp",
  p4: "eyeocean-jacket",
  p5: "eyeocean-earrings",
  p6: "eyeocean-serum",
  p7: "eyeocean-sculpture",
  p8: "eyeocean-bag",
  p9: "eyeocean-candle",
  p10: "eyeocean-speaker",
};

export function getDemoImage(productId: string, width = 800, height = 1000): string {
  const seed = DEMO_IMAGE_SEEDS[productId] ?? productId;
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
