import { ActionFeedback } from "@/components/account/action-feedback";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bookmark, CheckCircle2, Plus, Shirt, Sparkles, UserRound } from "lucide-react";
import { DataUnavailable, EmptyAccountState } from "@/components/account/feedback";
import { PageHeading } from "@/components/ui";
import { firstParam } from "@/components/account/record-utils";
import { greetingName, requireAccountContext } from "@/lib/data/account";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AccountHomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { supabase, user } = await requireAccountContext();
  const [profileResponse, itemCountResponse, outfitCountResponse, itemsResponse, outfitsResponse, categoriesResponse] = await Promise.all([
    supabase.from("user_profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("clothing_items").select("id", { count: "exact", head: true }).eq("user_id", user.id).is("deleted_at", null),
    supabase.from("outfits").select("id", { count: "exact", head: true }).eq("user_id", user.id).is("deleted_at", null).eq("is_saved", true),
    supabase.from("clothing_items").select("id, name, category_id, color, created_at").eq("user_id", user.id).is("deleted_at", null).order("created_at", { ascending: false }).limit(4),
    supabase.from("outfits").select("id, name, occasion, style, created_at").eq("user_id", user.id).is("deleted_at", null).eq("is_saved", true).order("updated_at", { ascending: false }).limit(3),
    supabase.from("clothing_categories").select("id, label").eq("is_active", true),
  ]);

  if (profileResponse.error || itemCountResponse.error || outfitCountResponse.error || itemsResponse.error || outfitsResponse.error || categoriesResponse.error || !itemsResponse.data || !outfitsResponse.data || !categoriesResponse.data) {
    return <div className="page-stack"><PageHeading eyebrow="YOUR ACCOUNT" title="Your wardrobe home" /><DataUnavailable /></div>;
  }

  const displayName = greetingName(profileResponse.data?.display_name, user.email ?? undefined);
  const itemCount = itemCountResponse.count ?? 0;
  const outfitCount = outfitCountResponse.count ?? 0;
  const categoryLabels = new Map(categoriesResponse.data.map((category) => [category.id, category.label]));

  return (
    <div className="page-stack account-home-page">
      <ActionFeedback notice={firstParam(params.notice)} error={firstParam(params.error)} />
      <section className="account-home-hero">
        <div className="account-home-copy"><p className="eyebrow">YOUR PERSONAL WARDROBE</p><h1>Welcome, <em>{displayName}</em>.</h1><p>Your account is ready. Add pieces you own, keep their details close, and build looks from your real wardrobe.</p><div className="account-home-actions"><Link className="button button-dark" href="/wardrobe/new"><Plus size={16} />{itemCount ? "Add a piece" : "Add your first piece"}</Link><Link className="button button-outline" href="/profile">Set your preferences <ArrowRight size={15} /></Link></div></div>
        <div className="account-home-seal"><span><Shirt size={32} strokeWidth={1.25} /></span><small>YOUR OWN<br />PIECES ONLY</small></div>
      </section>

      <section className="account-stats-grid" aria-label="Your account overview">
        <Link className="account-stat-card" href="/wardrobe"><span className="account-stat-icon"><Shirt size={17} /></span><span className="account-stat-label">ACTIVE PIECES</span><strong>{itemCount.toString().padStart(2, "0")}</strong><small>in your wardrobe <ArrowUpRight size={13} /></small></Link>
        <Link className="account-stat-card" href="/outfits?view=saved"><span className="account-stat-icon"><Bookmark size={17} /></span><span className="account-stat-label">SAVED LOOKS</span><strong>{outfitCount.toString().padStart(2, "0")}</strong><small>outfits for later <ArrowUpRight size={13} /></small></Link>
        <Link className="account-stat-card" href="/profile"><span className="account-stat-icon"><UserRound size={17} /></span><span className="account-stat-label">PROFILE</span><strong className="account-stat-word">{profileResponse.data?.display_name ? "READY" : "SET UP"}</strong><small>your details and fit <ArrowUpRight size={13} /></small></Link>
      </section>

      {itemCount === 0 ? (
        <EmptyAccountState title="Let’s start with one thing you own" description="There are no sample records in this account. Add a piece you actually wear, then use it to build a saved outfit." actionHref="/wardrobe/new" actionLabel="Add your first piece" />
      ) : (
        <section className="account-content-section">
          <div className="account-section-heading"><span className="account-section-icon"><Shirt size={17} /></span><div><p className="eyebrow">RECENTLY ADDED</p><h2>Pieces in your wardrobe</h2></div><Link className="text-link" href="/wardrobe">View all <ArrowRight size={15} /></Link></div>
          <div className="account-recent-list">{itemsResponse.data.map((item) => <Link className="account-recent-row" key={item.id} href={`/wardrobe/${item.id}`}><span className="recent-row-mark"><Shirt size={17} /></span><span><strong>{item.name}</strong><small>{[categoryLabels.get(item.category_id) ?? "Clothing", item.color].filter(Boolean).join(" · ")}</small></span><ArrowUpRight size={15} /></Link>)}</div>
        </section>
      )}

      <section className="account-content-section account-next-steps">
        <div className="account-section-heading"><span className="account-section-icon"><CheckCircle2 size={17} /></span><div><p className="eyebrow">YOUR NEXT STEPS</p><h2>A simple start</h2></div></div>
        <div className="account-step-grid">
          <Link className="account-step-card" href="/wardrobe/new"><span>01</span><strong>Add a few real pieces</strong><small>Record the category, colors, seasons, and notes you know.</small><ArrowUpRight size={15} /></Link>
          <Link className="account-step-card" href="/profile"><span>02</span><strong>Set your preferences</strong><small>Save your fit, style, and color notes to your profile.</small><ArrowUpRight size={15} /></Link>
          <Link className="account-step-card" href={itemCount ? "/outfits/new" : "/wardrobe/new"}><span>03</span><strong>Build a saved outfit</strong><small>Combine items from your account; AI styling comes later.</small><ArrowUpRight size={15} /></Link>
        </div>
      </section>

      <section className="account-future-note"><span><Sparkles size={18} /></span><div><p className="eyebrow">WHAT’S COMING LATER</p><h2>AI styling, try-on, and private photo uploads</h2><p>Those features are not connected yet. This account will never be filled with demo garments or pretend results.</p></div><Link className="text-link" href="/wardrobe">Keep building <ArrowRight size={15} /></Link></section>

      {outfitsResponse.data.length > 0 && (
        <section className="account-content-section">
          <div className="account-section-heading"><span className="account-section-icon"><Bookmark size={17} /></span><div><p className="eyebrow">SAVED BY YOU</p><h2>Recent outfits</h2></div><Link className="text-link" href="/outfits">View all <ArrowRight size={15} /></Link></div>
          <div className="account-recent-list">{outfitsResponse.data.map((outfit) => <Link className="account-recent-row" key={outfit.id} href={`/outfits/${outfit.id}`}><span className="recent-row-mark"><Bookmark size={16} /></span><span><strong>{outfit.name}</strong><small>{[outfit.occasion, outfit.style].filter(Boolean).join(" · ") || "Personal outfit"}</small></span><ArrowUpRight size={15} /></Link>)}</div>
        </section>
      )}
    </div>
  );
}
