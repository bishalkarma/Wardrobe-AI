"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronRight, Heart, Send, Sparkles, WandSparkles } from "lucide-react";
import { usePrototype } from "@/components/prototype-provider";
import { MOCK_OUTFITS, STARTER_PROMPTS } from "@/lib/mock-data";
import type { Outfit } from "@/lib/types";

function RecommendationCard({ outfit }: { outfit: Outfit }) {
  const { items, setSelectedOutfitId } = usePrototype();
  const selectedItems = outfit.itemIds.map((id) => items.find((item) => item.id === id)).filter((item) => item !== undefined);

  return (
    <article className="recommendation-card">
      <div className="recommendation-image"><Image src={outfit.image} alt={`Illustrative outfit for ${outfit.occasion}`} fill sizes="(max-width: 760px) 100vw, 360px" className="cover-image" /><span className="recommendation-image-label"><Sparkles size={12} /> SAMPLE LOOK</span></div>
      <div className="recommendation-body">
        <div className="recommendation-topline"><span className="eyebrow">FROM YOUR WARDROBE</span><span className="recommendation-count"><Check size={13} /> {selectedItems.length} pieces you own</span></div>
        <h3>{outfit.name}</h3>
        <p>{outfit.reason}</p>
        <div className="recommendation-items">{selectedItems.map((item) => <span key={item.id}>{item.name}</span>)}</div>
        <div className="recommendation-foot"><span>{outfit.style} <i /> {outfit.occasion}</span><Link href="/try-on" className="button button-dark button-small" onClick={() => setSelectedOutfitId(outfit.id)}>Preview look <ArrowRight size={14} /></Link></div>
      </div>
    </article>
  );
}

export function StylistScreen() {
  const { notify, items } = usePrototype();
  const [prompt, setPrompt] = useState("");
  const [sentPrompt, setSentPrompt] = useState("");
  const [activeOutfit, setActiveOutfit] = useState<Outfit>(MOCK_OUTFITS[0]);
  const [responseCount, setResponseCount] = useState(0);

  function getLookForPrompt(value: string) {
    const normalized = value.toLowerCase();
    if (normalized.includes("weekend") || normalized.includes("casual") || normalized.includes("shirt")) return MOCK_OUTFITS[1];
    if (normalized.includes("dinner") || normalized.includes("evening")) return MOCK_OUTFITS[2];
    return MOCK_OUTFITS[0];
  }

  function sendPrompt(value = prompt) {
    const clean = value.trim();
    if (!clean) return;
    setSentPrompt(clean);
    setActiveOutfit(getLookForPrompt(clean));
    setResponseCount((count) => count + 1);
    setPrompt("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendPrompt();
  }

  return (
    <div className="page-stack stylist-screen">
      <div className="stylist-page-heading">
        <div><p className="eyebrow">A LITTLE HELP, FROM YOUR OWN CLOSET</p><h1>What are we <em>wearing?</em></h1><p className="page-subtitle">Tell me where you’re headed. I’ll start with the pieces you already own.</p></div>
        <div className="stylist-orbit" aria-hidden="true"><span className="orbit-ring orbit-ring-one" /><span className="orbit-ring orbit-ring-two" /><span className="orbit-core"><Sparkles size={22} /></span><i className="orbit-dot orbit-dot-one" /><i className="orbit-dot orbit-dot-two" /></div>
      </div>

      <div className="stylist-workspace">
        <section className="conversation-card">
          <div className="conversation-header"><div className="stylist-avatar"><Sparkles size={18} /></div><div><strong>Your stylist</strong><small><span className="online-dot" /> Here to help</small></div><span className="conversation-demo">MOCK CONVERSATION</span></div>
          <div className="conversation-thread" aria-live="polite">
            <div className="assistant-row"><div className="assistant-mini-avatar"><Sparkles size={13} /></div><div className="assistant-bubble"><p>Hi Maya, I’ve got your {items.length} wardrobe pieces in mind. What’s on your calendar?</p><small>JUST NOW</small></div></div>
            {sentPrompt && <div className="user-bubble-wrap"><div className="user-bubble">{sentPrompt}</div><span className="message-time">JUST NOW</span></div>}
            {(responseCount > 0 || !sentPrompt) && <div className="assistant-row assistant-response"><div className="assistant-mini-avatar"><Sparkles size={13} /></div><div className="assistant-bubble"><p>{responseCount > 0 ? `I found a few pieces that work for that. Here’s a ${activeOutfit.style.toLowerCase()} direction, built from your wardrobe.` : "Here’s one place to start: an easy, softly polished look from pieces already in your wardrobe."}</p><small>WARDROBE MATCH <span><Check size={11} /> {activeOutfit.itemIds.length} ITEM IDS</span></small></div></div>}
            <RecommendationCard outfit={activeOutfit} />
          </div>

          <div className="prompt-area">
            <p className="prompt-label">A FEW PLACES TO START</p>
            <div className="prompt-chips">{STARTER_PROMPTS.map((suggestion) => <button key={suggestion} className="prompt-chip" type="button" onClick={() => sendPrompt(suggestion)}>{suggestion}<ChevronRight size={13} /></button>)}</div>
            <form className="chat-input-form" onSubmit={submit}><label className="sr-only" htmlFor="stylist-prompt">Ask your stylist</label><input id="stylist-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about an occasion, a piece, a feeling…" /><button type="submit" aria-label="Send message" disabled={!prompt.trim()}><Send size={17} /></button></form>
            <p className="chat-disclaimer"><WandSparkles size={13} /> A sample stylist experience. No AI is connected.</p>
          </div>
        </section>

        <aside className="stylist-side-note">
          <div className="side-note-top"><span className="side-note-icon"><Heart size={17} /></span><span className="eyebrow">A GOOD PLACE TO START</span></div>
          <h2>Style should feel like <em>you.</em></h2>
          <p>Recommendations here are grounded in your wardrobe — not a shopping list of things you don’t own.</p>
          <div className="side-note-divider" />
          <div className="wardrobe-context"><span className="context-count">{items.length}</span><span><strong>pieces in your edit</strong><small>All yours. All considered.</small></span></div>
          <Link href="/wardrobe" className="text-link">Explore your wardrobe <ArrowRight size={15} /></Link>
          <div className="privacy-mini"><Check size={14} /> Your closet is the starting point.</div>
        </aside>
      </div>
    </div>
  );
}
