import type { Metadata } from "next";
import { Inter, Lexend_Deca } from "next/font/google";
import "./globals.css";

// Fonts aren't preloaded: text paints at once in next/font's size-matched fallback (display: swap), so the
// font files needn't compete with the first paint.
const inter = Inter({ preload: false, subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter", display: "swap" });
const lexendDeca = Lexend_Deca({ preload: false, subsets: ["latin"], weight: "400", variable: "--font-lexend-deca", display: "swap" });

const siteName = "Stats preview card";
const siteUrl = "https://stats-preview-card-component-fm.royeradames.com/";
const title = "Stats preview card | Royer Adames";
const description = "A data analytics card with three headline stats, rebuilt from the Frontend Mentor stats preview card design.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/images/favicon-32x32.png" },
  openGraph: { type: "website", siteName, title, description, url: siteUrl },
};

const webSite = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${lexendDeca.variable}`}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }} /></body></html>;
}
