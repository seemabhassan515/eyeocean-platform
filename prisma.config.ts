import path from "node:path";
import "dotenv/config";
import { defineConfig } from "prisma/config";

// Replaces the deprecated `package.json#prisma` config block.
// See https://pris.ly/prisma-config for the migration guide.
// Prisma config files don't auto-load .env like the old CLI did — we load it
// explicitly here so `DATABASE_URL` is available to `prisma migrate`/`db seed`.
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
