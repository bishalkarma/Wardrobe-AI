"use client";

import { useEffect, useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { deleteSelectedClothingItemsAction } from "@/app/actions/wardrobe";
import { WARDROBE_BULK_DELETE_FORM_ID } from "./record-utils";

function getSelectionInputs(): HTMLInputElement[] {
  const form = document.getElementById(WARDROBE_BULK_DELETE_FORM_ID);
  return Array.from(document.querySelectorAll<HTMLInputElement>('input[name="itemIds"]'))
    .filter((input) => input.form === form);
}

export function BulkDeleteToolbar({ visibleCount }: { visibleCount: number }) {
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setSelectedCount(getSelectionInputs().filter((input) => input.checked).length);
    document.addEventListener("change", updateCount);
    updateCount();
    return () => document.removeEventListener("change", updateCount);
  }, []);

  function toggleAllVisible() {
    const inputs = getSelectionInputs();
    const selectAll = !inputs.length || inputs.some((input) => !input.checked);
    for (const input of inputs) {
      if (input.checked === selectAll) continue;
      input.checked = selectAll;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setSelectedCount(selectAll ? inputs.length : 0);
  }

  const allVisibleSelected = visibleCount > 0 && selectedCount === visibleCount;

  return (
    <form id={WARDROBE_BULK_DELETE_FORM_ID} action={deleteSelectedClothingItemsAction} className="account-bulk-delete-toolbar">
      <div className="account-bulk-delete-copy">
        <strong>Delete several pieces at once</strong>
        <span>Selected pieces move to your recoverable Archive. Outfit links stay intact.</span>
      </div>
      <div className="account-bulk-delete-actions">
        <button className="button button-quiet button-small" type="button" onClick={toggleAllVisible} disabled={visibleCount === 0}>
          <CheckCheck size={14} />{allVisibleSelected ? "Clear selection" : "Select all visible"}
        </button>
        <button className="button button-danger button-small" type="submit" disabled={selectedCount === 0}>
          <Trash2 size={14} />Delete selected{selectedCount > 0 ? ` (${selectedCount})` : ""}
        </button>
      </div>
    </form>
  );
}
