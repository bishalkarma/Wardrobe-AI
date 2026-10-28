import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wardrobe AI — Your Clothes. Your Style.",
    template: "%s · Wardrobe AI",
  },
  description: "A personal wardrobe, thoughtfully styled around the clothes you already own.",
  applicationName: "Wardrobe AI",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Wardrobe AI", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#090b11",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
