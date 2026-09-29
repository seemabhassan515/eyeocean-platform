import { ImageResponse } from "next/og";
import { findProductBySlug } from "@/lib/catalog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);

  const title = product ? `${product.brand} — ${product.name}` : "EYEOCEAN";
  const price = product ? `${product.currency} ${product.price.toLocaleString("en-AE")}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0F0F0F",
          color: "#FBFBFB",
        }}
      >
        <div style={{ width: "42%", height: "100%", backgroundColor: "#E8E3DD", display: "flex" }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#D4AF37",
              marginBottom: 20,
            }}
          >
            EYEOCEAN
          </div>
          <div style={{ fontSize: 48, fontFamily: "serif", marginBottom: 16, maxWidth: 600 }}>
            {title}
          </div>
          {price && <div style={{ fontSize: 28, color: "#8A8A8A" }}>{price}</div>}
        </div>
      </div>
    ),
    { ...size }
  );
}
