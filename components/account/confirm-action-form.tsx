"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Archive, X } from "lucide-react";

type ServerAction = (formData: FormData) => void | Promise<void>;

function ConfirmSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button className="button button-dark" type="submit" disabled={pending}>{pending ? "Working…" : label}</button>;
}

export function ConfirmActionForm({
  action,
  fieldName,
  recordId,
  triggerLabel,
  title,
  description,
  confirmLabel,
}: {
  action: ServerAction;
  fieldName: string;
  recordId: string;
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <form action={action} className="confirm-action-form">
      <input type="hidden" name={fieldName} value={recordId} />
      <button ref={triggerRef} className="button button-light button-small" type="button" onClick={() => setOpen(true)}>
        <Archive size={14} />{triggerLabel}
      </button>
      {open && (
        <div className="action-confirm-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <section className="action-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
            <div className="action-confirm-heading">
              <span className="action-confirm-icon"><Archive size={18} /></span>
              <button className="action-confirm-close" type="button" onClick={close} aria-label="Close confirmation"><X size={17} /></button>
            </div>
            <p className="eyebrow">YOU CAN CHANGE THIS LATER</p>
            <h2 id={titleId}>{title}</h2>
            <p id={descriptionId}>{description}</p>
            <div className="action-confirm-actions">
              <button ref={cancelRef} className="button button-light" type="button" onClick={close}>Not now</button>
              <ConfirmSubmitButton label={confirmLabel} />
            </div>
          </section>
        </div>
      )}
    </form>
  );
}
