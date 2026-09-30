import Link from "next/link";
import Image from "next/image";
import { getDemoImage } from "@/lib/demo-images";

const TILES = [
  { label: "High Jewelry", slug: "jewelry", span: "col-span-2 row-span-2" },
  { label: "Technology & Living", slug: "technology", span: "col-span-2 row-span-2" },
  { label: "Designer Fashion", slug: "fashion", span: "col-span-1 row-span-1" },
  { label: "Beauty & Wellness", slug: "beauty", span: "col-span-1 row-span-1" },
  { label: "Art & Collectibles", slug: "art", span: "col-span-1 row-span-1" },
  { label: "Lifestyle", slug: "lifestyle", span: "col-span-1 row-span-1" },
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
            className={`group relative flex aspect-[4/5] items-end overflow-hidden rounded-eo-sm p-6 text-left lg:aspect-auto ${tile.span}`}
          >
            <Image
              src={getDemoImage(`department-${tile.slug}`, 900, 900)}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
            <span className="relative text-sm font-medium uppercase tracking-[0.12em] text-white transition-transform duration-[var(--eo-duration)] ease-[var(--eo-ease)] group-hover:-translate-y-1">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
