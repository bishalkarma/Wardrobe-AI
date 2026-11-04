import Link from "next/link";
import { ArrowLeft, Check, LockKeyhole } from "lucide-react";
import { createOutfitAction, updateOutfitAction } from "@/app/actions/outfits";

type OutfitItemOption = {
  id: string;
  name: string;
  categoryLabel: string;
  color: string | null;
};

type ExistingOutfit = {
  id: string;
  name: string;
  occasion: string | null;
  style: string | null;
  reason: string | null;
  itemIds: string[];
};

export function OutfitForm({ items, outfit }: { items: OutfitItemOption[]; outfit?: ExistingOutfit }) {
  const action = outfit ? updateOutfitAction : createOutfitAction;

  return (
    <form action={action} className="form-stack account-data-form">
      {outfit && <input type="hidden" name="outfitId" value={outfit.id} />}
      <label className="field-label">Name this look
        <input className="text-input" name="name" required maxLength={120} defaultValue={outfit?.name ?? ""} placeholder="e.g. Easy Friday" />
      </label>
      <div className="form-row">
        <label className="field-label">Occasion
          <input className="text-input" name="occasion" maxLength={80} defaultValue={outfit?.occasion ?? ""} placeholder="e.g. Work, weekend" />
        </label>
        <label className="field-label">Style
          <input className="text-input" name="style" maxLength={80} defaultValue={outfit?.style ?? ""} placeholder="e.g. Relaxed classic" />
        </label>
      </div>
      <label className="field-label">Why does this combination work for you?
        <textarea className="text-input text-area" name="reason" rows={3} maxLength={1000} defaultValue={outfit?.reason ?? ""} placeholder="Add a note for another day." />
      </label>

      <fieldset className="piece-picker">
        <legend>Choose pieces from your wardrobe</legend>
        <p>Only active pieces in your account are available here. Archived links remain attached and come back if you restore a piece.</p>
        <div className="piece-picker-list">
          {items.map((item) => (
            <label className="piece-picker-option" key={item.id}>
              <input type="checkbox" name="itemIds" value={item.id} defaultChecked={outfit?.itemIds.includes(item.id) ?? false} />
              <span className="piece-picker-mark"><LockKeyhole size={14} /></span>
              <span className="piece-picker-copy"><strong>{item.name}</strong><small>{item.categoryLabel}{item.color ? ` · ${item.color}` : ""}</small></span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="account-form-boundary"><LockKeyhole size={15} /><span>Outfits are saved to your account. No sample/demo pieces are included.</span></div>
      <div className="modal-action-row">
        <Link className="button button-light" href={outfit ? `/outfits/${outfit.id}` : "/outfits"}><ArrowLeft size={15} /> Cancel</Link>
        <button className="button button-dark" type="submit"><Check size={16} />{outfit ? "Save outfit changes" : "Save this outfit"}</button>
      </div>
    </form>
  );
}
