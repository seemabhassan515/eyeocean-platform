import "server-only";
import { MeiliSearch } from "meilisearch";

export const PRODUCTS_INDEX = "products";

let client: MeiliSearch | null = null;

/**
 * Server-only Meilisearch client. The host and API key never reach the
 * browser — the frontend talks to /api/search instead (see
 * src/app/api/search/route.ts), which is the only thing that imports this file.
 */
export function getMeiliClient(): MeiliSearch {
  if (client) return client;

  const host = process.env.MEILI_HOST;
  const apiKey = process.env.MEILI_API_KEY;
  if (!host || !apiKey) {
    throw new Error(
      "MEILI_HOST and MEILI_API_KEY must be set (see .env.example) to use Meilisearch."
    );
  }

  client = new MeiliSearch({ host, apiKey });
  return client;
}
