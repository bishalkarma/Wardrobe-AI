import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowLeft, Bookmark, Heart, RotateCcw, Shirt, Star } from "lucide-react";
import { archiveOutfitAction, restoreOutfitAction, setOutfitRatingAction, setOutfitStateAction } from "@/app/actions/outfits";
import { ActionFeedback, DataUnavailable } from "@/components/account/feedback";
import { OutfitForm } from "@/components/account/outfit-form";
import { PageHeading } from "@/components/ui";
import { firstParam } from "@/components/account/record-utils";
import { requireAccountContext } from "@/lib/data/account";
import { isUuid } from "@/lib/data/validation";

type PageParams = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function OutfitDetailPage({ params, searchParams }: { params: PageParams; searchParams: SearchParams }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const { supabase, user } = await requireAccountContext();
  const [{ data: outfit, error: outfitError }, { data: links, error: linksError }, { data: activeItems, error: itemsError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabase.from("outfits").select("id, name, occasion, style, reason, is_favorite, is_saved, rating, deleted_at, created_at").eq("id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("outfit_items").select("clothing_item_id").eq("outfit_id", id).eq("user_id", user.id),
    supabase.from("clothing_items").select("id, name, category_id, color, deleted_at").eq("user_id", user.id).is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("clothing_categories").select("id, label").eq("is_active", true),
  ]);
  if (outfitError || linksError || itemsError || categoriesError || !activeItems || !categories || !links) return <div className="page-stack"><DataUnavailable /></div>;
  if (!outfit) notFound();

  const linkedIds = links.map((link) => link.clothing_item_id as string);
  const { data: linkedItems, error: linkedItemsError } = linkedIds.length
    ? await supabase.from("clothing_items").select("id, name, category_id, color, deleted_at").eq("user_id", user.id).in("id", linkedIds)
    : { data: [], error: null };
  if (linkedItemsError || !linkedItems) return <div className="page-stack"><DataUnavailable /></div>;

  const categoryLabels = new Map(categories.map((category) => [category.id, category.label]));
  const archived = outfit.deleted_at !== null;

  return (
    <div className="page-stack account-page">
      <Link className="back-link" href={archived ? "/outfits?view=trash" : "/outfits?view=all"}><ArrowLeft size={15} /> Back to {archived ? "archive" : "outfits"}</Link>
      <PageHeading eyebrow={archived ? "ARCHIVED OUTFIT" : [outfit.occasion, outfit.style].filter(Boolean).join(" · ").toUpperCase() || "YOUR SAVED LOOK"} title={outfit.name} subtitle={archived ? "This outfit is recoverable from your archive." : "A combination made from your wardrobe pieces."} />
      <ActionFeedback notice={firstParam(query.notice)} error={firstParam(query.error)} />

      <section className="outfit-detail-panel">
        <div className="outfit-detail-heading">
          <span className="outfit-detail-icon"><Bookmark size={22} /></span>
          <div><p className="record-kicker">{outfit.is_saved ? "SAVED LOOK" : "PERSONAL OUTFIT"}{archived ? " · ARCHIVED" : ""}</p><h2>{outfit.name}</h2><p>{outfit.reason || "A look you put together from pieces you own."}</p></div>
        </div>
        <div className="outfit-detail-meta"><span>{outfit.occasion || "No occasion set"}</span><span>{outfit.style || "No style note"}</span><span>{linkedItems.length} {linkedItems.length === 1 ? "piece" : "pieces"}</span></div>
        <div className="outfit-detail-pieces">
          <h3>Pieces in this look</h3>
          {linkedItems.length ? linkedItems.map((item) => <div className={`outfit-piece-pill${item.deleted_at ? " is-archived" : ""}`} key={item.id}><Shirt size={15} /><span><strong>{item.name}</strong><small>{item.deleted_at ? "Archived piece · restore it to return it to your active wardrobe" : [categoryLabels.get(item.category_id) ?? "Clothing", item.color].filter(Boolean).join(" · ")}</small></span></div>) : <p className="field-help">No pieces are linked to this outfit yet.</p>}
        </div>
        <div className="outfit-detail-controls">
          {archived ? (
            <form action={restoreOutfitAction}><input type="hidden" name="outfitId" value={outfit.id} /><button className="button button-outline" type="submit"><RotateCcw size={15} /> Restore outfit</button></form>
          ) : (
            <>
              <form action={setOutfitStateAction}><input type="hidden" name="outfitId" value={outfit.id} /><input type="hidden" name="stateKey" value="is_saved" /><input type="hidden" name="nextValue" value={outfit.is_saved ? "false" : "true"} /><button className="button button-light" type="submit"><Bookmark size={15} />{outfit.is_saved ? "Remove from saved" : "Save this look"}</button></form>
              <form action={setOutfitStateAction}><input type="hidden" name="outfitId" value={outfit.id} /><input type="hidden" name="stateKey" value="is_favorite" /><input type="hidden" name="nextValue" value={outfit.is_favorite ? "false" : "true"} /><button className="button button-light" type="submit"><Heart size={15} fill={outfit.is_favorite ? "currentColor" : "none"} />{outfit.is_favorite ? "Remove favorite" : "Add favorite"}</button></form>
              <form action={setOutfitRatingAction} className="rating-form"><input type="hidden" name="outfitId" value={outfit.id} /><label className="field-label">Your rating<select className="text-input" name="rating" defaultValue={outfit.rating?.toString() ?? ""}><option value="">Not rated</option>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} {rating === 1 ? "star" : "stars"}</option>)}</select></label><button className="button button-outline button-small" type="submit"><Star size={14} /> Save rating</button></form>
              <details className="inline-confirm"><summary><Archive size={14} /> Archive outfit</summary><form action={archiveOutfitAction}><input type="hidden" name="outfitId" value={outfit.id} /><p>This hides the outfit from active lists without permanently deleting it.</p><button className="button button-danger button-small" type="submit">Move to archive</button></form></details>
            </>
          )}
        </div>
      </section>

      {!archived && activeItems.length > 0 && (
        <details className="edit-outfit-section">
          <summary>Edit outfit details and pieces</summary>
          <OutfitForm items={activeItems.map((item) => ({ id: item.id, name: item.name, categoryLabel: categoryLabels.get(item.category_id) ?? "Clothing", color: item.color }))} outfit={{ id: outfit.id, name: outfit.name, occasion: outfit.occasion, style: outfit.style, reason: outfit.reason, itemIds: linkedItems.filter((item) => item.deleted_at === null).map((item) => item.id) }} />
        </details>
      )}
    </div>
  );
}
