import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // picsum.photos serves stable, real stock photography for design
    // evaluation only — see src/lib/demo-images.ts. design-refresh branch
    // only; do not merge this into main without swapping in real product
    // photography and a matching data model change.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  async headers() {
    return [
      {
        // Applies to every route. Stripe Checkout is a separate top-level
        // navigation (redirect), not an iframe, so these don't interfere
        // with it; Stripe's own webhook calls aren't affected by response
        // headers we send back to browsers.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
