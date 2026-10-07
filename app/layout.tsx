import type { Metadata } from "next";
import { Inter, Lexend_Deca } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter", display: "swap" });
const lexendDeca = Lexend_Deca({ subsets: ["latin"], weight: "400", variable: "--font-lexend-deca", display: "swap" });

export const metadata: Metadata = {
  title: "Stats preview card | Royer Adames",
  description: "A data analytics stats card built for the Frontend Mentor stats preview card challenge.",
  icons: { icon: "/images/favicon-32x32.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${lexendDeca.variable}`}><body>{children}</body></html>;
}
