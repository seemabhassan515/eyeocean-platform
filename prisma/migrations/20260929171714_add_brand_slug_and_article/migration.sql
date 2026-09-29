-- AlterTable: add nullable columns first (Brand has existing rows)
ALTER TABLE "Brand" ADD COLUMN     "description" TEXT,
ADD COLUMN     "slug" TEXT;

-- Backfill slug from name for existing rows
UPDATE "Brand" SET "slug" = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'));

-- Now enforce NOT NULL + unique
ALTER TABLE "Brand" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
