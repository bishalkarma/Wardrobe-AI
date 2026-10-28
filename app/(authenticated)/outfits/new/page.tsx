import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ActionFeedback, DataUnavailable, EmptyAccountState } from "@/components/account/feedback";
import { OutfitForm } from "@/components/account/outfit-form";
import { PageHeading } from "@/components/ui";
import { firstParam } from "@/components/account/record-utils";
import { requireAccountContext } from "@/lib/data/account";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NewOutfitPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { supabase, user } = await requireAccountContext();
  const [{ data: items, error: itemsError }, { data: categories, error: categoriesError }] = await Promise.all([
    supabase.from("clothing_items").select("id, name, category_id, color, deleted_at").eq("user_id", user.id).is("deleted_at", null).order("created_at", { ascending: false }),
    supabase.from("clothing_categories").select("id, label").eq("is_active", true),
  ]);

  if (itemsError || categoriesError || !items || !categories) return <div className="page-stack"><DataUnavailable /></div>;
  const categoryLabels = new Map(categories.map((category) => [category.id, category.label]));

  return (
    <div className="page-stack account-page account-form-page">
      <Link className="back-link" href="/outfits"><ArrowLeft size={15} /> Back to outfits</Link>
      <PageHeading eyebrow="A LOOK FROM YOUR OWN WARDROBE" title="Put a look together" subtitle="Pick active pieces you own. You can save a note, mark favorites, and rate the combination." />
      <ActionFeedback error={firstParam(params.error)} />
      {items.length ? (
        <section className="account-form-panel"><OutfitForm items={items.map((item) => ({ id: item.id, name: item.name, categoryLabel: categoryLabels.get(item.category_id) ?? "Clothing", color: item.color }))} /></section>
      ) : (
        <EmptyAccountState title="Your wardrobe needs a first piece" description="Outfits are linked to real items you have saved in your account. Add a garment before creating a look." actionHref="/wardrobe/new" actionLabel="Add a piece" />
      )}
    </div>
  );
}
