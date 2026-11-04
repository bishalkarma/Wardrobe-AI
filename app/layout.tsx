import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="wardrobe-theme-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("wardrobe-ai-theme");t=t==="light"||t==="dark"?t:"system";var d=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;var s=t==="light"||t==="system"&&!d?"light":"dark";document.documentElement.dataset.theme=t;document.documentElement.dataset.colorScheme=s;var c=document.querySelector('meta[name="theme-color"]');if(c)c.content=s==="dark"?"#090b11":"#f5f7fb"}catch(e){document.documentElement.dataset.theme="system";document.documentElement.dataset.colorScheme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
