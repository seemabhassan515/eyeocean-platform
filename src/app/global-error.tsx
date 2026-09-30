"use client";

import { useEffect } from "react";

/**
 * Catches errors in the root layout itself (rare — layout.tsx has almost no
 * logic of its own). Replaces the ENTIRE document when triggered, so it
 * can't rely on globals.css/Tailwind having loaded — plain inline styles
 * only, deliberately dependency-free as a true last resort.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#1b3a2f",
          color: "#f5f1e8",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#d4af6a",
          }}
        >
          EYEOCEAN
        </p>
        <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 500 }}>
          Something went wrong
        </h1>
        <p style={{ marginTop: 12, color: "#a8a8a8", maxWidth: 400 }}>
          The site hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 24,
            padding: "12px 32px",
            backgroundColor: "#f5f1e8",
            color: "#1b3a2f",
            border: "none",
            fontSize: 11,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
