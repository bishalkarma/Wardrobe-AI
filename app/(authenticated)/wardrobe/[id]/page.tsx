import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, ArrowLeft, Heart, RotateCcw, Shirt } from "lucide-react";
import { archiveItemAction, restoreItemAction, toggleItemFavoriteAction } from "@/app/actions/wardrobe";
import { ActionFeedback, DataUnavailable } from "@/components/account/feedback";
import { PageHeading } from "@/components/ui";
import { requireAccountContext, formatDate } from "@/lib/data/account";
import { isUuid } from "@/lib/data/validation";

type PageParams = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ClothingItemDetailPage({ params, searchParams }: { params: PageParams; searchParams: SearchParams }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const { supabase, user } = await requireAccountContext();
  const [{ data: item, error }, { data: categories, error: categoryError }] = await Promise.all([
    supabase.from("clothing_items").select("id, name, category_id, subcategory, color, pattern, material, fit, season, formality, occasions, brand, notes, is_favorite, deleted_at, created_at, updated_at").eq("id", id).eq("user_id", user.id).maybeSingle(),
    supabase.from("clothing_categories").select("id, label").eq("is_active", true),
  ]);
  if (error || categoryError || !categories) return <div className="page-stack"><DataUnavailable /></div>;
  if (!item) notFound();
  const categoryLabel = categories.find((category) => category.id === item.category_id)?.label ?? "Clothing";
  const archived = item.deleted_at !== null;
  const facts = [
    ["Color", item.color], ["Pattern", item.pattern], ["Material", item.material], ["Fit", item.fit],
    ["Formality", item.formality], ["Brand", item.brand],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <div className="page-stack account-page">
      <Link className="back-link" href={archived ? "/wardrobe?view=trash" : "/wardrobe"}><ArrowLeft size={15} /> Back to {archived ? "archive" : "wardrobe"}</Link>
      <PageHeading eyebrow={categoryLabel.toUpperCase()} title={item.name} subtitle={`${item.subcategory ?? "Clothing piece"} · ${archived ? "Archived and recoverable" : `Added ${formatDate(item.created_at)}`}`} />
      <ActionFeedback notice={first(query.notice)} error={first(query.error)} />

      <section className="piece-detail-panel">
        <div className="piece-detail-emblem"><Shirt size={44} strokeWidth={1.2} /></div>
        <div className="piece-detail-body">
          <div className="piece-detail-heading"><span className="record-kicker">{categoryLabel}{item.subcategory ? ` · ${item.subcategory}` : ""}</span><span className={`record-status${archived ? " is-archived" : ""}`}>{archived ? "Archived" : "In your wardrobe"}</span></div>
          <p className="piece-detail-description">{item.notes || "A piece in your personal wardrobe. Add details below to make it easier to find and style later."}</p>
          {facts.length > 0 && <dl className="piece-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
          {!!item.season?.length && <div className="piece-tag-group"><span>Seasons</span><div className="record-tags">{item.season.map((value: string) => <span key={value}>{value}</span>)}</div></div>}
          {!!item.occasions?.length && <div className="piece-tag-group"><span>Occasions</span><div className="record-tags">{item.occasions.map((value: string) => <span key={value}>{value}</span>)}</div></div>}
          <div className="record-actions piece-detail-actions">
            {archived ? (
              <form action={restoreItemAction}><input type="hidden" name="itemId" value={item.id} /><button className="button button-outline" type="submit"><RotateCcw size={15} /> Restore to wardrobe</button></form>
            ) : (
              <>
                <Link className="button button-dark" href={`/wardrobe/${item.id}/edit`}>Edit details</Link>
                <form action={toggleItemFavoriteAction}><input type="hidden" name="itemId" value={item.id} /><input type="hidden" name="nextValue" value={item.is_favorite ? "false" : "true"} /><button className="button button-light" type="submit"><Heart size={15} fill={item.is_favorite ? "currentColor" : "none"} />{item.is_favorite ? "Remove favorite" : "Mark favorite"}</button></form>
                <details className="inline-confirm"><summary><Archive size={14} /> Archive</summary><form action={archiveItemAction}><input type="hidden" name="itemId" value={item.id} /><p>This hides the piece from your active wardrobe. It remains recoverable, and outfit links stay intact.</p><button className="button button-danger button-small" type="submit">Move to archive</button></form></details>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
