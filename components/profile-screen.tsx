"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bell, Check, ChevronRight, CircleHelp, LockKeyhole, LogOut, Palette, Ruler, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { usePrototype } from "@/components/prototype-provider";
import { Modal, PageHeading } from "@/components/ui";

const styleOptions = ["Clean classic", "Soft tailoring", "Relaxed minimal", "A little eclectic"];
const colorOptions = ["Warm neutrals", "Earthy greens", "Deep tones", "Soft color"];

export function ProfileScreen() {
  const { items, samplePhoto, notify, stylePreferences, saveStylePreferences } = usePrototype();
  const [selectedStyle, setSelectedStyle] = useState(stylePreferences.style);
  const [selectedColor, setSelectedColor] = useState(stylePreferences.colorPalette);
  const [fit, setFit] = useState(stylePreferences.fit);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <div className="page-stack profile-screen">
      <PageHeading eyebrow="A SPACE THAT’S JUST YOURS" title="Your profile" subtitle="A few details that help make the suggestions feel more like you." />

      <section className="profile-card">
        <div className="profile-avatar-large">M<span className="profile-status-dot" /></div>
        <div className="profile-card-main"><span className="eyebrow">YOUR STYLE SPACE <i /> SAMPLE PROFILE</span><h2>Maya Foster</h2><p>Everyday style, a little more considered.</p><div className="profile-card-meta"><span><span className="profile-meta-dot" />{samplePhoto ? "Bundled sample preview active" : "No sample preview active"}</span><span>{items.length} wardrobe pieces</span></div></div>
        <Link href="/profile/photo" className="button button-light profile-photo-action">{samplePhoto ? "Manage sample preview" : "Preview a sample"} <ArrowRight size={15} /></Link>
      </section>

      <section className="preferences-section">
        <div className="section-heading-row"><div><p className="eyebrow">A FEW PREFERENCES</p><h2>Your style, your way</h2><p className="prototype-disclaimer">Temporary demo settings in memory; refreshing restores the defaults.</p></div><button type="button" className="text-link" onClick={() => saveStylePreferences({ style: selectedStyle, colorPalette: selectedColor, fit })}>Apply preferences <Check size={15} /></button></div>
        <div className="preferences-grid">
          <div className="preference-card"><div className="preference-card-heading"><span className="preference-icon"><Palette size={17} /></span><span><strong>Your style</strong><small>What feels most like you?</small></span></div><div className="preference-options">{styleOptions.map((option) => <button type="button" className={`preference-chip${selectedStyle === option ? " is-selected" : ""}`} key={option} aria-pressed={selectedStyle === option} onClick={() => setSelectedStyle(option)}>{selectedStyle === option && <Check size={12} />}{option}</button>)}</div></div>
          <div className="preference-card"><div className="preference-card-heading"><span className="preference-icon"><Sparkles size={17} /></span><span><strong>Colors you reach for</strong><small>We’ll keep your palette in mind.</small></span></div><div className="preference-options">{colorOptions.map((option) => <button type="button" className={`preference-chip${selectedColor === option ? " is-selected" : ""}`} key={option} aria-pressed={selectedColor === option} onClick={() => setSelectedColor(option)}>{selectedColor === option && <Check size={12} />}{option}</button>)}</div></div>
          <div className="preference-card preference-fit-card"><div className="preference-card-heading"><span className="preference-icon"><Ruler size={17} /></span><span><strong>Fit preference</strong><small>How you like things to feel.</small></span></div><div className="fit-selector" role="group" aria-label="Fit preference">{["Relaxed", "Regular", "Structured"].map((option) => <button type="button" key={option} aria-pressed={fit === option} className={fit === option ? "is-selected" : ""} onClick={() => setFit(option)}>{option}</button>)}</div></div>
        </div>
      </section>

      <section className="style-profile-card"><div className="style-profile-emblem"><Sparkles size={19} /></div><div className="style-profile-copy"><p className="eyebrow">YOUR STYLE PROFILE</p><h2>A little more you, over time.</h2><p>As you save and rate looks, your personal style notes will start to take shape here.</p></div><span className="style-profile-status">COMING INTO FOCUS</span><div className="style-profile-progress"><span /><span /><span /><span /><span /><i>Just getting started</i></div></section>

      <section className="profile-settings-section"><div className="section-heading-row"><div><p className="eyebrow">THE DETAILS</p><h2>Settings & privacy</h2></div><span className="settings-private-label"><LockKeyhole size={13} /> Private by design</span></div>
        <div className="settings-list">
          <button className="settings-row" type="button" onClick={() => setShowSettings(true)}><span className="settings-row-icon"><UserRound size={17} /></span><span className="settings-row-copy"><strong>Account settings</strong><small>Profile and sign-in preferences</small></span><ChevronRight size={17} /></button>
          <button className="settings-row" type="button" onClick={() => setShowPrivacy(true)}><span className="settings-row-icon"><ShieldCheck size={17} /></span><span className="settings-row-copy"><strong>Privacy & your images</strong><small>How photos and wardrobe data are handled</small></span><ChevronRight size={17} /></button>
          <button className="settings-row" type="button" onClick={() => notify("Reminder settings are a future feature.")}><span className="settings-row-icon"><Bell size={17} /></span><span className="settings-row-copy"><strong>Style reminders</strong><small>Not available in this prototype</small></span><span className="settings-row-badge">LATER</span><ChevronRight size={17} /></button>
          <button className="settings-row" type="button" onClick={() => notify("Help and support will be available later.")}><span className="settings-row-icon"><CircleHelp size={17} /></span><span className="settings-row-copy"><strong>Help & support</strong><small>Questions about your wardrobe</small></span><ChevronRight size={17} /></button>
        </div>
      </section>

      <div className="profile-footer-actions"><button className="text-link danger-text" type="button" onClick={() => setShowSignOut(true)}><LogOut size={15} /> Sign out</button><span>Wardrobe AI · Prototype 01</span></div>

      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Account settings"><div className="placeholder-dialog"><span className="placeholder-dialog-icon"><UserRound size={20} /></span><p>Account settings will be connected when authentication is added.</p><div className="prototype-disclaimer">This prototype has no account, password, or saved personal information.</div><button className="button button-dark button-full" type="button" onClick={() => setShowSettings(false)}>Got it</button></div></Modal>
      <Modal open={showPrivacy} onClose={() => setShowPrivacy(false)} title="Your privacy comes first"><div className="placeholder-dialog"><span className="placeholder-dialog-icon"><ShieldCheck size={20} /></span><p>Real profile photos and wardrobe images are planned for private, owner-controlled storage.</p><ul className="privacy-dialog-list"><li><Check size={14} /> No public image buckets</li><li><Check size={14} /> User-owned access controls</li><li><Check size={14} /> Deletion workflows for photos and account data</li></ul><div className="prototype-disclaimer">No personal images are uploaded or stored in this prototype.</div><button className="button button-dark button-full" type="button" onClick={() => setShowPrivacy(false)}>Understood</button></div></Modal>
      <Modal open={showSignOut} onClose={() => setShowSignOut(false)} title="Sign out"><div className="placeholder-dialog"><span className="placeholder-dialog-icon"><LogOut size={19} /></span><p>There is no account session to sign out of in this demo.</p><button className="button button-dark button-full" type="button" onClick={() => setShowSignOut(false)}>Stay in the demo</button></div></Modal>
    </div>
  );
}
