"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { AuthForm, type AuthMode } from "@/components/auth/auth-form";
import { Modal } from "@/components/ui";

export type WelcomeNotice = {
  kind: "success" | "error";
  message: string;
};

export function WelcomeScreen({
  nextPath = "/",
  notice,
}: {
  nextPath?: string;
  notice?: WelcomeNotice;
}) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  return (
    <main className="welcome-page">
      <div className="welcome-topbar">
        <Link className="brand-lockup" href="/welcome" aria-label="Wardrobe AI welcome">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-name">wardrobe<span>AI</span></span>
        </Link>
        <span className="welcome-edition">A MORE PERSONAL WAY TO GET DRESSED</span>
      </div>
      <div className="welcome-grid">
        <section className="welcome-copy">
          <span className="welcome-overline"><span /> YOUR CLOSET, REIMAGINED</span>
          <h1>Your clothes.<br /><em>Your style.</em></h1>
          <p className="welcome-description">A wardrobe that knows what you own, and a stylist that helps you see it differently.</p>
          <ul className="welcome-points">
            <li><span><Sparkles size={14} /></span> Outfits from pieces you already own</li>
            <li><span><LockKeyhole size={14} /></span> Your wardrobe stays yours</li>
          </ul>
          <div className="welcome-actions">
            <button className="button button-dark button-large" type="button" onClick={() => openAuth("create")}>Get started <ArrowRight size={17} /></button>
            <button className="button button-quiet button-large" type="button" onClick={() => openAuth("sign-in")}>I already have an account</button>
          </div>
          {notice && <p className={`auth-message auth-message-${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>{notice.message}</p>}
          <p className="welcome-footnote">New accounts need email confirmation before sign-in.</p>
        </section>
        <section className="welcome-visual" aria-label="Wardrobe AI sample look">
          <Image src="/images/mock-outfit-editorial.jpg" alt="Illustrative look: an ivory linen shirt with olive trousers" fill priority sizes="(max-width: 760px) 100vw, 53vw" className="cover-image" />
          <div className="welcome-visual-shade" />
          <div className="welcome-visual-top"><span className="welcome-photo-label">THE WARDROBE EDIT</span><span className="welcome-photo-count">01 / 03</span></div>
          <div className="welcome-visual-caption"><span>01 — EVERYDAY, RECONSIDERED</span><p>One wardrobe.<br /><em>More ways to wear it.</em></p></div>
          <div className="welcome-visual-note"><span className="note-star"><Sparkles size={13} /></span> Your pieces, brought together.</div>
        </section>
      </div>
      <div className="welcome-bottom"><span>WARDROBE AI <i /> YOUR CLOTHES. YOUR STYLE.</span><Link href="/demo">Explore the labelled demo <ArrowRight size={14} /></Link></div>

      <Modal open={authOpen} onClose={() => setAuthOpen(false)} title={authMode === "sign-in" ? "Welcome back" : "Create your account"}>
        <div className="auth-tabs" role="tablist" aria-label="Account action">
          <button type="button" role="tab" aria-selected={authMode === "sign-in"} className={authMode === "sign-in" ? "is-active" : ""} onClick={() => setAuthMode("sign-in")}>Sign in</button>
          <button type="button" role="tab" aria-selected={authMode === "create"} className={authMode === "create" ? "is-active" : ""} onClick={() => setAuthMode("create")}>Create account</button>
        </div>
        <p className="modal-intro">{authMode === "sign-in" ? "Pick up where your style left off." : "Your account starts empty; the sample wardrobe stays in the demo."}</p>
        <AuthForm mode={authMode} nextPath={nextPath} />
      </Modal>
    </main>
  );
}
