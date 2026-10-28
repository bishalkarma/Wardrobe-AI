import { ActionFeedback } from "@/components/account/action-feedback";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClothingForm } from "@/components/account/clothing-form";
import { PageHeading } from "@/components/ui";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewClothingItemPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return (
    <div className="page-stack account-page account-form-page">
      <Link className="back-link" href="/wardrobe"><ArrowLeft size={15} /> Back to wardrobe</Link>
      <PageHeading eyebrow="ADD TO YOUR OWN ACCOUNT" title="Add a piece" subtitle="Start with what you know. You can fill in more details later." />
      <ActionFeedback error={first(params.error)} />
      <section className="account-form-panel"><ClothingForm /></section>
    </div>
  );
}
