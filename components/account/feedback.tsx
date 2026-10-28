import Link from "next/link";
import { AlertCircle, CheckCircle2, Database, Shirt } from "lucide-react";

const notices: Record<string, string> = {
  "profile-saved": "Your profile and style preferences have been saved.",
  "item-added": "Your piece has been added to your private wardrobe.",
  "item-updated": "Your clothing details have been updated.",
  "item-state-saved": "Your favorite setting has been updated.",
  "item-archived": "Your piece was deleted from the active wardrobe and moved to the recoverable archive.",
  "items-deleted": "Selected pieces were deleted from the active wardrobe and moved to the recoverable archive.",
  "item-restored": "Your piece has been restored to your wardrobe.",
  "outfit-added": "Your outfit has been saved to your account.",
  "outfit-updated": "Your outfit has been updated.",
  "outfit-archived": "Your outfit was deleted from active lists and moved to the recoverable archive.",
  "outfit-restored": "Your outfit has been restored.",
  "outfit-state-saved": "Your outfit preferences have been updated.",
};

const errors: Record<string, string> = {
  invalid: "Please check the highlighted fields and try again.",
  save: "We couldn’t save that change. Please try again.",
  missing: "That record is no longer available in your account.",
  items: "Choose active pieces from your own wardrobe and try again.",
  selection: "Select at least one wardrobe piece to delete.",
  "selection-limit": "Delete up to 500 pieces at a time. Clear your selection and try again.",
  unavailable: "Your account data is temporarily unavailable. Your records have not been changed.",
};

export function ActionFeedback({ notice, error }: { notice?: string; error?: string }) {
  if (error && errors[error]) {
    return <p className="data-feedback data-feedback-error" role="alert"><AlertCircle size={17} />{errors[error]}</p>;
  }
  if (notice && notices[notice]) {
    return <p className="data-feedback data-feedback-success" role="status"><CheckCircle2 size={17} />{notices[notice]}</p>;
  }
  return null;
}

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
