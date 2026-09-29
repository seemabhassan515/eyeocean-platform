import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F0F0F",
          color: "#FBFBFB",
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#D4AF37",
            marginBottom: 28,
          }}
        >
          A Global Luxury Commerce Platform
        </div>
        <div
          style={{
            fontSize: 96,
            fontFamily: "serif",
            letterSpacing: 12,
          }}
        >
          EYEOCEAN
        </div>
      </div>
    ),
    { ...size }
  );
}
