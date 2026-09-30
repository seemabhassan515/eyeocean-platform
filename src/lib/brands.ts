import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";

export type BrandSummary = {
  slug: string;
  name: string;
  description: string | null;
  productCount: number;
};

export async function getAllBrands(): Promise<BrandSummary[]> {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return brands.map((b) => ({
    slug: b.slug,
    name: b.name,
    description: b.description,
    productCount: b._count.products,
  }));
}

export const findBrandBySlug = cache(async function findBrandBySlug(slug: string) {
  return prisma.brand.findUnique({ where: { slug } });
});
