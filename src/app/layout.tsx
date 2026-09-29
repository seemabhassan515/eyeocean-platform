import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ShellProvider } from "@/lib/shell-context";
import { OverlayRoot } from "@/components/OverlayRoot";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — A Global Luxury Commerce Platform`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — A Global Luxury Commerce Platform`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — A Global Luxury Commerce Platform`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-eo-ivory font-sans text-eo-obsidian">
        <ShellProvider>
          <div className="bg-eo-obsidian px-6 py-2 text-center text-[11px] uppercase tracking-[0.12em] text-eo-ivory/70">
            Preview build — product data, search and checkout are placeholders, not live.
          </div>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <OverlayRoot />
        </ShellProvider>
      </body>
    </html>
  );
}
