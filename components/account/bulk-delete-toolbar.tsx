"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Archive, CheckCheck, RotateCcw, Trash2, X } from "lucide-react";
import { deleteSelectedClothingItemsAction, manageArchivedClothingSelectionAction } from "@/app/actions/wardrobe";
import { MAX_BULK_SELECTION } from "@/lib/data/validation";
import { WARDROBE_BULK_ARCHIVE_FORM_ID, WARDROBE_BULK_DELETE_FORM_ID } from "./record-utils";

type SelectionView = "active" | "archive";

function getSelectionInputs(formId: string): HTMLInputElement[] {
  const form = document.getElementById(formId);
  return Array.from(document.querySelectorAll<HTMLInputElement>('input[name="itemIds"]'))
    .filter((input) => input.form === form);
}

function ConfirmSelectionButton({ label, intent, danger }: { label: string; intent?: string; danger: boolean }) {
  const { pending } = useFormStatus();
  const Icon = danger ? Trash2 : Archive;
  return <button className={`button ${danger ? "button-danger" : "button-dark"}`} type="submit" name={intent ? "intent" : undefined} value={intent} disabled={pending}>
    <Icon size={15} />{pending ? "Working…" : label}
  </button>;
}

export function BulkDeleteToolbar({
  visibleCount,
  selectionMode,
  view,
  onCancel,
}: {
  visibleCount: number;
  selectionMode: boolean;
  view: SelectionView;
  onCancel: () => void;
}) {
  const formId = view === "active" ? WARDROBE_BULK_DELETE_FORM_ID : WARDROBE_BULK_ARCHIVE_FORM_ID;
  const action = view === "active" ? deleteSelectedClothingItemsAction : manageArchivedClothingSelectionAction;
  const isArchive = view === "archive";
  const [selectedCount, setSelectedCount] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [singleRecordName, setSingleRecordName] = useState<string | null>(null);
  const [selectionLimitNotice, setSelectionLimitNotice] = useState(false);
  const limitTimer = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const showSelectionLimitNotice = useCallback(() => {
    setSelectionLimitNotice(true);
    if (limitTimer.current !== null) window.clearTimeout(limitTimer.current);
    limitTimer.current = window.setTimeout(() => setSelectionLimitNotice(false), 3800);
  }, []);

  useEffect(() => {
    const onSelectionLimit = () => showSelectionLimitNotice();
    window.addEventListener("wardrobe:selection-limit", onSelectionLimit);
    return () => {
      window.removeEventListener("wardrobe:selection-limit", onSelectionLimit);
      if (limitTimer.current !== null) window.clearTimeout(limitTimer.current);
    };
  }, [showSelectionLimitNotice]);

  useEffect(() => {
    const updateCount = () => setSelectedCount(getSelectionInputs(formId).filter((input) => input.checked).length);
    document.addEventListener("change", updateCount);
    updateCount();
    return () => document.removeEventListener("change", updateCount);
  }, [formId]);

  useEffect(() => {
    if (!isArchive) return;
    const openForSingleRecord = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: string; trigger?: HTMLElement }>).detail;
      returnFocusRef.current = detail?.trigger ?? triggerRef.current;
      setSingleRecordName(detail?.name ?? null);
      setSelectedCount(getSelectionInputs(formId).filter((input) => input.checked).length);
      setConfirming(true);
    };
    window.addEventListener("wardrobe:confirm-archive-delete", openForSingleRecord);
    return () => window.removeEventListener("wardrobe:confirm-archive-delete", openForSingleRecord);
  }, [formId, isArchive]);

  const closeConfirmation = useCallback(() => {
    setConfirming(false);
    setSingleRecordName(null);
    const target = returnFocusRef.current ?? triggerRef.current;
    window.requestAnimationFrame(() => target?.focus());
    returnFocusRef.current = null;
  }, []);

  useEffect(() => {
    if (!confirming) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeConfirmation();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirming, closeConfirmation]);

  function openBulkConfirmation() {
    setSingleRecordName(null);
    returnFocusRef.current = triggerRef.current;
    setConfirming(true);
  }

  function toggleAllVisible() {
    const inputs = getSelectionInputs(formId);
    const clearSelection = selectedCount > 0 && selectedCount >= Math.min(visibleCount, MAX_BULK_SELECTION);
    if (clearSelection) {
      for (const input of inputs) {
        if (!input.checked) continue;
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
      setSelectedCount(0);
      return;
    }

    const cappedInputs = inputs.slice(0, MAX_BULK_SELECTION);
    const cappedSet = new Set(cappedInputs);
    for (const input of inputs) {
      const shouldCheck = cappedSet.has(input);
      if (input.checked === shouldCheck) continue;
      input.checked = shouldCheck;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setSelectedCount(cappedInputs.length);
    if (inputs.length > MAX_BULK_SELECTION) showSelectionLimitNotice();
  }

  const selectionAtLimit = selectedCount > 0 && selectedCount >= Math.min(visibleCount, MAX_BULK_SELECTION);
  const confirmationTitle = singleRecordName
    ? `Permanently delete “${singleRecordName}”?`
    : isArchive
      ? `Permanently delete ${selectedCount} ${selectedCount === 1 ? "piece" : "pieces"}?`
      : `Move ${selectedCount} ${selectedCount === 1 ? "piece" : "pieces"} to Archive?`;
  const confirmationCopy = isArchive
    ? singleRecordName
      ? "This cannot be undone. The piece will also be removed from any outfits that use it."
      : "This cannot be undone. These pieces will be removed from any outfits that use them."
    : "You can restore these pieces later. Their outfit links will remain intact.";
  const confirmationButtonLabel = isArchive
    ? singleRecordName ? "Delete forever" : `Delete ${selectedCount} forever`
    : `Move ${selectedCount} to Archive`;

  return (
    <form id={formId} action={action} className="account-bulk-delete-toolbar" aria-hidden={!selectionMode}>
      <div className="account-bulk-delete-copy">
        <strong>{isArchive ? "Manage archived pieces" : "Select pieces together"}</strong>
        <span>{isArchive ? "Restore a group or permanently remove archived pieces." : "Selected pieces move to your recoverable Archive. Outfit links stay intact."}</span>
        {selectionLimitNotice && <span className="selection-limit-note" role="status">Select up to {MAX_BULK_SELECTION} pieces at a time.</span>}
      </div>
      <div className="account-bulk-delete-actions">
        <button className="button button-quiet button-small" type="button" onClick={toggleAllVisible} disabled={visibleCount === 0}>
          <CheckCheck size={14} />{selectionAtLimit ? "Clear selection" : "Select all visible"}
        </button>
        <button className="button button-quiet button-small" type="button" onClick={onCancel}>Cancel</button>
        {isArchive ? (
          <button className="button button-outline button-small" type="submit" name="intent" value="restore" disabled={selectedCount === 0}>
            <RotateCcw size={14} />Restore selected{selectedCount > 0 ? ` (${selectedCount})` : ""}
          </button>
        ) : null}
        <button ref={triggerRef} className={`button ${isArchive ? "button-danger" : "button-dark"} button-small`} type="button" onClick={openBulkConfirmation} disabled={selectedCount === 0}>
          {isArchive ? <Trash2 size={14} /> : <Archive size={14} />}
          {isArchive ? `Delete forever${selectedCount > 0 ? ` (${selectedCount})` : ""}` : `Move to Archive${selectedCount > 0 ? ` (${selectedCount})` : ""}`}
        </button>
      </div>
      {confirming && (
        <div className="action-confirm-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeConfirmation();
        }}>
          <section className={`action-confirm-dialog${isArchive ? " is-danger" : ""}`} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
            <div className="action-confirm-heading">
              <span className="action-confirm-icon">{isArchive ? <Trash2 size={18} /> : <Archive size={18} />}</span>
              <button className="action-confirm-close" type="button" onClick={closeConfirmation} aria-label="Close confirmation"><X size={17} /></button>
            </div>
            <p className="eyebrow">{isArchive ? "IRREVERSIBLE ACTION" : "RECOVERABLE ACTION"}</p>
            <h2 id={titleId}>{confirmationTitle}</h2>
            <p id={descriptionId}>{confirmationCopy}</p>
            <div className="action-confirm-actions">
              <button ref={cancelRef} className="button button-light" type="button" onClick={closeConfirmation}>Not now</button>
              <ConfirmSelectionButton label={confirmationButtonLabel} intent={isArchive ? "permanent-delete" : undefined} danger={isArchive} />
            </div>
          </section>
        </div>
      )}
    </form>
  );
}
