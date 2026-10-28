# UI/UX

**Status:** Phase 1 demo preserved under `/demo/**`; Stage A core Auth flows confirmed in Preview; Stage B authenticated account screens implemented, owner Preview testing next.
**Last updated:** 2026-10-28

**Current app visual:** [Dark Studio Glass full-app revamp](assets/stage-b-dark-studio-glass-revamp.png) · [Archive multi-select, appearance modes, and action feedback](assets/stage-b-archive-themes-motion.png) · [Long-press selection mode and bulk Delete/Restore](assets/stage-b-longpress-selection.png) · [Earlier bulk multi-select update](assets/stage-b-bulk-delete.png) · [Single-item Delete/Restore](assets/stage-b-recoverable-delete.png) · [Initial account experience](assets/stage-b-account-build.png)

## Product feel

A premium Apple-inspired **Dark Studio Glass** experience with three persistent appearance choices: **Dark**, **Light**, and **Auto/System** (follows the device and updates when its preference changes). The dark canvas uses graphite layers and periwinkle/violet accents; the light canvas uses clean white surfaces and the same restrained accents. Buttons use brief spring-like press states, content arrives with a subtle slide/fade, and every successful account action produces an animated, dismissible toast. Use accessible confirmation sheets before archiving and permanently deleting. Keep glass effects modest, reduce blur on phones, respect reduced-motion/transparency settings, preserve contrast and touch targets, and do not imply unavailable AI or personal-photo features.

## Responsive-first rules

- Design phone layouts first. Keep key actions reachable, use comfortably sized touch targets, and present one clear primary action per screen.
- Use a compact bottom navigation on small screens: **Home, Wardrobe, Outfits, AI Stylist, Profile**.
- On wider screens, retain the same destinations and information hierarchy with a restrained side navigation and more spacious content columns; do not turn the experience into an analytics dashboard.
- Preserve image aspect ratios and use consistent editorial crops where approved images exist. Provide useful alt text and avoid layout shifts.
- Respect reduced-motion preferences; animations should be brief and status-oriented.
- Use semantic controls, visible focus, keyboard access, labelled dialogs, and accessible contrast.
- The PWA foundation includes a web manifest, app icon, theme color, and viewport-fit configuration. Offline caching/service-worker behavior is deferred.

## Screen and route map

| Route | Purpose and important states |
|---|---|
| `/welcome` | Public brand welcome with real email/password sign-in and sign-up entry points. New accounts require email confirmation. |
| `/auth/forgot-password` | Public recovery request with non-enumerating feedback. |
| `/auth/callback` | Public email confirmation/recovery callback; validates internal continuation paths. |
| `/auth/reset-password` | Password completion page; requires a valid recovery session. |
| `/demo/**` | Clearly labelled, public mock prototype. Preserves the Phase 1 screens and in-memory interactions under `/demo`, `/demo/wardrobe`, `/demo/outfits`, `/demo/profile`, `/demo/profile/photo`, `/demo/stylist`, and `/demo/try-on`. |
| `/` | Protected account dashboard with current-user counts, first-use guidance, and recent account records. Starts with no user-data rows. |
| `/profile` | Protected email identity and server-saved display name, units, and style preferences. Personal photos remain unavailable. |
| `/wardrobe/**` | Protected active/archive lists, add/edit/detail pages, favorites, and recoverable Delete/Restore. A long press (or context-menu gesture) reveals multi-select in both Active and Archive. Active selections can be soft-archived; archived selections can be restored or permanently deleted together after an impact-focused confirmation. No image uploads. |
| `/outfits/**` | Protected outfit creation from the user's active wardrobe items, editing, saved/favorite/rating state, detail, archive/restore, and confirmed Delete Forever for archived outfits. |
| `/stylist`, `/try-on`, `/profile/photo` | Protected, explicit not-yet-available states. No AI calls, personal photo uploads, or demo data are shown as real account results. |

## Shared navigation and components

The five approved primary destinations remain Home, Wardrobe, Outfits, AI Stylist, and Profile. Authenticated destinations require a verified session; `/demo/**` uses a visibly labelled mock shell with demo-prefixed navigation. Onboarding and account recovery are focused public flows outside primary navigation. Reusable components include the app shell, navigation, page heading, category chip, account record/outfit cards, modal/dialog, rating control, and explicit unavailable states.

## Interaction expectations

- In `/demo/**`, search, add, edit, delete, favorite, ratings, and preferences remain temporary in-memory mock interactions and reset on refresh.
- Sign-up and sign-in use real email/password Auth; sign-up explains the confirmation-email step and errors remain recoverable.
- Authenticated account data is read and written by session-bound server components/actions under RLS. The server derives the user ID; the browser never supplies the authorization identity. New accounts are empty until their owner saves data.
- The Archive/Move action for an active wardrobe item or outfit opens a branded, accessible confirmation sheet. It moves the record to the recoverable Archive; Restore remains available and outfit links are preserved. Keep item checkboxes and bulk actions hidden by default. Long-press (500 ms) or context-click a piece to reveal selection, Select all visible, Cancel, and bulk soft-archive controls.
- In the clothing Archive, the same hidden-by-default multi-select can restore or permanently delete up to 500 selected pieces. Permanent deletion opens an explicit, impact-focused confirmation; it is irreversible and is available only for archived rows owned by the signed-in user. Permanently deleting garments removes them from linked outfits. Archived outfits can be restored or individually deleted forever after confirmation; deleting an outfit removes its piece links. Never permanently delete active rows.
- After any completed account mutation, show a short, dismissible animated status toast; use the dialog for consent before destructive/recoverable archive actions and for irreversible deletion. Respect reduced motion and avoid blocking success states behind a disappearing animation.
- Stylist and try-on examples remain demo-only and do not make real AI calls or claim a mock image is a generated result. The authenticated stylist/try-on routes are unavailable states.

## Performance and motion

The previous build used a fixed, layered page background and large backdrop blurs on the mobile bottom bar, top bar, and dialogs. Those effects can force expensive repaints while scrolling, especially on mobile GPUs, and the authenticated shell repeated the Supabase Auth identity lookup that the page then repeated. Wardrobe lists also fetched both active and archived rows plus fields not displayed; outfits fetched every clothing ID and every outfit link before filtering the current view.

The current implementation removes fixed background attachment, reduces mobile blur and supports reduced-transparency, shares the verified auth lookup per server render, reads only the active/archive wardrobe view and fields in use, uses a count-only query for active garments on the outfits page, and loads links only for outfits currently shown. An account route skeleton and brief, transform-based page/button transitions keep navigation responsive without adding long animations. The list still renders every matching record; if real user testing shows lag with very large closets, measure on-device before adding pagination or virtualization. No production-device profiling data is available yet, so these are evidence-based risk reductions rather than a claim that a single cause has been measured.

## Deferred

Personal photos/private Storage, real AI styling/try-on, payments, subscriptions, commerce, social, weather, advanced packing/analytics, complex notifications, and native apps are intentionally out of scope.
