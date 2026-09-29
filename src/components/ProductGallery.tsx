"use client";

import { useState } from "react";

const THUMBNAIL_COUNT = 3;

export function ProductGallery({ productName }: { productName: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <div
        className={`aspect-[4/5] w-full bg-eo-taupe transition-opacity duration-[var(--eo-duration)] ease-[var(--eo-ease)] ${
          selected % 2 === 1 ? "opacity-90" : "opacity-100"
        }`}
        role="img"
        aria-label={`${productName} — image ${selected + 1}`}
      />
      <div className="mt-4 flex gap-3">
        {Array.from({ length: THUMBNAIL_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`View image ${i + 1} of ${productName}`}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
            className={`h-20 w-16 shrink-0 border bg-eo-taupe transition-colors duration-[var(--eo-duration)] ease-[var(--eo-ease)] ${
              selected === i ? "border-eo-obsidian" : "border-eo-platinum"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
