/**
 * Shared site-wide constants for metadata/SEO (Phase 10). Safe to import
 * from client or server code — no secrets here, just public config.
 */
export const SITE_NAME = "EYEOCEAN";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100").replace(
  /\/$/,
  ""
);

export const SITE_DESCRIPTION =
  "Discover exceptional fashion, objects, technology and craftsmanship, selected for a global audience.";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
