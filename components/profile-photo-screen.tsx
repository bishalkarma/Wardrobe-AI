"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Camera, Check, ImagePlus, Lightbulb, LockKeyhole, RefreshCw, Trash2, UserRound } from "lucide-react";
import { usePrototype } from "@/components/prototype-provider";

export function ProfilePhotoScreen() {
  const { samplePhoto, setSamplePhoto, notify } = usePrototype();

  return (
    <div className="onboarding-shell page-stack">
      <Link href="/welcome" className="back-link"><ArrowLeft size={16} /> Back to welcome</Link>
      <div className="onboarding-progress" aria-label="Onboarding step 1 of 3"><span className="is-current" /><span /><span /></div>
      <div className="onboarding-heading">
        <p className="eyebrow">STEP 01 <i /> MAKE IT YOURS</p>
        <h1>First, let’s meet <em>you.</em></h1>
        <p className="page-subtitle">A full-body photo helps us show how your own wardrobe might come together on you.</p>
      </div>

      <div className="photo-setup-grid">
        <section className={`photo-dropzone${samplePhoto ? " has-photo" : ""}`}>
          {samplePhoto ? (
            <>
              <Image src="/images/mock-outfit-editorial.jpg" alt="Sample photo preview for the demo" fill sizes="(max-width: 760px) 100vw, 440px" className="cover-image" />
              <div className="photo-preview-overlay"><span className="sample-photo-tag"><span /> Sample photo · demo only</span><span className="photo-ready-check"><Check size={15} /> Looking good</span></div>
            </>
          ) : (
            <>
              <div className="photo-placeholder-mark"><UserRound size={37} strokeWidth={1.2} /></div>
              <span className="photo-drop-label">YOUR PHOTO, YOUR CHOICE</span>
              <h2>A little more you.</h2>
              <p>Add a photo to preview your outfits. It can always be replaced or removed.</p>
              <div className="photo-choice-row">
                <button type="button" className="button button-dark" onClick={() => notify("Camera access is not connected in this prototype.")}><Camera size={16} /> Take a photo</button>
                <button type="button" className="button button-light" onClick={() => notify("Gallery upload is not connected in this prototype.")}><ImagePlus size={16} /> Choose photo</button>
              </div>
              <button className="sample-photo-action" type="button" onClick={() => setSamplePhoto(true)}>Preview with a sample photo</button>
            </>
          )}
        </section>

        <aside className="photo-guidance-card">
          <div className="guidance-top"><span className="guidance-icon"><Lightbulb size={18} /></span><p className="eyebrow">A FEW HELPFUL TIPS</p></div>
          <h2>Keep it simple.<br /><em>Keep it you.</em></h2>
          <ul className="guidance-list">
            <li><span className="guidance-check"><Check size={13} /></span><span><strong>Full body, if possible</strong><small>Head to toe helps us show the whole look.</small></span></li>
            <li><span className="guidance-check"><Check size={13} /></span><span><strong>Good, natural light</strong><small>A bright room makes details easier to see.</small></span></li>
            <li><span className="guidance-check"><Check size={13} /></span><span><strong>Just you in the frame</strong><small>A clear, simple background works best.</small></span></li>
          </ul>
          <div className="privacy-note"><LockKeyhole size={15} /><span>Your photo is private. This demo does not upload or store images.</span></div>
        </aside>
      </div>

      <div className="onboarding-footer">
        <Link href="/" className="text-link">Skip for now</Link>
        <div className="photo-actions">
          {samplePhoto && <button className="button button-quiet" type="button" onClick={() => notify("Choose photo is a prototype placeholder.")}><RefreshCw size={15} /> Replace</button>}
          {samplePhoto && <button className="button button-quiet danger-text" type="button" onClick={() => { setSamplePhoto(false); notify("Sample photo removed from this demo."); }}><Trash2 size={15} /> Remove</button>}
          <Link href="/wardrobe" className="button button-dark">{samplePhoto ? "Continue" : "Continue without photo"} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
