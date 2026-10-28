import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ActionFeedback, DataUnavailable } from "@/components/account/feedback";
import { ClothingForm } from "@/components/account/clothing-form";
import { PageHeading } from "@/components/ui";
import { requireAccountContext } from "@/lib/data/account";
import { isUuid } from "@/lib/data/validation";

type PageParams = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditClothingItemPage({ params, searchParams }: { params: PageParams; searchParams: SearchParams }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!isUuid(id)) notFound();
  const { supabase, user } = await requireAccountContext();
  const { data: item, error } = await supabase
    .from("clothing_items")
    .select("id, name, category_id, subcategory, color, pattern, material, fit, season, formality, occasions, brand, notes, deleted_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return <div className="page-stack"><DataUnavailable /></div>;
  if (!item || item.deleted_at) notFound();

  return (
    <div className="page-stack account-page account-form-page">
      <Link className="back-link" href={`/wardrobe/${id}`}><ArrowLeft size={15} /> Back to piece</Link>
      <PageHeading eyebrow="YOUR WARDROBE" title="Edit details" subtitle="Update the information for this piece in your account." />
      <ActionFeedback error={first(query.error)} />
      <section className="account-form-panel"><ClothingForm item={item} /></section>
    </div>
  );
}
