/**
 * Shared product DTO shape, safe to import from client components.
 * The actual data-access functions live in src/lib/catalog.ts, which is
 * server-only — keep this file free of any Prisma/DB imports.
 */
export type CatalogVariant = {
  label: string;
  options: string[];
};

export type CatalogProduct = {
  id: string;
  brand: string;
  brandSlug: string;
  name: string;
  departmentSlug: string;
  price: number;
  currency: string;
  description: string;
  variants?: CatalogVariant[];
};
