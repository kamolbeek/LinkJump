import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkJump — Smart Redirect Links",
  description:
    "Transform any social media URL into a smart redirect link that opens in the native app instead of an in-app browser. Support for YouTube, Instagram, TikTok, Twitter and more.",
  keywords: ["link redirect", "smart link", "social media", "deep link", "URL shortener"],
  openGraph: {
    title: "LinkJump — Smart Redirect Links",
    description: "Transform any social media URL into a smart redirect link that opens in the native app instead of an in-app browser.",
    type: "website",
    url: "https://www.linkjumpuz.com",
    images: [
      {
        url: "https://www.linkjumpuz.com/og-image.png",
        width: 1200,
        height: 1200,
        alt: "LinkJump Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkJump — Smart Redirect Links",
    description: "Transform any social media URL into a smart redirect link that opens in the native app instead of an in-app browser.",
    images: ["https://www.linkjumpuz.com/og-image.png"],
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
