import Link from "next/link";
import { Archive, Heart, RotateCcw, Shirt, Trash2 } from "lucide-react";
import { restoreItemAction, toggleItemFavoriteAction } from "@/app/actions/wardrobe";
import { formatDate } from "@/lib/data/account";

type WardrobeRecord = {
  id: string;
  name: string;
  category_id: string;
  subcategory: string | null;
  color: string | null;
  pattern: string | null;
  material: string | null;
  season: string[];
  occasions: string[];
  brand: string | null;
  is_favorite: boolean;
  deleted_at: string | null;
  created_at: string;
};

export function WardrobeRecord({ item, categoryLabel, selectionFormId }: { item: WardrobeRecord; categoryLabel: string; selectionFormId?: string }) {
  const archived = item.deleted_at !== null;
  const detailHref = `/wardrobe/${item.id}${archived ? "?view=trash" : ""}`;
  const details = [item.color, item.subcategory, item.material].filter(Boolean);
  const tags = [...(item.occasions ?? []).slice(0, 3), ...(item.season ?? []).slice(0, 2)];

  return (
    <article className={`account-record-card${archived ? " is-archived" : ""}`}>
      {selectionFormId && <label className="record-select-control"><span className="sr-only">Select {item.name} for a bulk action</span><input type="checkbox" name="itemIds" value={item.id} form={selectionFormId} aria-label={`Select ${item.name} for a bulk action`} /></label>}
      <Link className="record-mark" href={detailHref} aria-label={`View ${item.name}`}><Shirt size={22} /></Link>
      <div className="account-record-main">
        <div className="account-record-topline">
          <div>
            <p className="record-kicker">{categoryLabel}{item.subcategory ? ` · ${item.subcategory}` : ""}</p>
            <h2><Link href={detailHref}>{item.name}</Link></h2>
          </div>
          <span className="record-date">{archived ? "Archived" : `Added ${formatDate(item.created_at)}`}</span>
        </div>
        <p className="record-summary">{details.length ? details.join(" · ") : "Add color, material, and fit details whenever you like."}</p>
        {tags.length > 0 && <div className="record-tags">{tags.map((tag, index) => <span key={`${tag}-${index}`}>{tag}</span>)}</div>}
        <div className="record-actions">
          {archived ? (
            <>
              <form action={restoreItemAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button className="button button-outline button-small" type="submit"><RotateCcw size={14} /> Restore piece</button>
              </form>
              <button className="button button-danger button-small" type="button" data-wardrobe-delete-forever="true" data-record-id={item.id} data-record-name={item.name}>
                <Trash2 size={14} /> Delete forever
              </button>
            </>
          ) : (
            <>
              <form action={toggleItemFavoriteAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="nextValue" value={item.is_favorite ? "false" : "true"} />
                <button className={`button button-light button-small${item.is_favorite ? " is-favorite-action" : ""}`} type="submit"><Heart size={14} fill={item.is_favorite ? "currentColor" : "none"} />{item.is_favorite ? "Favorited" : "Favorite"}</button>
              </form>
              <Link className="button button-light button-small" href={`/wardrobe/${item.id}/edit`}>Edit details</Link>
              <button className="button button-light button-small" type="button" data-wardrobe-archive="true" data-record-id={item.id} data-record-name={item.name}>
                <Archive size={14} /> Archive
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
