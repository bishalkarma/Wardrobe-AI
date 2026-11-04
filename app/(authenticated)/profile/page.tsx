import { ActionFeedback } from "@/components/account/action-feedback";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Palette, Ruler, UserRound } from "lucide-react";
import { saveProfileAction } from "@/app/actions/profile";
import { DataUnavailable } from "@/components/account/feedback";
import { PageHeading } from "@/components/ui";
import { firstParam } from "@/components/account/record-utils";
import { requireAccountContext } from "@/lib/data/account";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const styleOptions = ["Clean classic", "Soft tailoring", "Relaxed minimal", "A little eclectic"];
const colorOptions = ["Warm neutrals", "Earthy greens", "Deep tones", "Soft color"];
const fitOptions = ["Relaxed", "Regular", "Structured"];

export default async function ProfilePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { supabase, user } = await requireAccountContext();
  const [{ data: profile, error: profileError }, { data: preferences, error: preferencesError }] = await Promise.all([
    supabase.from("user_profiles").select("display_name, preferred_units").eq("user_id", user.id).maybeSingle(),
    supabase.from("style_preferences").select("preferred_style, color_palette, fit_preference").eq("user_id", user.id).maybeSingle(),
  ]);
  if (profileError || preferencesError) return <div className="page-stack"><PageHeading eyebrow="YOUR ACCOUNT" title="Your profile" /><DataUnavailable /></div>;

  return (
    <div className="page-stack account-page profile-account-page">
      <PageHeading eyebrow="YOUR ACCOUNT, YOUR DETAILS" title="Your profile" subtitle="Keep a few details and preferences with your account. You can update them whenever you like." />
      <ActionFeedback notice={firstParam(params.notice)} error={firstParam(params.error)} />

      <section className="account-identity-card">
        <span className="account-identity-avatar"><UserRound size={24} /></span>
        <div><p className="record-kicker">SIGNED-IN EMAIL</p><h2>{user.email ?? "Account"}</h2><p>Your sign-in identity is managed securely by Supabase Auth.</p></div>
        <span className="identity-private-badge"><LockKeyhole size={14} /> Private account</span>
      </section>

      <section className="account-form-panel">
        <div className="account-section-heading"><span className="account-section-icon"><Palette size={17} /></span><div><p className="eyebrow">A LITTLE ABOUT YOU</p><h2>Profile & style preferences</h2><p>These notes are saved only to your account. They do not trigger AI calls.</p></div></div>
        <form action={saveProfileAction} className="form-stack account-data-form">
          <label className="field-label">Name to use in the app<input className="text-input" name="displayName" maxLength={80} defaultValue={profile?.display_name ?? ""} placeholder="Your name" autoComplete="name" /></label>
          <div className="form-row">
            <label className="field-label">Preferred units<select className="text-input" name="preferredUnits" defaultValue={profile?.preferred_units ?? "metric"}><option value="metric">Metric</option><option value="imperial">Imperial</option></select></label>
            <label className="field-label">Fit preference<span className="select-with-icon"><Ruler size={15} /><select className="text-input" name="fitPreference" defaultValue={preferences?.fit_preference ?? ""}><option value="">Not set</option>{fitOptions.map((value) => <option key={value}>{value}</option>)}</select></span></label>
          </div>
          <div className="form-row">
            <label className="field-label">Style<select className="text-input" name="preferredStyle" defaultValue={preferences?.preferred_style ?? ""}><option value="">Not set</option>{styleOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label className="field-label">Colors you reach for<select className="text-input" name="colorPalette" defaultValue={preferences?.color_palette ?? ""}><option value="">Not set</option>{colorOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
          </div>
          <div className="account-form-boundary"><LockKeyhole size={15} /><span>Profile and preference rows are created when you save this form. No personal image is collected here.</span></div>
          <div className="modal-action-row"><button className="button button-dark" type="submit">Save profile</button></div>
        </form>
      </section>

      <section className="account-next-card">
        <div><p className="eyebrow">PROFILE PHOTO</p><h2>Photo uploads are not enabled yet</h2><p>Private personal-photo storage is a separate future stage. Nothing is uploaded from this account today.</p></div>
        <Link className="button button-outline" href="/profile/photo">See what’s available <ArrowRight size={15} /></Link>
      </section>
    </div>
  );
}
