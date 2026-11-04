"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const notices: Record<string, string> = {
  "profile-saved": "Your profile and style preferences have been saved.",
  "item-added": "Your piece has been added to your private wardrobe.",
  "item-updated": "Your clothing details have been updated.",
  "item-state-saved": "Your favorite setting has been updated.",
  "item-archived": "Your piece moved to Archive. You can restore it later; outfit links stay intact.",
  "items-deleted": "Selected pieces moved to Archive. You can restore them later; outfit links stay intact.",
  "items-restored": "Your selected pieces are back in the active wardrobe.",
  "items-permanently-deleted": "Selected archived pieces were permanently deleted and removed from linked outfits.",
  "item-restored": "Your piece has been restored to your wardrobe.",
  "item-permanently-deleted": "The archived piece was permanently deleted and removed from its linked outfits.",
  "outfit-added": "Your outfit has been saved to your account.",
  "outfit-permanently-deleted": "The archived outfit and its piece links were permanently deleted.",
  "outfit-updated": "Your outfit has been updated.",
  "outfit-archived": "Your outfit moved to Archive. You can restore it later.",
  "outfit-restored": "Your outfit has been restored.",
  "outfit-state-saved": "Your outfit preferences have been updated.",
};

const errors: Record<string, string> = {
  invalid: "Please check the highlighted fields and try again.",
  save: "We couldn’t save that change. Please try again.",
  missing: "That record is no longer available in your account.",
  items: "Choose active pieces from your own wardrobe and try again.",
  selection: "Select at least one wardrobe piece to continue.",
  "selection-limit": "Choose up to 500 pieces at a time. Clear your selection and try again.",
  "archived-selection": "Only pieces already in your Archive can be restored or permanently deleted.",
  "permanent-delete": "We couldn’t permanently delete that archived record. It remains in your Archive.",
  unavailable: "Your account data is temporarily unavailable. Your records have not been changed.",
};

export function ActionFeedback({ notice, error }: { notice?: string; error?: string }) {
  const [visible, setVisible] = useState(Boolean(notice || error));
  const message = error ? errors[error] : notice ? notices[notice] : undefined;
  const isError = Boolean(error && message);

  useEffect(() => {
    setVisible(Boolean(message));
    if (!message) return;
    const timeout = window.setTimeout(() => setVisible(false), 5200);
    return () => window.clearTimeout(timeout);
  }, [message]);

  if (!message || !visible) return null;
  const Icon = isError ? AlertCircle : CheckCircle2;
  return (
    <div className={`data-feedback data-feedback-${isError ? "error" : "success"} is-visible`} role={isError ? "alert" : "status"} aria-live={isError ? "assertive" : "polite"}>
      <Icon size={18} aria-hidden="true" />
      <span>{message}</span>
      <button className="data-feedback-close" type="button" aria-label="Dismiss notification" onClick={() => setVisible(false)}><X size={15} /></button>
    </div>
  );
}
