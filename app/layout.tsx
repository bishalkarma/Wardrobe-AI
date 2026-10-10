import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import { PrototypeProvider } from "@/components/prototype-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wardrobe AI — Your Clothes. Your Style.",
    template: "%s · Wardrobe AI",
  },
  description: "A personal wardrobe, thoughtfully styled around the clothes you already own.",
  applicationName: "Wardrobe AI",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Wardrobe AI", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5f0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PrototypeProvider>
          <AppShell>{children}</AppShell>
        </PrototypeProvider>
      </body>
    </html>
  );
}
