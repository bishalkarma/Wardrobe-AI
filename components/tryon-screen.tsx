"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Heart, LoaderCircle, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { usePrototype } from "@/components/prototype-provider";
import { MOCK_OUTFITS } from "@/lib/mock-data";
import { Rating } from "@/components/ui";

type GenerationState = "ready" | "processing" | "success" | "failed";

export function TryOnScreen() {
  const {
    items,
    selectedOutfitId,
    savedOutfits,
    favoriteOutfitIds,
    ratings,
    setSelectedOutfitId,
    saveOutfit,
    unsaveOutfit,
    toggleOutfitFavorite,
    rateOutfit,
    notify,
  } = usePrototype();
  const [generationState, setGenerationState] = useState<GenerationState>("ready");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [generationAttempt, setGenerationAttempt] = useState(0);
  const outfit = MOCK_OUTFITS.find((look) => look.id === selectedOutfitId) ?? MOCK_OUTFITS[0];
  const outfitItems = outfit.itemIds.map((id) => items.find((item) => item.id === id)).filter((item) => item !== undefined);
  const isSaved = savedOutfits.some((look) => look.id === outfit.id);
  const isFavorite = favoriteOutfitIds.includes(outfit.id);

  useEffect(() => {
    if (generationState !== "processing") return;
    const timer = window.setTimeout(() => setGenerationState(simulateFailure ? "failed" : "success"), 1900);
    return () => window.clearTimeout(timer);
  }, [generationState, generationAttempt, simulateFailure]);

  function generate() {
    setGenerationState("processing");
    setGenerationAttempt((count) => count + 1);
  }

  function cycleOutfit() {
    const next = MOCK_OUTFITS[(MOCK_OUTFITS.findIndex((look) => look.id === outfit.id) + 1) % MOCK_OUTFITS.length];
    setSelectedOutfitId(next.id);
    setGenerationState("ready");
  }

  return (
    <div className="page-stack tryon-screen">
      <div className="tryon-topline"><Link href="/stylist" className="back-link"><ArrowLeft size={15} /> Back to your stylist</Link><span className="demo-pill"><span /> Sample generation</span></div>
      <div className="tryon-heading"><div><p className="eyebrow">YOUR LOOK, IN CONTEXT</p><h1>See how it <em>comes together.</em></h1><p className="page-subtitle">An illustrative preview of an outfit built from your wardrobe.</p></div><button className="button button-quiet change-look-button" type="button" onClick={cycleOutfit}><RefreshCw size={15} /> Try another look</button></div>

      <div className="tryon-layout">
        <section className={`tryon-preview tryon-preview-${generationState}`} aria-live="polite">
          {generationState === "failed" ? (
            <div className="generation-failure"><span className="failure-icon"><AlertTriangle size={22} /></span><span className="eyebrow">PREVIEW NOT READY</span><h2>That didn’t come together.</h2><p>Something got in the way of creating this sample preview. Your selected pieces are still here.</p><button className="button button-dark" type="button" onClick={generate}><RefreshCw size={15} /> Try again</button></div>
          ) : generationState === "processing" ? (
            <div className="generation-loading"><span className="loader-wrap"><LoaderCircle size={31} className="spin-icon" /></span><span className="eyebrow">PUTTING THE LOOK TOGETHER</span><h2>One moment, please.</h2><p>This is a simulated generation state for the prototype.</p><div className="loading-steps"><span className="step-done"><Check size={12} /> Outfit selected</span><i /><span className="step-current"><span /> Preparing preview</span><i /><span>Ready to style</span></div></div>
          ) : (
            <>
              <Image src={outfit.image} alt={`Illustrative sample outfit: ${outfit.name}`} fill priority sizes="(max-width: 760px) 100vw, 60vw" className="cover-image" />
              <div className="tryon-image-vignette" />
              <div className="tryon-preview-badges"><span className="sample-result-badge"><Sparkles size={13} /> {generationState === "success" ? "SAMPLE PREVIEW" : "ILLUSTRATIVE SAMPLE"}</span><span className="preview-count">01 <i /> 01</span></div>
              {generationState === "ready" && <div className="ready-overlay"><span className="ready-icon"><Sparkles size={17} /></span><p>This image is an illustrative sample.<br />No try-on has been generated yet.</p></div>}
              {generationState === "success" && <div className="preview-success-note"><span><Check size={13} /></span> Sample image · not generated from your photo</div>}
            </>
          )}
        </section>

        <aside className="tryon-details">
          <div className="tryon-look-heading"><p className="eyebrow">THE SELECTED LOOK</p><h2>{outfit.name}</h2><p>{outfit.occasion} <i /> {outfit.style}</p></div>
          <div className="selected-items-list">
            {outfitItems.map((item, index) => (
              <div className="selected-item" key={item.id}><div className="selected-item-image"><Image src={item.image} alt={item.name} fill sizes="64px" className="cover-image" /></div><span className="selected-item-text"><small>0{index + 1} · {item.category}</small><strong>{item.name}</strong><span>{item.color}</span></span><span className="selected-item-check"><Check size={13} /></span></div>
            ))}
          </div>
          <div className="look-rationale"><span className="rationale-icon"><Sparkles size={15} /></span><p>{outfit.reason}</p></div>
          {generationState !== "success" && generationState !== "processing" && generationState !== "failed" && <button className="button button-dark button-full" type="button" onClick={generate}><Sparkles size={16} /> Generate sample try-on</button>}
          {generationState === "success" && <div className="tryon-success-actions"><button className="button button-dark button-full" type="button" onClick={() => isSaved ? unsaveOutfit(outfit.id) : saveOutfit(outfit)}>{isSaved ? <Check size={16} /> : <ArrowRight size={16} />}{isSaved ? "Saved to your outfits" : "Save this outfit"}</button><button className={`favorite-outfit-action${isFavorite ? " is-active" : ""}`} type="button" onClick={() => toggleOutfitFavorite(outfit.id)}><Heart size={16} fill={isFavorite ? "currentColor" : "none"} />{isFavorite ? "In your favorites" : "Add to favorites"}</button><div className="rating-row"><span>How does this feel?</span><Rating value={ratings[outfit.id]} onChange={(value) => rateOutfit(outfit.id, value)} /></div></div>}
          <div className="fidelity-disclaimer"><ShieldCheck size={15} /><span>Real try-on quality will be measured. This sample does not claim exact identity or garment preservation.</span></div>
          <button className="simulate-failure-link" type="button" onClick={() => { setSimulateFailure(true); setGenerationState("ready"); notify("Failure simulation is on for the next preview."); }}>Preview a failure state</button>
          {simulateFailure && <button className="simulate-reset-link" type="button" onClick={() => { setSimulateFailure(false); setGenerationState("ready"); notify("Success simulation restored."); }}>Reset demo to success</button>}
        </aside>
      </div>
    </div>
  );
}
