"use client";

import { useRef, useState } from "react";
import type { MouseEvent, PointerEvent, ReactNode } from "react";
import { BulkDeleteToolbar } from "./bulk-delete-toolbar";
import { WARDROBE_BULK_DELETE_FORM_ID } from "./record-utils";

function selectionInput(card: HTMLElement): HTMLInputElement | null {
  return card.querySelector<HTMLInputElement>(`input[form="${WARDROBE_BULK_DELETE_FORM_ID}"][name="itemIds"]`);
}

export function WardrobeSelectionManager({ visibleCount, children }: { visibleCount: number; children: ReactNode }) {
  const [selectionMode, setSelectionMode] = useState(false);
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

  function selectCard(card: HTMLElement): boolean {
    const checkbox = selectionInput(card);
    if (!checkbox) return false;
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

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
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
    const form = document.getElementById(WARDROBE_BULK_DELETE_FORM_ID);
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
      onContextMenuCapture={handleContextMenuCapture}
    >
      <BulkDeleteToolbar visibleCount={visibleCount} selectionMode={selectionMode} onCancel={cancelSelection} />
      {!selectionMode && <p className="wardrobe-selection-hint">Press and hold a piece (or open its context menu) to start selecting.</p>}
      {children}
    </div>
  );
}
