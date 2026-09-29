"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { EyeoceanMonogram } from "@/components/icons/eyeocean-marks";

export function Hero() {
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (markRef.current) {
          markRef.current.style.transform = `translateY(calc(-50% + ${(-y * 0.08).toFixed(1)}px))`;
        }
        ticking = false;
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-eo-obsidian text-eo-ivory">
      <div
        ref={markRef}
        className="absolute right-[-8%] top-1/2 h-[70vh] w-[70vh] -translate-y-1/2"
      >
        <EyeoceanMonogram decorative className="pointer-events-none h-full w-full text-eo-ivory/[0.05]" />
      </div>
      <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-20 pt-40 lg:px-8 lg:pb-28">
        <p className="text-eyebrow font-medium uppercase tracking-[0.16em] text-eo-champagne">
          A Global Luxury Commerce Platform
        </p>
        <h1 className="mt-6 max-w-4xl text-display font-display font-medium tracking-[-0.01em]">
          Curated Excellence
        </h1>
        <p className="mt-8 max-w-md text-[15px] leading-7 text-eo-ivory/70">
          Discover exceptional fashion, objects, technology and craftsmanship,
          selected for a global audience.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button as="a" href="#collections" variant="primary" className="!bg-eo-ivory !text-eo-obsidian hover:!bg-eo-white">
            Explore Collections
          </Button>
          <Button
            as="a"
            href="#new-arrivals"
            variant="secondary"
            className="!border-eo-ivory/40 !text-eo-ivory hover:!bg-eo-ivory hover:!text-eo-obsidian"
          >
            Discover New Arrivals
          </Button>
        </div>
      </div>
    </section>
  );
}
