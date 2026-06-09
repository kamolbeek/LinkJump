import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkJump — Smart Redirect Links",
  description:
    "Transform any social media URL into a smart redirect link that opens in the native app instead of an in-app browser. Support for YouTube, Instagram, TikTok, Twitter and more.",
  keywords: ["link redirect", "smart link", "social media", "deep link", "URL shortener"],
  openGraph: {
    title: "LinkJump — Smart Redirect Links",
    description: "Open links in native apps, not in-app browsers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
