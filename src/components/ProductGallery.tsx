"use client";

import { useState } from "react";
import Image from "next/image";
import { getDemoImage } from "@/lib/demo-images";

const THUMBNAIL_COUNT = 3;

export function ProductGallery({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [selected, setSelected] = useState(0);
  const images = Array.from({ length: THUMBNAIL_COUNT }, (_, i) =>
    getDemoImage(i === 0 ? productId : `${productId}-${i + 1}`)
  );

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-eo-sm bg-eo-taupe">
        <Image
          key={selected}
          src={images[selected]}
          alt={`${productName} — image ${selected + 1} of ${THUMBNAIL_COUNT}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="mt-4 flex gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            aria-label={`View image ${i + 1} of ${productName}`}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
            className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-eo-sm border transition-colors duration-[var(--eo-duration)] ease-[var(--eo-ease)] ${
              selected === i ? "border-eo-obsidian" : "border-eo-platinum"
            }`}
          >
            <Image src={src} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
