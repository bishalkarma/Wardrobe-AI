"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Camera, ChevronRight, Sparkles } from "lucide-react";
import { usePrototype } from "@/components/prototype-provider";
import { ItemImage } from "@/components/ui";
import { MOCK_OUTFITS } from "@/lib/mock-data";

export function HomeScreen() {
  const { items, savedOutfits, samplePhoto, setSelectedOutfitId } = usePrototype();
  const featured = MOCK_OUTFITS[0];
  const recentItems = items.slice(0, 4);

  return (
    <div className="page-stack home-screen">
      <section className="home-intro">
        <div>
          <p className="eyebrow">WEDNESDAY, OCTOBER 7 <span className="eyebrow-divider">/</span> YOUR DAILY EDIT</p>
          <h1>Good morning, <em>Maya.</em></h1>
          <p className="page-subtitle">A little inspiration, pulled from the pieces you love.</p>
        </div>
        <Link className="text-link desktop-home-link" href="/wardrobe">Your wardrobe <ArrowUpRight size={16} /></Link>
      </section>

      {!samplePhoto && (
        <Link href="/profile/photo" className="photo-nudge">
          <span className="photo-nudge-icon"><Camera size={19} /></span>
          <span className="photo-nudge-copy"><strong>Add your photo</strong><small>See your style in a whole new way. You can do this later.</small></span>
          <span className="photo-nudge-action">Set up <ArrowRight size={15} /></span>
        </Link>
      )}

      <section className="daily-edit-card">
        <div className="daily-edit-copy">
          <div className="daily-edit-kicker"><span className="kicker-dot" /> TODAY’S LOOK <span className="kicker-separator">·</span> 01</div>
          <h2>Quiet<br /><em>confidence.</em></h2>
          <p>Warm neutrals, clean lines, and a little room to breathe. Three pieces already in your wardrobe.</p>
          <div className="look-meta-row"><span>3 pieces</span><span className="meta-divider" /><span>Smart casual</span><span className="meta-divider" /><span>For work</span></div>
          <Link className="button button-dark daily-edit-button" href="/try-on" onClick={() => setSelectedOutfitId(featured.id)}>
            Explore this look <ArrowRight size={17} />
          </Link>
          <span className="daily-edit-note"><Sparkles size={13} /> Mock edit · from your demo wardrobe</span>
        </div>
        <div className="daily-edit-image-wrap">
          <Image src={featured.image} alt="Illustrative outfit with an ivory shirt and olive trousers" fill priority sizes="(max-width: 760px) 100vw, 54vw" className="cover-image" />
          <div className="image-caption"><span className="caption-mark"><Sparkles size={13} /></span> Sample styling preview</div>
          <span className="image-index">01 <i /> 03</span>
        </div>
      </section>

      <section className="home-stats-grid" aria-label="Wardrobe overview">
        <Link href="/wardrobe" className="overview-card overview-wardrobe">
          <span className="overview-label">YOUR WARDROBE</span>
          <div className="overview-number-row"><strong>{items.length.toString().padStart(2, "0")}</strong><span className="overview-arrow"><ArrowUpRight size={17} /></span></div>
          <span className="overview-foot">pieces you love</span>
          <span className="overview-mini-tags"><i>8 ready to wear</i><i>4 categories</i></span>
        </Link>
        <Link href="/outfits" className="overview-card overview-outfits">
          <span className="overview-label">SAVED LOOKS</span>
          <div className="overview-number-row"><strong>{savedOutfits.length.toString().padStart(2, "0")}</strong><span className="overview-arrow"><ArrowUpRight size={17} /></span></div>
          <span className="overview-foot">outfits for later</span>
          <div className="saved-look-stack" aria-hidden="true"><span /><span /><span /></div>
        </Link>
      </section>

      <section className="home-section">
        <div className="section-heading-row">
          <div><p className="eyebrow">A FEW GOOD THINGS</p><h2>Recently in your wardrobe</h2></div>
          <Link className="text-link" href="/wardrobe">See all <ChevronRight size={16} /></Link>
        </div>
        <div className="recent-items-row">
          {recentItems.map((item) => (
            <Link className="recent-item" key={item.id} href="/wardrobe">
              <ItemImage src={item.image} alt={item.name} className="recent-item-image" sizes="(max-width: 680px) 40vw, 170px" />
              <span className="recent-item-name">{item.name}</span>
              <span className="recent-item-meta">{item.color} <i /> {item.category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="stylist-invite">
        <div className="stylist-invite-icon"><Sparkles size={18} /></div>
        <div className="stylist-invite-copy"><p className="eyebrow">YOUR PERSONAL STYLIST</p><h2>Not sure what to wear?</h2><p>Tell me what’s on your calendar. We’ll start with what’s already yours.</p></div>
        <Link className="button button-outline" href="/stylist">Let’s find a look <ArrowRight size={16} /></Link>
      </section>
    </div>
  );
}
