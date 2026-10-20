import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export function AuthFlowPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-flow-page">
      <div className="auth-flow-topbar">
        <Link className="brand-lockup" href="/welcome" aria-label="Wardrobe AI welcome">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-name">wardrobe<span>AI</span></span>
        </Link>
        <span className="welcome-edition">ACCOUNT ACCESS</span>
      </div>
      <section className="auth-flow-card">
        <Link className="back-link auth-flow-back" href="/welcome"><ArrowLeft size={15} /> Back to sign in</Link>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-subtitle">{description}</p>
        {children}
      </section>
      <p className="auth-flow-footer">WARDROBE AI <i /> PRIVATE ACCOUNT ACCESS</p>
    </main>
  );
}
