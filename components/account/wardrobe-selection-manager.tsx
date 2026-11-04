"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ChangeEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { Archive, X } from "lucide-react";
import { archiveItemAction } from "@/app/actions/wardrobe";
import { MAX_BULK_SELECTION } from "@/lib/data/validation";
import { BulkDeleteToolbar } from "./bulk-delete-toolbar";
import { WARDROBE_BULK_ARCHIVE_FORM_ID, WARDROBE_BULK_DELETE_FORM_ID } from "./record-utils";

type SelectionView = "active" | "archive";

function selectionInput(card: HTMLElement, formId: string): HTMLInputElement | null {
  return card.querySelector<HTMLInputElement>(`input[form="${formId}"][name="itemIds"]`);
}

function ArchiveItemSubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button-dark" type="submit" disabled={pending}>{pending ? "Working…" : "Move to Archive"}</button>;
}

export function WardrobeSelectionManager({ visibleCount, view, children }: { visibleCount: number; view: SelectionView; children: ReactNode }) {
  const formId = view === "active" ? WARDROBE_BULK_DELETE_FORM_ID : WARDROBE_BULK_ARCHIVE_FORM_ID;
  const [selectionMode, setSelectionMode] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<{ id: string; name: string } | null>(null);
  const archiveTriggerRef = useRef<HTMLButtonElement | null>(null);
  const archiveCancelRef = useRef<HTMLButtonElement>(null);
  const archiveTitleId = useId();
  const archiveDescriptionId = useId();
  const pressTimer = useRef<number | null>(null);
  const pressOrigin = useRef<{ x: number; y: number } | null>(null);
  const pressedCard = useRef<HTMLElement | null>(null);
  const longPressHandled = useRef(false);

  function clearPressTimer() {
    if (pressTimer.current !== null) window.clearTimeout(pressTimer.current);
    pressTimer.current = null;
    pressOrigin.current = null;
    pressedCard.current = null;
  }

  const closeArchiveDialog = useCallback(() => {
    setArchiveTarget(null);
    window.requestAnimationFrame(() => archiveTriggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!archiveTarget) return;
    archiveCancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeArchiveDialog();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [archiveTarget, closeArchiveDialog]);

  function selectCard(card: HTMLElement): boolean {
    const checkbox = selectionInput(card, formId);
    if (!checkbox) return false;
    if (!checkbox.checked) {
      const selectedCount = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="itemIds"]'))
        .filter((input) => input.form?.id === formId && input.checked).length;
      if (selectedCount >= MAX_BULK_SELECTION) {
        setSelectionMode(true);
        window.dispatchEvent(new Event("wardrobe:selection-limit"));
        return true;
      }
    }
    setSelectionMode(true);
    if (!checkbox.checked) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" && event.button !== 0) return;
    const target = event.target instanceof Element ? event.target : null;
    const card = target?.closest<HTMLElement>(".account-record-card");
    if (!card || target?.closest("button,input,select,textarea,summary,form")) return;

    clearPressTimer();
    longPressHandled.current = false;
    pressOrigin.current = { x: event.clientX, y: event.clientY };
    pressedCard.current = card;
    pressTimer.current = window.setTimeout(() => {
      const activeCard = pressedCard.current;
      pressTimer.current = null;
      pressOrigin.current = null;
      pressedCard.current = null;
      if (activeCard) longPressHandled.current = selectCard(activeCard);
    }, 500);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (pressTimer.current === null || !pressOrigin.current) return;
    const distance = Math.hypot(event.clientX - pressOrigin.current.x, event.clientY - pressOrigin.current.y);
    if (distance > 12) clearPressTimer();
  }

  function handleSelectionChangeCapture(event: ChangeEvent<HTMLDivElement>) {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input || input.name !== "itemIds" || input.form?.id !== formId || !input.checked) return;
    const selectedCount = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="itemIds"]'))
      .filter((candidate) => candidate.form?.id === formId && candidate.checked).length;
    if (selectedCount <= MAX_BULK_SELECTION) return;
    input.checked = false;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    window.dispatchEvent(new Event("wardrobe:selection-limit"));
    event.stopPropagation();
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    const target = event.target instanceof Element ? event.target : null;
    const archiveButton = target?.closest<HTMLButtonElement>("[data-wardrobe-archive]");
    if (archiveButton) {
      const id = archiveButton.dataset.recordId;
      const name = archiveButton.dataset.recordName;
      if (id && name) {
        event.preventDefault();
        event.stopPropagation();
        archiveTriggerRef.current = archiveButton;
        setArchiveTarget({ id, name });
      }
      return;
    }

    const permanentDeleteButton = target?.closest<HTMLButtonElement>("[data-wardrobe-delete-forever]");
    if (permanentDeleteButton) {
      event.preventDefault();
      event.stopPropagation();
      const card = permanentDeleteButton.closest<HTMLElement>(".account-record-card");
      const checkbox = card ? selectionInput(card, formId) : null;
      const form = document.getElementById(formId);
      for (const input of Array.from(document.querySelectorAll<HTMLInputElement>('input[name="itemIds"]')).filter((candidate) => candidate.form === form && candidate !== checkbox && candidate.checked)) {
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      }
      setSelectionMode(true);
      window.dispatchEvent(new CustomEvent("wardrobe:confirm-archive-delete", { detail: { name: permanentDeleteButton.dataset.recordName ?? "this piece", trigger: permanentDeleteButton } }));
      return;
    }

    if (!longPressHandled.current) return;
    event.preventDefault();
    event.stopPropagation();
    longPressHandled.current = false;
  }

  function handleContextMenuCapture(event: MouseEvent<HTMLDivElement>) {
    const target = event.target instanceof Element ? event.target : null;
    const card = target?.closest<HTMLElement>(".account-record-card");
    if (!card || target?.closest("button,input,select,textarea,summary,form")) return;
    if (!selectCard(card)) return;
    event.preventDefault();
    event.stopPropagation();
    longPressHandled.current = true;
  }

  function cancelSelection() {
    const form = document.getElementById(formId);
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="itemIds"]'))
      .filter((input) => input.form === form);
    for (const input of inputs) {
      if (!input.checked) continue;
      input.checked = false;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setSelectionMode(false);
  }

  return (
    <div
      className="wardrobe-selection-manager"
      data-selection-mode={selectionMode ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearPressTimer}
      onPointerCancel={clearPressTimer}
      onPointerLeave={clearPressTimer}
      onClickCapture={handleClickCapture}
      onChangeCapture={handleSelectionChangeCapture}
      onContextMenuCapture={handleContextMenuCapture}
    >
      <BulkDeleteToolbar visibleCount={visibleCount} selectionMode={selectionMode} view={view} onCancel={cancelSelection} />
      {archiveTarget && (
        <div className="action-confirm-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeArchiveDialog();
        }}>
          <section className="action-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby={archiveTitleId} aria-describedby={archiveDescriptionId}>
            <div className="action-confirm-heading">
              <span className="action-confirm-icon"><Archive size={18} /></span>
              <button className="action-confirm-close" type="button" onClick={closeArchiveDialog} aria-label="Close confirmation"><X size={17} /></button>
            </div>
            <p className="eyebrow">RECOVERABLE ACTION</p>
            <h2 id={archiveTitleId}>Move “{archiveTarget.name}” to Archive?</h2>
            <p id={archiveDescriptionId}>You can restore it later. Its links to saved outfits will remain intact.</p>
            <form action={archiveItemAction}>
              <input type="hidden" name="itemId" value={archiveTarget.id} />
              <div className="action-confirm-actions">
                <button ref={archiveCancelRef} className="button button-light" type="button" onClick={closeArchiveDialog}>Not now</button>
                <ArchiveItemSubmitButton />
              </div>
            </form>
          </section>
        </div>
      )}
      {!selectionMode && <p className="wardrobe-selection-hint">Press and hold a piece (or open its context menu) to start selecting.</p>}
      {children}
    </div>
  );
}
