import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { saveClothingItemAction } from "@/app/actions/wardrobe";
import { CLOTHING_CATEGORY_OPTIONS, type ClothingCategoryId } from "@/lib/data/validation";

type ClothingRecord = {
  id: string;
  name: string;
  category_id: string;
  subcategory: string | null;
  color: string | null;
  pattern: string | null;
  material: string | null;
  fit: string | null;
  season: string[];
  formality: string | null;
  occasions: string[];
  brand: string | null;
  notes: string | null;
};

export function ClothingForm({ item }: { item?: ClothingRecord }) {
  const editing = Boolean(item);
  const defaultCategory = CLOTHING_CATEGORY_OPTIONS.some((category) => category.id === item?.category_id)
    ? item!.category_id as ClothingCategoryId
    : "tops";

  return (
    <form action={saveClothingItemAction} className="form-stack account-data-form">
      {item && <input type="hidden" name="itemId" value={item.id} />}
      <label className="field-label">What do you call this piece?
        <input className="text-input" name="name" required maxLength={120} defaultValue={item?.name ?? ""} placeholder="e.g. Navy linen shirt" autoComplete="off" />
      </label>
      <div className="form-row">
        <label className="field-label">Category
          <select className="text-input" name="categoryId" required defaultValue={defaultCategory}>
            {CLOTHING_CATEGORY_OPTIONS.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}
          </select>
        </label>
        <label className="field-label">Subcategory
          <input className="text-input" name="subcategory" maxLength={80} defaultValue={item?.subcategory ?? ""} placeholder="e.g. Oxford shirt" />
        </label>
      </div>
      <div className="form-row">
        <label className="field-label">Main color
          <input className="text-input" name="color" maxLength={80} defaultValue={item?.color ?? ""} placeholder="e.g. Soft blue" />
        </label>
        <label className="field-label">Pattern
          <input className="text-input" name="pattern" maxLength={80} defaultValue={item?.pattern ?? ""} placeholder="e.g. Solid, striped" />
        </label>
      </div>
      <div className="form-row">
        <label className="field-label">Material
          <input className="text-input" name="material" maxLength={80} defaultValue={item?.material ?? ""} placeholder="e.g. Cotton" />
        </label>
        <label className="field-label">Fit
          <input className="text-input" name="fit" maxLength={80} defaultValue={item?.fit ?? ""} placeholder="e.g. Relaxed" />
        </label>
      </div>
      <div className="form-row">
        <label className="field-label">Seasons
          <input className="text-input" name="season" maxLength={320} defaultValue={item?.season?.join(", ") ?? ""} placeholder="e.g. Spring, summer" />
          <span className="field-help">Separate a few seasons with commas.</span>
        </label>
        <label className="field-label">Formality
          <input className="text-input" name="formality" maxLength={80} defaultValue={item?.formality ?? ""} placeholder="e.g. Casual, smart casual" />
        </label>
      </div>
      <div className="form-row">
        <label className="field-label">Occasions
          <input className="text-input" name="occasions" maxLength={732} defaultValue={item?.occasions?.join(", ") ?? ""} placeholder="e.g. Work, weekend" />
          <span className="field-help">Separate occasions with commas.</span>
        </label>
        <label className="field-label">Brand
          <input className="text-input" name="brand" maxLength={80} defaultValue={item?.brand ?? ""} placeholder="Optional" />
        </label>
      </div>
      <label className="field-label">Notes
        <textarea className="text-input text-area" name="notes" maxLength={1000} rows={3} defaultValue={item?.notes ?? ""} placeholder="Anything you want to remember about this piece?" />
      </label>
      <div className="account-form-boundary"><ShieldCheck size={16} /><span>Saved to your signed-in account only. Photos and AI suggestions are not enabled yet.</span></div>
      <div className="modal-action-row">
        <Link className="button button-light" href={editing ? `/wardrobe/${item!.id}` : "/wardrobe"}><ArrowLeft size={15} /> Cancel</Link>
        <button className="button button-dark" type="submit"><Check size={16} />{editing ? "Save changes" : "Add to wardrobe"}</button>
      </div>
    </form>
  );
}
