"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, House, Shirt, Sparkles, UserRound } from "lucide-react";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Home", icon: House },
  { href: "/wardrobe", label: "Wardrobe", icon: Shirt },
  { href: "/outfits", label: "Outfits", icon: Bookmark },
  { href: "/stylist", label: "AI Stylist", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function BrandMark() {
  return (
    <Link className="brand-lockup" href="/" aria-label="Wardrobe AI home">
      <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
      <span className="brand-name">wardrobe<span>AI</span></span>
    </Link>
  );
}

function NavLinks({ pathname, mobile = false }: { pathname: string; mobile?: boolean }) {
  return (
    <nav className={mobile ? "bottom-nav" : "side-nav"} aria-label="Primary navigation">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={`nav-link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
            <Icon size={20} strokeWidth={active ? 2.1 : 1.7} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const routeLabels: Record<string, string> = {
  "/": "A considered edit, every day",
  "/wardrobe": "Your pieces, in one place",
  "/outfits": "Looks made from your wardrobe",
  "/stylist": "A little inspiration, just for you",
  "/try-on": "See the look come together",
  "/profile": "Your style, your settings",
  "/profile/photo": "Your photo, always yours",
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/welcome") return <>{children}</>;

  const caption = routeLabels[pathname] ?? "Your personal style edit";

  return (
    <div className="app-frame">
      <aside className="desktop-sidebar">
        <div className="sidebar-top">
          <BrandMark />
          <p className="sidebar-tagline">Your clothes.<br />Your style.</p>
          <NavLinks pathname={pathname} />
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="sidebar-note-icon"><Sparkles size={16} /></span>
            <div><strong>Made for your wardrobe</strong><span>Every look starts with what you own.</span></div>
          </div>
          <Link href="/profile" className="sidebar-profile">
            <span className="avatar avatar-small">M</span>
            <span className="sidebar-profile-copy"><strong>Maya Foster</strong><small>My style space</small></span>
            <span className="profile-dot" />
          </Link>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-brand"><BrandMark /></div>
          <div className="topbar-caption"><span className="topbar-overline">WARDROBE AI</span><span>{caption}</span></div>
          <div className="topbar-actions">
            <Link href="/welcome" className="demo-pill" aria-label="Open onboarding welcome screen"><span /> Prototype</Link>
            <Link className="avatar avatar-button" href="/profile" aria-label="Open profile">M</Link>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <NavLinks pathname={pathname} mobile />
      </div>
    </div>
  );
}
