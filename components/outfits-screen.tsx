"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Bookmark, Heart, Sparkles } from "lucide-react";
import { usePrototype } from "@/components/prototype-provider";
import { PageHeading } from "@/components/ui";

export function OutfitsScreen() {
  const { savedOutfits, favoriteOutfitIds, toggleOutfitFavorite, setSelectedOutfitId } = usePrototype();
  const [filter, setFilter] = useState<"Saved looks" | "Favorites">("Saved looks");
  const shownOutfits = filter === "Favorites" ? savedOutfits.filter((outfit) => favoriteOutfitIds.includes(outfit.id)) : savedOutfits;

  return (
    <div className="page-stack outfits-screen">
      <PageHeading eyebrow="A LITTLE INSPIRATION FOR LATER" title="Your saved looks" subtitle="Good outfits, ready when you are." action={<Link className="button button-outline" href="/stylist"><Sparkles size={15} /> Find a new look</Link>} />
      <div className="outfits-toolbar"><div className="outfit-filter-tabs" role="tablist" aria-label="Filter saved outfits">{(["Saved looks", "Favorites"] as const).map((value) => <button key={value} type="button" role="tab" aria-selected={filter === value} className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>{value}<span>{value === "Saved looks" ? savedOutfits.length : favoriteOutfitIds.filter((id) => savedOutfits.some((outfit) => outfit.id === id)).length}</span></button>)}</div><span className="outfits-toolbar-note"><Bookmark size={14} /> Just for you</span></div>

      {shownOutfits.length ? (
        <div className="outfit-grid">
          {shownOutfits.map((outfit, index) => {
            const favorite = favoriteOutfitIds.includes(outfit.id);
            return (
              <article className="saved-outfit-card" key={outfit.id}>
                <Link href={`/outfits/${outfit.id}`} className="saved-outfit-image" onClick={() => setSelectedOutfitId(outfit.id)}>
                  <Image src={outfit.image} alt={`Illustrative sample for ${outfit.name}`} fill sizes="(max-width: 680px) 92vw, (max-width: 1080px) 44vw, 390px" className="cover-image" />
                  <span className="outfit-image-index">0{index + 1} <i /> 0{shownOutfits.length}</span>
                  <span className="saved-outfit-view">Open look <ArrowUpRight size={14} /></span>
                </Link>
                <button className={`outfit-card-heart${favorite ? " is-active" : ""}`} type="button" aria-label={favorite ? "Remove outfit from favorites" : "Add outfit to favorites"} aria-pressed={favorite} onClick={() => toggleOutfitFavorite(outfit.id)}><Heart size={17} fill={favorite ? "currentColor" : "none"} /></button>
                <div className="saved-outfit-copy"><div className="saved-outfit-meta"><span>{outfit.occasion}</span><span className="meta-dot" /> <span>{outfit.style}</span></div><h2>{outfit.name}</h2><p>{outfit.reason}</p><Link href={`/outfits/${outfit.id}`} className="text-link" onClick={() => setSelectedOutfitId(outfit.id)}>View outfit details <ArrowUpRight size={15} /></Link></div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state outfits-empty"><span className="empty-state-icon"><Heart size={22} /></span><h2>{filter === "Favorites" ? "No favorites just yet" : "Your saved looks will be here"}</h2><p>When a look feels like you, save it here for another day.</p><Link className="button button-dark" href="/stylist">Ask your stylist <ArrowUpRight size={15} /></Link></div>
      )}
      <p className="saved-looks-note"><span /> Sample outfits are built from your mock wardrobe. Saved changes stay in this browser session only.</p>
    </div>
  );
}
