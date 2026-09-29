import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { CatalogProduct } from "@/lib/catalog-types";

/**
 * Server-only catalog data-access layer, backed by Postgres via Prisma
 * (see prisma/schema.prisma). This replaces the Phase 2-5 in-memory mock
 * array — the shape returned here (CatalogProduct, in catalog-types.ts) is
 * deliberately identical to the old `MockProduct` type so every existing
 * component (ProductCard, CategoryGrid, ProductPurchasePanel, etc.) needed
 * no changes, only the call sites that fetch data had to start awaiting it.
 *
 * Note: `id` here is the Product's `slug` (e.g. "p1"), not its internal
 * Prisma cuid — cart/wishlist state and URLs were already built around a
 * plain stable string id, so reusing `slug` for that keeps everything
 * downstream unchanged.
 */
export type { CatalogProduct, CatalogVariant } from "@/lib/catalog-types";

const include = {
  brand: true,
  category: true,
  optionGroups: { include: { values: { orderBy: { position: "asc" as const } } }, orderBy: { position: "asc" as const } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof include }>;

function toCatalogProduct(product: ProductWithRelations): CatalogProduct {
  return {
    id: product.slug,
    brand: product.brand.name,
    brandSlug: product.brand.slug,
    name: product.name,
    departmentSlug: product.category.slug,
    price: product.price,
    currency: product.currencyCode,
    description: product.description,
    variants: product.optionGroups.length
      ? product.optionGroups.map((group) => ({
          label: group.label,
          options: group.values.map((v) => v.value),
        }))
      : undefined,
  };
}

export async function findProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const product = await prisma.product.findUnique({ where: { slug }, include });
  return product ? toCatalogProduct(product) : null;
}

export async function getProductsByDepartment(departmentSlug: string): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { category: { slug: departmentSlug } },
    include,
    orderBy: { createdAt: "asc" },
  });
  return products.map(toCatalogProduct);
}

export async function getAllProducts(): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({ include, orderBy: { createdAt: "asc" } });
  return products.map(toCatalogProduct);
}

export async function getProductsByBrand(brandSlug: string): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { brand: { slug: brandSlug } },
    include,
    orderBy: { createdAt: "asc" },
  });
  return products.map(toCatalogProduct);
}

/**
 * Batch lookup by slug (Phase 11 perf fix). The client-side product cache
 * used to fetch the *entire* catalog on every page load just to resolve
 * cart/wishlist line items — fine at 10 products, a real problem at scale.
 * This fetches only the handful of products actually referenced by a
 * customer's cart/wishlist, so cost scales with basket size, not catalog size.
 */
export async function getProductsBySlugs(slugs: string[]): Promise<CatalogProduct[]> {
  if (slugs.length === 0) return [];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include,
  });
  return products.map(toCatalogProduct);
}

export async function getFeaturedProductForDepartment(
  departmentSlug: string
): Promise<CatalogProduct | null> {
  const product = await prisma.product.findFirst({
    where: { category: { slug: departmentSlug } },
    include,
    orderBy: { createdAt: "asc" },
  });
  return product ? toCatalogProduct(product) : null;
}
