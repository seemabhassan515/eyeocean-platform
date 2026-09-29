/**
 * Pushes the product catalog from Postgres into Meilisearch and configures
 * index settings.
 * Run with: npm run seed:search
 */
import { config } from "dotenv";
import { MeiliSearch } from "meilisearch";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });

const PRODUCTS_INDEX = "products";

const prisma = new PrismaClient();

async function main() {
  const host = process.env.MEILI_HOST;
  const apiKey = process.env.MEILI_API_KEY;
  if (!host || !apiKey) {
    console.error(
      "MEILI_HOST and MEILI_API_KEY must be set (check .env.local) before seeding."
    );
    process.exit(1);
  }

  const products = await prisma.product.findMany({
    include: { brand: true, category: true },
  });

  const documents = products.map((product) => ({
    id: product.slug,
    brand: product.brand.name,
    name: product.name,
    departmentSlug: product.category.slug,
    price: product.price,
    currency: product.currencyCode,
    description: product.description,
  }));

  const client = new MeiliSearch({ host, apiKey });

  const index = client.index(PRODUCTS_INDEX);
  await index.updateSettings({
    searchableAttributes: ["name", "brand", "description"],
    filterableAttributes: ["departmentSlug"],
    sortableAttributes: ["price"],
  });

  const task = await index.addDocuments(documents, { primaryKey: "id" });
  await client.tasks.waitForTask(task.taskUid);

  console.log(`Seeded ${documents.length} products into index "${PRODUCTS_INDEX}".`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
