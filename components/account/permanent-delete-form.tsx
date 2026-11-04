"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, Trash2 } from "lucide-react";
import { permanentlyDeleteOutfitAction } from "@/app/actions/outfits";
import { permanentlyDeleteClothingItemAction } from "@/app/actions/wardrobe";

type RecordKind = "clothing" | "outfit";

function PermanentDeleteButton({ kind }: { kind: RecordKind }) {
  const { pending } = useFormStatus();
  return (
    <button className="button button-danger" type="submit" disabled={pending}>
      <Trash2 size={15} />{pending ? "Deleting…" : `Delete ${kind === "clothing" ? "piece" : "outfit"} forever`}
    </button>
  );
}

export function PermanentDeleteForm({ kind, recordId, recordName }: { kind: RecordKind; recordId: string; recordName: string }) {
  const action = kind === "clothing" ? permanentlyDeleteClothingItemAction : permanentlyDeleteOutfitAction;
  const fieldName = kind === "clothing" ? "itemId" : "outfitId";
  const [confirming, setConfirming] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const description = kind === "clothing"
    ? "This permanently deletes the archived piece and removes it from every outfit."
    : "This permanently deletes the archived outfit and its piece links.";

  const dismissConfirmation = useCallback(() => {
    setConfirming(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!confirming) return;
    cancelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissConfirmation();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirming, dismissConfirmation]);

  return (
    <form action={action} className="permanent-delete-form">
      <input type="hidden" name={fieldName} value={recordId} />
      <p>{description} It cannot be restored.</p>
      <button ref={triggerRef} className="button button-danger button-small" type="button" onClick={() => setConfirming(true)}>
        <Trash2 size={14} /> Delete forever
      </button>
      {confirming && (
        <div className="permanent-delete-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) dismissConfirmation();
        }}>
          <section className="permanent-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
            <span className="permanent-delete-icon"><AlertTriangle size={19} /></span>
            <p className="eyebrow">IRREVERSIBLE ACTION</p>
            <h2 id={titleId}>Delete “{recordName}” forever?</h2>
            <p id={descriptionId}>{description} This cannot be undone.</p>
            <div className="permanent-delete-dialog-actions">
              <button ref={cancelRef} className="button button-light" type="button" onClick={dismissConfirmation}>Keep in Archive</button>
              <PermanentDeleteButton kind={kind} />
            </div>
          </section>
        </div>
      )}
    </form>
  );
}
