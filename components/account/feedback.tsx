import Link from "next/link";
import { Database, Shirt } from "lucide-react";

export function DataUnavailable({ title = "Your account data is unavailable" }: { title?: string }) {
  return (
    <section className="account-state-panel account-state-error" role="alert">
      <span className="account-state-icon"><Database size={20} /></span>
      <h2>{title}</h2>
      <p>We couldn’t load your saved account records. We have not substituted demo data or changed any records.</p>
      <Link className="button button-outline" href="/">Try again</Link>
    </section>
  );
}

export function EmptyAccountState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section className="account-state-panel">
      <span className="account-state-icon"><Shirt size={20} /></span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button button-dark" href={actionHref}>{actionLabel}</Link>
    </section>
  );
}
