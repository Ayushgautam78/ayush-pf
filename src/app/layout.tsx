import type { Metadata } from "next";
import { Manrope, Syne, Noto_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SingleSwordSystem } from "@/components/SingleSwordSystem";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Preloader } from "@/components/Preloader";
import { Cursor } from "@/components/Cursor";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Modern display face for headings; it carries real Greek glyphs too
const syne = Syne({
  variable: "--font-display",
  subsets: ["latin", "greek"],
  display: "swap",
});

// Classical serif, used sparingly: inscriptions, numerals and accent words
const notoSerifDisplay = Noto_Serif_Display({
  variable: "--font-greek",
  subsets: ["latin", "greek"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin", "greek"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayush Gautam | Creative Developer",
  description:
    "Creative developer building useful websites, tools, web applications and digital products. Portfolio of Ayush Gautam.",
  keywords: [
    "developer",
    "portfolio",
    "creative developer",
    "web development",
    "digital products",
    "Ayush Gautam",
  ],
  openGraph: {
    title: "Ayush Gautam | Creative Developer",
    description:
      "Creative developer building useful websites, tools, web applications and digital products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${syne.variable} ${notoSerifDisplay.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <SmoothScrollProvider>
          <Preloader />
          <SingleSwordSystem />
          <Cursor />
          <GrainOverlay />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
