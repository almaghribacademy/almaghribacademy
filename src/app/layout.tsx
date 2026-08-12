import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Al Furqan Academy",
  description:
    "Online Quran Classes, Islamic Studies, Tajweed, Hifz and Arabic Language Programs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}