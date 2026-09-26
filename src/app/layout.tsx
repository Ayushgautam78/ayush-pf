import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SingleSwordSystem } from "@/components/SingleSwordSystem";
import { GrainOverlay } from "@/components/GrainOverlay";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
    <html lang="en" className={`${inter.variable} ${cinzel.variable} antialiased`}>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden">
        <SmoothScrollProvider>
          <SingleSwordSystem />
          <GrainOverlay />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
