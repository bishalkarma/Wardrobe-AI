"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Heart, Sparkles } from "lucide-react";
import { usePrototype } from "@/components/prototype-provider";
import { MOCK_OUTFITS } from "@/lib/mock-data";
import { Rating } from "@/components/ui";

export function OutfitDetailScreen() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const outfit = MOCK_OUTFITS.find((look) => look.id === id);
  const { items, savedOutfits, favoriteOutfitIds, ratings, saveOutfit, unsaveOutfit, toggleOutfitFavorite, rateOutfit, setSelectedOutfitId } = usePrototype();

  if (!outfit) return <div className="page-stack"><Link className="back-link" href="/outfits"><ArrowLeft size={15} /> Back to saved looks</Link><div className="empty-state"><h2>That look isn’t here</h2><p>Try one of your saved outfits instead.</p><Link className="button button-dark" href="/outfits">View saved looks</Link></div></div>;

  const outfitItems = outfit.itemIds.map((itemId) => items.find((item) => item.id === itemId)).filter((item) => item !== undefined);
  const isSaved = savedOutfits.some((look) => look.id === outfit.id);
  const isFavorite = favoriteOutfitIds.includes(outfit.id);

  return (
    <div className="page-stack outfit-detail-screen">
      <Link href="/outfits" className="back-link"><ArrowLeft size={15} /> Back to saved looks</Link>
      <div className="outfit-detail-grid">
        <div className="outfit-detail-hero"><Image src={outfit.image} alt={`Illustrative outfit sample for ${outfit.name}`} fill priority sizes="(max-width: 760px) 100vw, 55vw" className="cover-image" /><span className="sample-result-badge"><Sparkles size={13} /> SAMPLE LOOK</span><span className="outfit-detail-photo-caption">Illustrative outfit preview · demo only</span></div>
        <section className="outfit-detail-copy"><p className="eyebrow">{outfit.occasion.toUpperCase()} <i /> {outfit.style.toUpperCase()}</p><h1>{outfit.name}<em>.</em></h1><p className="outfit-detail-reason">{outfit.reason}</p><div className="detail-piece-count"><span><Check size={14} /></span>{outfitItems.length} pieces from your wardrobe</div>
          <div className="detail-piece-list"><h2>The pieces</h2>{outfitItems.map((item, index) => <div key={item.id} className="detail-piece-row"><div className="detail-piece-image"><Image src={item.image} alt={item.name} fill sizes="58px" className="cover-image" /></div><span className="detail-piece-name"><small>0{index + 1} · {item.category}</small><strong>{item.name}</strong><span>{item.color} · {item.subcategory}</span></span><Check size={15} className="piece-owned-check" /></div>)}</div>
          <div className="outfit-detail-actions"><Link href="/try-on" className="button button-dark button-full" onClick={() => setSelectedOutfitId(outfit.id)}>See this look <ArrowRight size={16} /></Link><div className="outfit-action-row"><button type="button" className="button button-light" onClick={() => isSaved ? unsaveOutfit(outfit.id) : saveOutfit(outfit)}>{isSaved ? <Check size={15} /> : <ArrowRight size={15} />}{isSaved ? "Saved" : "Save outfit"}</button><button type="button" className={`button button-light${isFavorite ? " favorite-button-active" : ""}`} onClick={() => toggleOutfitFavorite(outfit.id)}><Heart size={15} fill={isFavorite ? "currentColor" : "none"} />{isFavorite ? "Favorited" : "Favorite"}</button></div></div>
          <div className="detail-rating"><span>Would you wear it?</span><Rating value={ratings[outfit.id]} onChange={(value) => rateOutfit(outfit.id, value)} /></div>
        </section>
      </div>
      <div className="outfit-fidelity-note"><Sparkles size={14} /> This is a sample outfit image, not a generated try-on result. Clothing fidelity will be evaluated before real generation is enabled.</div>
    </div>
  );
}
