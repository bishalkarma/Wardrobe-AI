import Link from "next/link";
import { Bookmark, Heart, Shirt, Star, Trash2 } from "lucide-react";
import { archiveOutfitAction, restoreOutfitAction, setOutfitStateAction } from "@/app/actions/outfits";
import { ConfirmActionForm } from "@/components/account/confirm-action-form";
import { PermanentDeleteForm } from "@/components/account/permanent-delete-form";

type OutfitRecordData = {
  id: string;
  name: string;
  occasion: string | null;
  style: string | null;
  reason: string | null;
  is_favorite: boolean;
  is_saved: boolean;
  rating: number | null;
  deleted_at?: string | null;
  created_at: string;
};

type OutfitPiece = {
  id: string;
  name: string;
  categoryLabel: string;
  color: string | null;
  deleted_at: string | null;
};

export function OutfitRecord({ outfit, items }: { outfit: OutfitRecordData; items: OutfitPiece[] }) {
  const archived = outfit.deleted_at !== undefined && outfit.deleted_at !== null;
  return (
    <article className={`account-outfit-card${archived ? " is-archived" : ""}`}>
      <div className="outfit-card-topline">
        <span className="record-mark outfit-record-mark"><Shirt size={21} /></span>
        <div className="outfit-record-title"><p className="record-kicker">{[outfit.occasion, outfit.style].filter(Boolean).join(" · ") || "A look from your wardrobe"}</p><h2><Link href={`/outfits/${outfit.id}`}>{outfit.name}</Link></h2></div>
        <div className="outfit-record-badges">{archived && <span>Archived</span>}{!archived && outfit.is_saved && <span><Bookmark size={13} /> Saved</span>}{!archived && outfit.is_favorite && <span><Heart size={13} fill="currentColor" /> Favorite</span>}</div>
      </div>
      {outfit.reason && <p className="outfit-record-reason">{outfit.reason}</p>}
      <div className="outfit-piece-list">
        {items.map((item) => <span className={`outfit-piece-pill${item.deleted_at ? " is-archived" : ""}`} key={item.id}><Shirt size={13} /><span><strong>{item.name}</strong><small>{item.deleted_at ? "Archived piece" : [item.categoryLabel, item.color].filter(Boolean).join(" · ")}</small></span></span>)}
        {!items.length && <span className="outfit-piece-pill"><Shirt size={13} /><span><strong>No pieces linked</strong><small>Edit this outfit to add wardrobe pieces.</small></span></span>}
      </div>
      <div className="outfit-record-footer">
        <div className="outfit-rating-display" aria-label={outfit.rating ? `Rated ${outfit.rating} out of 5` : "Not rated yet"}>{[1, 2, 3, 4, 5].map((rating) => <Star key={rating} size={14} fill={outfit.rating && rating <= outfit.rating ? "currentColor" : "none"} />)}</div>
        <div className="record-actions">
          {archived ? (
            <>
              <form action={restoreOutfitAction}><input type="hidden" name="outfitId" value={outfit.id} /><button className="button button-outline button-small" type="submit">Restore outfit</button></form>
              <details className="inline-confirm permanent-delete-confirm">
                <summary><Trash2 size={14} /> Delete forever</summary>
                <PermanentDeleteForm kind="outfit" recordId={outfit.id} recordName={outfit.name} />
              </details>
            </>
          ) : (
            <>
              <form action={setOutfitStateAction}><input type="hidden" name="outfitId" value={outfit.id} /><input type="hidden" name="stateKey" value="is_favorite" /><input type="hidden" name="nextValue" value={outfit.is_favorite ? "false" : "true"} /><button className="button button-light button-small" type="submit"><Heart size={14} fill={outfit.is_favorite ? "currentColor" : "none"} />{outfit.is_favorite ? "Unfavorite" : "Favorite"}</button></form>
              <form action={setOutfitStateAction}><input type="hidden" name="outfitId" value={outfit.id} /><input type="hidden" name="stateKey" value="is_saved" /><input type="hidden" name="nextValue" value={outfit.is_saved ? "false" : "true"} /><button className="button button-light button-small" type="submit"><Bookmark size={14} />{outfit.is_saved ? "Unsave" : "Save"}</button></form>
              <Link className="button button-outline button-small" href={`/outfits/${outfit.id}`}>Open</Link>
              <ConfirmActionForm
                action={archiveOutfitAction}
                fieldName="outfitId"
                recordId={outfit.id}
                triggerLabel="Archive"
                title={`Move “${outfit.name}” to Archive?`}
                description="It will leave your active outfit list but stay recoverable. Its clothing links will be preserved."
                confirmLabel="Move to Archive"
              />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
