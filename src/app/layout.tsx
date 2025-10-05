import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Analytics from "@/components/Analytics";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";
import { seoConfig } from "@/config/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "All Apps Free - Games & Tools",
  description: "Discover amazing games and useful tools. Everything you need, completely free. Play games, use utilities, and explore our collection of free online tools.",
  keywords: ["free games", "online tools", "utilities", "apps", "games", "free software"],
  authors: [{ name: "All Apps Free" }],
  creator: "All Apps Free",
  publisher: "All Apps Free",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://allappsfree.com",
    title: "All Apps Free - Games & Tools",
    description: "Discover amazing games and useful tools. Everything you need, completely free.",
    siteName: "All Apps Free",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Apps Free - Games & Tools",
    description: "Discover amazing games and useful tools. Everything you need, completely free.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData type="website" />
        {seoConfig.verification.google && (
          <meta name="google-site-verification" content={seoConfig.verification.google} />
        )}
        {seoConfig.verification.bing && (
          <meta name="msvalidate.01" content={seoConfig.verification.bing} />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
