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
        <p className="page-subtitle">A full-body photo could personalize previews. Real photo selection and uploads are unavailable in this prototype; you can preview a bundled sample instead.</p>
      </div>

      <div className="photo-setup-grid">
        <section className={`photo-dropzone${samplePhoto ? " has-photo" : ""}`}>
          {samplePhoto ? (
            <>
              <Image src="/images/mock-outfit-editorial.jpg" alt="Bundled illustrative sample shown as a demo preview, not a personal photo" fill sizes="(max-width: 760px) 100vw, 440px" className="cover-image" />
              <div className="photo-preview-overlay"><span className="sample-photo-tag"><span /> Bundled sample · demo preview</span><span className="photo-ready-check"><Check size={15} /> Preview ready</span></div>
            </>
          ) : (
            <>
              <div className="photo-placeholder-mark"><UserRound size={37} strokeWidth={1.2} /></div>
              <span className="photo-drop-label">SAMPLE PREVIEW · DEMO ONLY</span>
              <h2>A little more you.</h2>
              <p>Personal photos cannot be selected or uploaded here. Preview the bundled sample to see this demo state.</p>
              <div className="photo-choice-row">
                <button type="button" className="button button-light" onClick={() => notify("Camera capture is unavailable in this prototype. No photo was taken or uploaded.")}><Camera size={16} /> Camera unavailable</button>
                <button type="button" className="button button-light" onClick={() => notify("Selecting a personal photo and uploading it are unavailable in this prototype. Nothing was selected or uploaded.")}><ImagePlus size={16} /> Photo picker unavailable</button>
              </div>
              <button className="sample-photo-action" type="button" onClick={() => { setSamplePhoto(true); notify("Bundled sample preview selected. No personal photo was selected or uploaded."); }}>Preview bundled sample</button>
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
          <div className="privacy-note"><LockKeyhole size={15} /><span>Only a bundled sample preview is available. No personal image is captured, selected, uploaded, or stored.</span></div>
        </aside>
      </div>

      <div className="onboarding-footer">
        <Link href="/" className="text-link">Skip for now</Link>
        <div className="photo-actions">
          {samplePhoto && <button className="button button-quiet" type="button" onClick={() => { setSamplePhoto(false); notify("Bundled sample preview cleared. Personal photos cannot be added in this prototype."); }}><RefreshCw size={15} /> Replace</button>}
          {samplePhoto && <button className="button button-quiet danger-text" type="button" onClick={() => { setSamplePhoto(false); notify("Bundled sample preview removed. No personal image was stored."); }}><Trash2 size={15} /> Remove</button>}
          <Link href="/wardrobe" className="button button-dark">{samplePhoto ? "Continue with sample preview" : "Continue without photo"} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
