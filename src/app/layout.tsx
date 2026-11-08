import type { Metadata } from "next";
import { Manrope, Marcellus, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SingleSwordSystem } from "@/components/SingleSwordSystem";
import { GrainOverlay } from "@/components/GrainOverlay";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const marcellus = Marcellus({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
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
    <html lang="en" className={`${manrope.variable} ${marcellus.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <SmoothScrollProvider>
          <SingleSwordSystem />
          <GrainOverlay />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
