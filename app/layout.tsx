// app/(public)/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

// ✅ METADATA: Only for SEO (title, description, Open Graph, etc.)
export const metadata: Metadata = {
  title: "Online Quran Classes | Learn with Expert Tutors at AlMaghrib Academy",
  description:
    "Join our flexible, personalized Quran classes online. Expert tutors help you master Tajweed and memorization. Start your free trial at AlMaghrib Academy today.",
  keywords:
    "Learn Quran Online, Quran Classes Academy, Learn Quran Online with Tajweed, Online Quran Classes, Quran Memorization, Tajweed Course, Islamic Studies Online, AlMaghrib Academy",

  metadataBase: new URL("https://www.AlMaghribacademy.co"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Online Quran Classes | Learn with Expert Tutors at AlMaghrib Academy",
    description:
      "Join our flexible, personalized Quran classes online. Expert tutors help you master Tajweed and memorization. Start your free trial at AlMaghrib Academy today.",
    url: "https://www.AlMaghribacademy.co",
    siteName: "AlMaghrib Academy",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    site: "@AlMaghribAcademy",
    creator: "@AlMaghribAcademy",
    title: "Online Quran Classes | Learn with Expert Tutors at AlMaghrib Academy",
    description:
      "Join our flexible, personalized Quran classes online. Expert tutors help you master Tajweed and memorization. Start your free trial at AlMaghrib Academy today.",
  },

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

  verification: {
    google: "your-google-site-verification-code",
  },

  authors: [{ name: "AlMaghrib Academy" }],
  publisher: "AlMaghrib Academy",
  category: "education",
  classification: "Islamic Education, Online Learning",

  applicationName: "AlMaghrib Academy",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
    url: true,
  },

  appleWebApp: {
    capable: true,
    title: "AlMaghrib Academy",
    statusBarStyle: "default",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2d6a4f",
      },
    ],
  },

  // ❌ REMOVE: manifest, viewport, themeColor from here!
  // manifest: "/manifest.json",  // DELETE this line

  other: {
    "msapplication-TileColor": "#2d6a4f",
    "msapplication-config": "/browserconfig.xml",
  },
};

// ✅ VIEWPORT: Mobile and theme settings (separate export)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}