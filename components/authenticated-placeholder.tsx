import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";

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
        <h2>Your account is ready</h2>
        <p>This account starts empty. Wardrobe and outfit saving will be added in a later stage. The sample garments and looks are available only in the separate demo.</p>
        <Link className="button button-dark" href="/demo">Explore the labelled demo <ArrowUpRight size={15} /></Link>
      </section>
    </div>
  );
}
