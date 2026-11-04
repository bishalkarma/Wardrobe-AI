import Link from "next/link";
import { ArrowRight, ArrowUpRight, LockKeyhole } from "lucide-react";

export function AuthenticatedPlaceholder({
  eyebrow,
  title,
  description,
  successNotice,
}: {
  eyebrow: string;
  title: string;
  description: string;
  successNotice?: string;
}) {
  return (
    <div className="page-stack authenticated-placeholder">
      {successNotice && <p className="auth-message auth-message-success" role="status">{successNotice}</p>}
      <div className="page-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-subtitle">{description}</p>
        </div>
      </div>
      <section className="empty-state account-empty-state">
        <span className="empty-state-icon"><LockKeyhole size={20} /></span>
        <h2>This feature is coming later</h2>
        <p>Your account can now store your profile, wardrobe pieces, and saved outfits. This feature is not connected yet; no AI provider or personal-photo upload is running here.</p>
        <div className="placeholder-actions">
          <Link className="button button-dark" href="/wardrobe">Open your wardrobe <ArrowRight size={15} /></Link>
          <Link className="text-link" href="/demo">See the separately labelled demo <ArrowUpRight size={14} /></Link>
        </div>
      </section>
    </div>
  );
}
