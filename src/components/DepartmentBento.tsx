import Link from "next/link";

const TILES = [
  { label: "High Jewelry", slug: "jewelry", span: "col-span-2 row-span-2", tone: "bg-eo-obsidian text-eo-ivory" },
  { label: "Technology & Living", slug: "technology", span: "col-span-2 row-span-2", tone: "bg-eo-taupe text-eo-obsidian" },
  { label: "Designer Fashion", slug: "fashion", span: "col-span-1 row-span-1", tone: "bg-eo-platinum text-eo-obsidian" },
  { label: "Beauty & Wellness", slug: "beauty", span: "col-span-1 row-span-1", tone: "bg-eo-obsidian text-eo-ivory" },
  { label: "Art & Collectibles", slug: "art", span: "col-span-1 row-span-1", tone: "bg-eo-taupe text-eo-obsidian" },
  { label: "Lifestyle", slug: "lifestyle", span: "col-span-1 row-span-1", tone: "bg-eo-platinum text-eo-obsidian" },
];

export function DepartmentBento() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 lg:px-8" id="collections">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-champagne-text">
        Curated Departments
      </p>
      <h2 className="mt-3 text-heading font-display font-medium">
        Explore the Collections
      </h2>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-3">
        {TILES.map((tile) => (
          <Link
            key={tile.label}
            href={`/category/${tile.slug}`}
            className={`group relative flex aspect-[4/5] items-end overflow-hidden p-6 text-left lg:aspect-auto ${tile.span} ${tile.tone}`}
          >
            <span className="text-sm font-medium uppercase tracking-[0.12em] transition-transform duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:-translate-y-1">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
