import Link from "next/link";
import { Archive, Bookmark, Heart, Plus, ShieldCheck } from "lucide-react";
import { ActionFeedback, DataUnavailable, EmptyAccountState } from "@/components/account/feedback";
import { OutfitRecord } from "@/components/account/outfit-record";
import { PageHeading } from "@/components/ui";
import { requireAccountContext } from "@/lib/data/account";
import { firstParam } from "@/components/account/record-utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type View = "saved" | "favorites" | "all" | "trash";
type AccountPiece = { id: string; name: string; categoryLabel: string; color: string | null; deleted_at: string | null };

export default async function OutfitsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedView = firstParam(params.view);
  const view: View = ["saved", "favorites", "all", "trash"].includes(requestedView) ? requestedView as View : "saved";
  const { supabase, user } = await requireAccountContext();

  const [{ data: outfits, error: outfitsError }, { data: clothingItems, error: clothingError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabase.from("outfits").select("id, name, occasion, style, reason, is_favorite, is_saved, rating, deleted_at, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("clothing_items").select("id, deleted_at").eq("user_id", user.id),
    supabase.from("clothing_categories").select("id, label").eq("is_active", true),
  ]);

  if (outfitsError || clothingError || categoriesError || !outfits || !clothingItems || !categories) {
    return <div className="page-stack"><PageHeading eyebrow="YOUR OUTFITS" title="Saved looks" /><DataUnavailable /></div>;
  }

  const activeOutfits = outfits.filter((outfit) => outfit.deleted_at === null);
  const archivedOutfits = outfits.filter((outfit) => outfit.deleted_at !== null);
  const activeClothingItems = clothingItems.filter((item) => item.deleted_at === null);
  const outfitIds = outfits.map((outfit) => outfit.id);
  const { data: links, error: linksError } = outfitIds.length
    ? await supabase.from("outfit_items").select("outfit_id, clothing_item_id").eq("user_id", user.id).in("outfit_id", outfitIds)
    : { data: [], error: null };
  if (linksError || !links) return <div className="page-stack"><PageHeading eyebrow="YOUR OUTFITS" title="Saved looks" /><DataUnavailable /></div>;

  const pieceIds = [...new Set(links.map((link) => link.clothing_item_id as string))];
  const { data: pieces, error: piecesError } = pieceIds.length
    ? await supabase.from("clothing_items").select("id, name, category_id, color, deleted_at").eq("user_id", user.id).in("id", pieceIds)
    : { data: [], error: null };
  if (piecesError || !pieces) return <div className="page-stack"><PageHeading eyebrow="YOUR OUTFITS" title="Saved looks" /><DataUnavailable /></div>;

  const categoryLabels = new Map(categories.map((category) => [category.id, category.label]));
  const piecesById = new Map<string, AccountPiece>(pieces.map((piece) => [piece.id, {
    id: piece.id,
    name: piece.name,
    categoryLabel: categoryLabels.get(piece.category_id) ?? "Clothing",
    color: piece.color,
    deleted_at: piece.deleted_at,
  }]));
  const pieceLists = new Map<string, AccountPiece[]>();
  for (const link of links) {
    const current = pieceLists.get(link.outfit_id) ?? [];
    const piece = piecesById.get(link.clothing_item_id);
    if (piece) current.push(piece);
    pieceLists.set(link.outfit_id, current);
  }

  const counts = {
    saved: activeOutfits.filter((outfit) => outfit.is_saved).length,
    favorites: activeOutfits.filter((outfit) => outfit.is_favorite).length,
    all: activeOutfits.length,
    trash: archivedOutfits.length,
  };
  const shown = view === "trash"
    ? archivedOutfits
    : activeOutfits.filter((outfit) => view === "all" || (view === "favorites" ? outfit.is_favorite : outfit.is_saved));
  const createHref = activeClothingItems.length ? "/outfits/new" : "/wardrobe/new";
  const createLabel = activeClothingItems.length ? "Create an outfit" : "Add your first piece";

  return (
    <div className="page-stack account-page">
      <PageHeading eyebrow="LOOKS BUILT FROM YOUR OWN PIECES" title="Your outfits" subtitle={`${counts.saved} saved ${counts.saved === 1 ? "look" : "looks"} · ${counts.all} active outfits`} action={<Link className="button button-dark" href={createHref}><Plus size={16} />{createLabel}</Link>} />
      <ActionFeedback notice={firstParam(params.notice)} error={firstParam(params.error)} />

      <nav className="account-view-tabs outfit-view-tabs" aria-label="Outfit views">
        <Link className={view === "saved" ? "is-active" : ""} href="/outfits?view=saved"><Bookmark size={15} /> Saved <span>{counts.saved}</span></Link>
        <Link className={view === "favorites" ? "is-active" : ""} href="/outfits?view=favorites"><Heart size={15} /> Favorites <span>{counts.favorites}</span></Link>
        <Link className={view === "all" ? "is-active" : ""} href="/outfits?view=all">All <span>{counts.all}</span></Link>
        <Link className={view === "trash" ? "is-active" : ""} href="/outfits?view=trash"><Archive size={15} /> Archive <span>{counts.trash}</span></Link>
      </nav>

      {shown.length ? (
        <div className="account-outfit-list">{shown.map((outfit) => <OutfitRecord key={outfit.id} outfit={outfit} items={pieceLists.get(outfit.id) ?? []} />)}</div>
      ) : view === "trash" ? (
        <EmptyAccountState title="No archived outfits" description="Restore an archived outfit or permanently delete it from here." actionHref="/outfits?view=all" actionLabel="Back to active outfits" />
      ) : activeClothingItems.length === 0 ? (
        <EmptyAccountState title="Add your own pieces first" description="Outfits are assembled only from active garments in your account. Add your first piece to begin." actionHref="/wardrobe/new" actionLabel="Add a wardrobe piece" />
      ) : view === "saved" && counts.all > counts.saved ? (
        <EmptyAccountState title="No saved looks yet" description="You have an outfit that is not marked saved. Browse all outfits or create another look from your wardrobe." actionHref="/outfits?view=all" actionLabel="Browse all outfits" />
      ) : (
        <EmptyAccountState title={view === "favorites" ? "No favorite outfits yet" : "Your first outfit is waiting"} description="Choose a few pieces from your wardrobe and save the combination here." actionHref="/outfits/new" actionLabel="Create an outfit" />
      )}

      <p className="account-privacy-note"><ShieldCheck size={15} /> Only items from your account can be linked. Demo outfits and sample records stay in the separate demo.</p>
    </div>
  );
}
