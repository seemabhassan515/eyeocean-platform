"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeoceanMonogram } from "@/components/icons/eyeocean-marks";

const COLUMNS = [
  {
    heading: "EYEOCEAN",
    links: ["About", "Journal", "Careers", "Concierge"],
  },
  {
    heading: "Customer Care",
    links: ["Contact", "Shipping", "Returns", "FAQ"],
  },
  {
    heading: "Legal",
    links: ["Privacy", "Terms", "Cookies"],
  },
  {
    heading: "Discover",
    links: ["Designers", "Collections", "New Arrivals", "Editorial"],
  },
];

export function Footer() {
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("footer-email") as HTMLInputElement;
    if (!input.value.trim() || !input.checkValidity()) {
      setMessage("Please enter a valid email address.");
      return;
    }
    // No newsletter provider connected yet (see README) — nothing is stored.
    setMessage("Thank you. Newsletter service to be connected: this address was not stored.");
    form.reset();
  }

  return (
    <footer className="border-t border-eo-platinum bg-eo-ivory text-eo-obsidian">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-eo-grey">
                {col.heading}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) =>
                  link === "Designers" ? (
                    <li key={link}>
                      <Link
                        href="/brands"
                        className="text-sm text-eo-obsidian/80 hover:text-eo-obsidian"
                      >
                        {link}
                      </Link>
                    </li>
                  ) : (
                    <li key={link}>
                      <button
                        type="button"
                        className="text-sm text-eo-obsidian/80 hover:text-eo-obsidian"
                      >
                        {link}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-8 border-t border-eo-platinum pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.12em] text-eo-grey">
            <span>United Arab Emirates</span>
            <span>AED</span>
            <span>English</span>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-2 sm:w-auto">
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-3 border-b border-eo-obsidian pb-2"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                name="footer-email"
                type="email"
                placeholder="Newsletter — your email"
                className="w-full bg-transparent text-sm placeholder:text-eo-grey outline-none focus-visible:[outline:2px_solid_var(--eo-obsidian)] focus-visible:outline-offset-2"
              />
              <button
                type="submit"
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-eo-obsidian"
              >
                Join
              </button>
            </form>
            {message && (
              <p role="status" className="text-xs text-eo-grey">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <EyeoceanMonogram className="h-6 w-6 text-eo-obsidian" />
          <p className="text-[11px] text-eo-grey">
            © {new Date().getFullYear()} EYEOCEAN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
