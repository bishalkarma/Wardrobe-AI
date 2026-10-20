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

const routeLabels: Record<string, string> = {
  "/": "A considered edit, every day",
  "/wardrobe": "Your pieces, in one place",
  "/outfits": "Looks made from your wardrobe",
  "/stylist": "A little inspiration, just for you",
  "/try-on": "See the look come together",
  "/profile": "Your style, your settings",
  "/profile/photo": "Profile photo settings",
};

export type AppShellMode = "demo" | "account";

function routeHref(path: string, mode: AppShellMode): string {
  if (mode !== "demo") return path;
  return path === "/" ? "/demo" : `/demo${path}`;
}

function BrandMark({ mode }: { mode: AppShellMode }) {
  return (
    <Link className="brand-lockup" href={routeHref("/", mode)} aria-label="Wardrobe AI home">
      <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
      <span className="brand-name">wardrobe<span>AI</span></span>
    </Link>
  );
}

function NavLinks({ pathname, mode, mobile = false }: { pathname: string; mode: AppShellMode; mobile?: boolean }) {
  const activePath = mode === "demo" ? pathname.replace(/^\/demo(?=\/|$)/, "") || "/" : pathname;
  return (
    <nav className={mobile ? "bottom-nav" : "side-nav"} aria-label={mode === "demo" ? "Demo navigation" : "Account navigation"}>
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? activePath === "/" : activePath === href || activePath.startsWith(`${href}/`);
        return (
          <Link key={href} href={routeHref(href, mode)} className={`nav-link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
            <Icon size={20} strokeWidth={active ? 2.1 : 1.7} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  children,
  mode,
  identity,
  signOutControl,
}: {
  children: ReactNode;
  mode: AppShellMode;
  identity?: string;
  signOutControl?: ReactNode;
}) {
  const pathname = usePathname();
  const activePath = mode === "demo" ? pathname.replace(/^\/demo(?=\/|$)/, "") || "/" : pathname;
  const caption = routeLabels[activePath] ?? "Your personal style edit";
  const isDemo = mode === "demo";
  const accountLabel = identity || "Account";
  const initials = accountLabel.trim().slice(0, 1).toUpperCase() || "A";

  return (
    <div className={`app-frame${isDemo ? " app-frame-demo" : ""}`}>
      <aside className="desktop-sidebar">
        <div className="sidebar-top">
          <BrandMark mode={mode} />
          <p className="sidebar-tagline">Your clothes.<br />Your style.</p>
          <NavLinks pathname={pathname} mode={mode} />
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="sidebar-note-icon"><Sparkles size={16} /></span>
            <div>
              <strong>{isDemo ? "Illustrative demo" : "Your account"}</strong>
              <span>{isDemo ? "Sample items; changes are temporary." : "Your account is ready. Wardrobe data is not connected yet."}</span>
            </div>
          </div>
          <Link href={routeHref("/profile", mode)} className="sidebar-profile">
            <span className="avatar avatar-small">{isDemo ? "D" : initials}</span>
            <span className="sidebar-profile-copy">
              <strong>{isDemo ? "Demo profile" : accountLabel}</strong>
              <small>{isDemo ? "Mock data · not an account" : "Signed-in account"}</small>
            </span>
            <span className="profile-dot" />
          </Link>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-brand"><BrandMark mode={mode} /></div>
          <div className="topbar-caption"><span className="topbar-overline">WARDROBE AI</span><span>{caption}</span></div>
          <div className="topbar-actions">
            {isDemo ? (
              <Link href="/welcome" className="demo-pill" aria-label="Return to Wardrobe AI welcome page"><span /> Demo · mock data</Link>
            ) : (
              <>
                {signOutControl}
                <Link className="avatar avatar-button" href="/profile" aria-label={`Open account for ${accountLabel}`}>{initials}</Link>
              </>
            )}
          </div>
        </header>
        {isDemo && <div className="demo-route-banner" role="note">DEMO · Illustrative sample data only · Changes are temporary and are not saved to your account.</div>}
        <main className="main-content">{children}</main>
        <NavLinks pathname={pathname} mode={mode} mobile />
      </div>
    </div>
  );
}
