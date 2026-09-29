/**
 * Seeds Postgres with the same placeholder catalog the app used in Phase 2-5
 * (mock-catalog.ts). Run with: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEPARTMENTS = [
  { label: "Fashion", slug: "fashion" },
  { label: "Jewelry", slug: "jewelry" },
  { label: "Beauty & Wellness", slug: "beauty" },
  { label: "Technology & Living", slug: "technology" },
  { label: "Art & Collectibles", slug: "art" },
  { label: "Lifestyle", slug: "lifestyle" },
];

const PLACEHOLDER_IMAGE_HEX = "#E8E3DD"; // matches --eo-taupe; no real photography yet

const BRANDS = [
  {
    name: "Selected Designer",
    slug: "selected-designer",
    description: "A rotating edit of ready-to-wear from names shaping the current season.",
  },
  {
    name: "Maison Atelier",
    slug: "maison-atelier",
    description: "Fine jewelry and watchmaking from a house built on archive craftsmanship.",
  },
  {
    name: "Studio Object",
    slug: "studio-object",
    description: "Functional design objects for the home, each produced in small runs.",
  },
  {
    name: "Atelier Noir",
    slug: "atelier-noir",
    description: "Considered leather goods and tailoring, built for daily use.",
  },
  {
    name: "Studio Bloom",
    slug: "studio-bloom",
    description: "Botanical skincare formulated with restraint.",
  },
  {
    name: "Form & Object",
    slug: "form-object",
    description: "Hand-thrown ceramics and sculptural objects from a single studio.",
  },
  {
    name: "Passage",
    slug: "passage",
    description: "Travel essentials designed for the journey, not just the arrival.",
  },
];

const ARTICLES = [
  {
    slug: "objects-designed-to-last",
    title: "Objects Designed to Last",
    category: "Design",
    excerpt: "On the quiet discipline of making things meant to outlive a season.",
    body: `There is a particular kind of restraint in objects built to be used for decades rather than admired for a season. It shows up first in material choice — solid wood over veneer, full-grain leather over coated composites, glass blown by hand rather than pressed by machine — and then in the small decisions that follow: a seam reinforced where it will actually bear weight, a hinge sized for ten thousand openings instead of a hundred.

None of this is visible in a product photograph. It only becomes apparent in use, which is precisely the point. A well-made object does not announce its own durability; it simply keeps working long after a lesser version would have failed, and eventually that quiet reliability becomes its own kind of luxury.

This is the standard we hold the objects in our Technology & Living department to, and it is why so many of them come from small studios rather than large manufacturers. Scale and permanence are not always compatible goals.`,
  },
  {
    slug: "inside-the-world-of-fine-timepieces",
    title: "Inside the World of Fine Timepieces",
    category: "Watches",
    excerpt: "What separates an archive reissue from a simple reproduction.",
    body: `A reissued watch is not the same thing as a reproduction. A reproduction copies a design; a reissue interprets it, carrying forward the proportions and details that made the original worth remembering while making the quiet adjustments — movement, water resistance, case finishing — that a modern owner expects but a vintage buyer would never think to ask for.

The best archive pieces make that interpretation invisible. Held next to the original, a well-executed reissue should feel like a continuation rather than a departure: the same case geometry, the same dial hierarchy, the same restraint in what is and isn't printed on the face.

Getting that balance right takes longer than designing something new. It requires deciding, piece by piece, what was essential to the original and what was simply a limitation of the era it was made in — and having the discipline to change only the latter.`,
  },
  {
    slug: "the-architecture-of-contemporary-luxury",
    title: "The Architecture of Contemporary Luxury",
    category: "Culture",
    excerpt: "Why restraint, not abundance, is what luxury looks like now.",
    body: `For most of the last century, luxury signaled itself loudly — through scale, ornamentation, and visible cost. That language is fading. What has replaced it is quieter and, in some ways, harder to achieve: proportion, material honesty, and the absence of anything unnecessary.

This shift shows up in architecture before it shows up anywhere else, which is why it's worth looking at buildings to understand where objects and fashion are heading. A well-proportioned room does not need decoration to feel considered. A well-cut coat does not need branding to read as expensive. The confidence is in the restraint itself.

We think about EYEOCEAN's own visual language the same way — fewer signals, chosen carefully, rather than many signals competing for attention. It's a harder brief to design against than abundance, but it tends to age better.`,
  },
  {
    slug: "the-new-language-of-modern-craft",
    title: "The New Language of Modern Craft",
    category: "Design",
    excerpt: "How small studios are redefining what handmade means at scale.",
    body: `"Handmade" used to imply a tradeoff: more character, less consistency. That tradeoff is disappearing. A new generation of studios is combining traditional techniques — hand-glazing, hand-stitching, hand-finishing — with enough process discipline that each piece is genuinely unique without being genuinely unpredictable.

The result is a category that didn't quite exist a generation ago: objects with the warmth of craft and the reliability of manufacturing. A ceramic vase where every glaze result is different, but every vase is still structurally the same. A leather bag where the grain varies piece to piece, but the stitching tolerance does not.

It's a more interesting way to work, and a harder one — it asks a studio to be disciplined about the parts that matter and permissive about the parts that don't. The studios we carry have made that distinction their whole practice.`,
  },
];

const PRODUCTS = [
  {
    slug: "p1",
    brand: "Selected Designer",
    name: "Structured Wool Coat",
    departmentSlug: "fashion",
    price: 8200,
    description:
      "A tailored silhouette in double-faced wool, cut for a considered, architectural line.",
    variants: [{ label: "Size", options: ["XS", "S", "M", "L"] }],
  },
  {
    slug: "p2",
    brand: "Maison Atelier",
    name: "Fine Diamond Pendant",
    departmentSlug: "jewelry",
    price: 24500,
    description:
      "A solitaire pendant in 18k gold, set with a hand-selected diamond of exceptional clarity.",
    variants: [{ label: "Metal", options: ["Yellow Gold", "White Gold", "Rose Gold"] }],
  },
  {
    slug: "p3",
    brand: "Studio Object",
    name: "Hand-Blown Table Lamp",
    departmentSlug: "technology",
    price: 3100,
    description: "A sculptural lamp in hand-blown glass, each piece subtly unique.",
    variants: [],
  },
  {
    slug: "p4",
    brand: "Atelier Noir",
    name: "Silk Tailored Blazer",
    departmentSlug: "fashion",
    price: 6400,
    description: "A single-breasted blazer in mulberry silk, finished with horn buttons.",
    variants: [{ label: "Size", options: ["XS", "S", "M", "L"] }],
  },
  {
    slug: "p5",
    brand: "Maison Atelier",
    name: "Archive Chronograph",
    departmentSlug: "jewelry",
    price: 38900,
    description: "A chronograph from the house archive, reissued in a limited run.",
    variants: [{ label: "Strap", options: ["Steel", "Leather"] }],
  },
  {
    slug: "p6",
    brand: "Studio Bloom",
    name: "Restorative Facial Oil",
    departmentSlug: "beauty",
    price: 780,
    description: "A restorative facial oil formulated with botanical extracts.",
    variants: [],
  },
  {
    slug: "p7",
    brand: "Form & Object",
    name: "Sculptural Ceramic Vase",
    departmentSlug: "art",
    price: 4200,
    description: "A hand-thrown ceramic vase, glazed in a limited seasonal finish.",
    variants: [],
  },
  {
    slug: "p8",
    brand: "Atelier Noir",
    name: "Leather Weekender Bag",
    departmentSlug: "fashion",
    price: 5600,
    description: "A weekender in full-grain leather, built to travel and to last.",
    variants: [{ label: "Color", options: ["Charcoal", "Cognac"] }],
  },
  {
    slug: "p9",
    brand: "Passage",
    name: "Cashmere Travel Wrap",
    departmentSlug: "lifestyle",
    price: 1900,
    description: "A featherweight cashmere wrap, designed for the journey and the arrival.",
    variants: [],
  },
  {
    slug: "p10",
    brand: "Studio Object",
    name: "Walnut Occasional Table",
    departmentSlug: "technology",
    price: 7200,
    description: "A small occasional table in solid walnut, finished by hand.",
    variants: [],
  },
];

async function main() {
  await prisma.currency.upsert({
    where: { code: "AED" },
    update: {},
    create: { code: "AED", symbol: "AED" },
  });

  for (const dept of DEPARTMENTS) {
    await prisma.category.upsert({
      where: { slug: dept.slug },
      update: { label: dept.label },
      create: { slug: dept.slug, label: dept.label },
    });
  }

  for (const brand of BRANDS) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: { slug: brand.slug, description: brand.description },
      create: brand,
    });
  }

  for (const article of ARTICLES) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  for (const p of PRODUCTS) {
    const brand = await prisma.brand.findUniqueOrThrow({ where: { name: p.brand } });
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: p.departmentSlug } });

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        currencyCode: "AED",
        brandId: brand.id,
        categoryId: category.id,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        currencyCode: "AED",
        brandId: brand.id,
        categoryId: category.id,
      },
    });

    // Reset child rows so re-running the seed is idempotent.
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productOptionGroup.deleteMany({ where: { productId: product.id } });

    await prisma.productImage.createMany({
      data: [0, 1, 2].map((position) => ({
        productId: product.id,
        position,
        colorHex: PLACEHOLDER_IMAGE_HEX,
      })),
    });

    for (const [groupIndex, variant] of p.variants.entries()) {
      await prisma.productOptionGroup.create({
        data: {
          productId: product.id,
          label: variant.label,
          position: groupIndex,
          values: {
            create: variant.options.map((value, position) => ({ value, position })),
          },
        },
      });
    }
  }

  console.log(
    `Seeded ${PRODUCTS.length} products across ${DEPARTMENTS.length} departments, ${BRANDS.length} brands, and ${ARTICLES.length} articles.`
  );
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
