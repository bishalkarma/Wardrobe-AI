import Link from "next/link";
import { Archive, Plus, Search, ShieldCheck, Shirt } from "lucide-react";
import { ActionFeedback, DataUnavailable, EmptyAccountState } from "@/components/account/feedback";
import { WARDROBE_BULK_DELETE_FORM_ID } from "@/components/account/record-utils";
import { WardrobeSelectionManager } from "@/components/account/wardrobe-selection-manager";
import { WardrobeRecord } from "@/components/account/wardrobe-record";
import { PageHeading } from "@/components/ui";
import { requireAccountContext } from "@/lib/data/account";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function WardrobePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const view = first(params.view) === "trash" ? "trash" : "active";
  const query = first(params.q).trim().slice(0, 100);
  const selectedCategory = first(params.category);
  const { supabase, user } = await requireAccountContext();

  const [{ data: categories, error: categoryError }, { data: records, error: recordsError }] = await Promise.all([
    supabase.from("clothing_categories").select("id, label, sort_order").eq("is_active", true).order("sort_order"),
    supabase.from("clothing_items").select("id, name, category_id, subcategory, color, pattern, material, fit, season, formality, occasions, brand, notes, is_favorite, deleted_at, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  if (categoryError || recordsError || !categories || !records) return <div className="page-stack"><PageHeading eyebrow="YOUR PIECES" title="Your wardrobe" /><DataUnavailable /></div>;

  const categoryLabels = new Map(categories.map((category) => [category.id, category.label]));
  const categoryIds = new Set(categories.map((category) => category.id));
  const categoryFilter = categoryIds.has(selectedCategory) ? selectedCategory : "all";
  const normalizedQuery = query.toLocaleLowerCase();
  const shown = records.filter((item) => {
    const archived = item.deleted_at !== null;
    if ((view === "trash") !== archived) return false;
    if (categoryFilter !== "all" && item.category_id !== categoryFilter) return false;
    const label = categoryLabels.get(item.category_id) ?? "Clothing";
    const searchable = [item.name, label, item.subcategory, item.color, item.pattern, item.material, item.brand, ...(item.occasions ?? []), ...(item.season ?? [])].filter(Boolean).join(" ").toLocaleLowerCase();
    return searchable.includes(normalizedQuery);
  });
  const activeCount = records.filter((item) => item.deleted_at === null).length;
  const title = view === "trash" ? "Your archive" : "Your wardrobe";

  return (
    <div className="page-stack account-page">
      <PageHeading
        eyebrow="THE PIECES THAT ARE ACTUALLY YOURS"
        title={title}
        subtitle={view === "trash" ? `${shown.length} archived ${shown.length === 1 ? "piece" : "pieces"}. Restore any one to bring it back.` : `${activeCount} ${activeCount === 1 ? "piece" : "pieces"} saved to your account.`}
        action={view === "active" ? <Link className="button button-dark" href="/wardrobe/new"><Plus size={16} /> Add a piece</Link> : undefined}
      />

      <ActionFeedback notice={first(params.notice)} error={first(params.error)} />

      <div className="account-view-tabs" aria-label="Wardrobe views">
        <Link className={view === "active" ? "is-active" : ""} href="/wardrobe"><Shirt size={15} /> Active pieces <span>{activeCount}</span></Link>
        <Link className={view === "trash" ? "is-active" : ""} href="/wardrobe?view=trash"><Archive size={15} /> Archive <span>{records.filter((item) => item.deleted_at !== null).length}</span></Link>
      </div>

      {view === "active" && (
        <form className="account-search-form" action="/wardrobe" method="get">
          <label className="search-field"><Search size={17} /><input name="q" type="search" defaultValue={query} placeholder="Search your pieces" aria-label="Search your wardrobe" /></label>
          <label className="account-filter-select"><span className="sr-only">Category</span><select className="text-input" name="category" defaultValue={categoryFilter}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
          <button className="button button-light" type="submit">Apply</button>
          {(query || categoryFilter !== "all") && <Link className="button button-quiet" href="/wardrobe">Clear</Link>}
        </form>
      )}

      {shown.length ? (
        view === "active" ? (
          <WardrobeSelectionManager visibleCount={shown.length}>
            <div className="account-record-list">
              {shown.map((item) => <WardrobeRecord key={item.id} item={item} categoryLabel={categoryLabels.get(item.category_id) ?? "Clothing"} selectionFormId={WARDROBE_BULK_DELETE_FORM_ID} />)}
            </div>
          </WardrobeSelectionManager>
        ) : (
          <div className="account-record-list">
            {shown.map((item) => <WardrobeRecord key={item.id} item={item} categoryLabel={categoryLabels.get(item.category_id) ?? "Clothing"} />)}
          </div>
        )
      ) : view === "active" && activeCount === 0 ? (
        <EmptyAccountState title="Start with one piece you love" description="Add the clothes you already own. This space uses only pieces you enter for this signed-in account; photos and AI are not enabled yet." actionHref="/wardrobe/new" actionLabel="Add your first piece" />
      ) : view === "trash" ? (
        <EmptyAccountState title="Nothing in your archive" description="When you archive a piece, it stays recoverable here until you restore it." actionHref="/wardrobe" actionLabel="Back to my wardrobe" />
      ) : (
        <EmptyAccountState title="No matching pieces" description="Try a different search or category. Your saved records are unchanged." actionHref="/wardrobe" actionLabel="Clear filters" />
      )}

      <p className="account-privacy-note"><ShieldCheck size={15} /> Your wardrobe records are protected by account ownership policies. Demo sample garments never appear here.</p>
    </div>
  );
}
