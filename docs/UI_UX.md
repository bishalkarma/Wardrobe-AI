# UI/UX

**Status:** Phase 1 demo preserved under `/demo/**`; Stage A core Auth flows confirmed in Preview; Stage B authenticated account screens implemented, owner Preview testing next.
**Last updated:** 2026-10-28

**Current app visual:** [Dark Studio Glass full-app revamp](assets/stage-b-dark-studio-glass-revamp.png) · [Long-press selection mode and bulk Delete/Restore](assets/stage-b-longpress-selection.png) · [Earlier bulk multi-select update](assets/stage-b-bulk-delete.png) · [Single-item Delete/Restore](assets/stage-b-recoverable-delete.png) · [Initial account experience](assets/stage-b-account-build.png)

## Product feel

A premium Apple-inspired **Dark Studio Glass** experience: deep graphite canvas, restrained translucent layers, crisp system typography, periwinkle/violet light accents, generous spacing, and subtle spring-like transitions. Use glass surfaces for navigation, cards, and action groups without sacrificing contrast or touch-target clarity. The account experience uses only the signed-in user's metadata and neutral garment marks; demo imagery remains clearly illustrative and isolated. Keep gradients atmospheric and restrained, respect reduced motion, and do not imply unavailable AI or personal-photo features.

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
| `/wardrobe/**` | Protected active/archive lists, add/edit/detail pages, favorites, and recoverable Delete/Restore. A long press (or context-menu gesture) reveals multi-select and bulk soft-delete. Archived pieces can be restored or individually deleted forever after two-step confirmation. No image uploads. |
| `/outfits/**` | Protected outfit creation from the user's active wardrobe items, editing, saved/favorite/rating state, detail, archive/restore, and confirmed Delete Forever for archived outfits. |
| `/stylist`, `/try-on`, `/profile/photo` | Protected, explicit not-yet-available states. No AI calls, personal photo uploads, or demo data are shown as real account results. |

## Shared navigation and components

The five approved primary destinations remain Home, Wardrobe, Outfits, AI Stylist, and Profile. Authenticated destinations require a verified session; `/demo/**` uses a visibly labelled mock shell with demo-prefixed navigation. Onboarding and account recovery are focused public flows outside primary navigation. Reusable components include the app shell, navigation, page heading, category chip, account record/outfit cards, modal/dialog, rating control, and explicit unavailable states.

## Interaction expectations

- In `/demo/**`, search, add, edit, delete, favorite, ratings, and preferences remain temporary in-memory mock interactions and reset on refresh.
- Sign-up and sign-in use real email/password Auth; sign-up explains the confirmation-email step and errors remain recoverable.
- Authenticated account data is read and written by session-bound server components/actions under RLS. The server derives the user ID; the browser never supplies the authorization identity. New accounts are empty until their owner saves data.
- The visible Delete action for an active wardrobe item or outfit moves it into the recoverable Archive; Restore remains available. Keep item checkboxes and bulk actions hidden in normal wardrobe view. Long-press (or open the context menu on) a piece to select it and reveal multi-select, Select all visible, Cancel, and bulk soft-delete controls. Bulk deletion never permanently erases rows and preserves outfit links.
- In Archive, offer **Delete Forever** for clothing items and outfits after expanding an inline explanation and confirming in a branded, accessible dialog. This is irreversible and available only for archived rows owned by the signed-in user. Permanently deleting a garment removes it from all linked outfits; permanently deleting an outfit removes its piece links. Do not offer permanent delete for active rows.
- Stylist and try-on examples remain demo-only and do not make real AI calls or claim a mock image is a generated result. The authenticated stylist/try-on routes are unavailable states.

## Deferred

Personal photos/private Storage, real AI styling/try-on, payments, subscriptions, commerce, social, weather, advanced packing/analytics, complex notifications, and native apps are intentionally out of scope.
