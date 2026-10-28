# UI/UX

**Status:** Phase 1 demo preserved under `/demo/**`; Stage A core Auth flows confirmed in Preview; Stage B authenticated account screens implemented, owner Preview testing next.
**Last updated:** 2026-10-28

**Current account-build visual:** [Recoverable Delete/Restore update and Preview checks](assets/stage-b-recoverable-delete.png) · [Initial account experience](assets/stage-b-account-build.png)

## Product feel

A premium consumer fashion product: calm, editorial, practical, and personal. Lead with wardrobe photography in the demo and, after private Storage is separately enabled, real wardrobe imagery. In current authenticated pages, use clean category marks and the user's own metadata rather than demo photographs. Avoid dense dashboard patterns, excessive gradients, decorative motion, and AI-demo visual tropes.

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
| `/wardrobe/**` | Protected active/trash lists, add/edit/detail pages, favorites, and recoverable archive/restore for account-owned clothing metadata. No image uploads. |
| `/outfits/**` | Protected outfit creation from the user's active wardrobe items, editing, saved/favorite/rating state, detail, and archive/restore. |
| `/stylist`, `/try-on`, `/profile/photo` | Protected, explicit not-yet-available states. No AI calls, personal photo uploads, or demo data are shown as real account results. |

## Shared navigation and components

The five approved primary destinations remain Home, Wardrobe, Outfits, AI Stylist, and Profile. Authenticated destinations require a verified session; `/demo/**` uses a visibly labelled mock shell with demo-prefixed navigation. Onboarding and account recovery are focused public flows outside primary navigation. Reusable components include the app shell, navigation, page heading, category chip, account record/outfit cards, modal/dialog, rating control, and explicit unavailable states.

## Interaction expectations

- In `/demo/**`, search, add, edit, delete, favorite, ratings, and preferences remain temporary in-memory mock interactions and reset on refresh.
- Sign-up and sign-in use real email/password Auth; sign-up explains the confirmation-email step and errors remain recoverable.
- Authenticated account data is read and written by session-bound server components/actions under RLS. The server derives the user ID; the browser never supplies the authorization identity. New accounts are empty until their owner saves data.
- The visible Delete action for an active wardrobe item or outfit moves it into the recoverable Archive; the user can restore it later. It does not permanently erase database rows. Deleting a clothing item this way preserves outfit links. Outfit selection is limited to active items from the same account.
- Stylist and try-on examples remain demo-only and do not make real AI calls or claim a mock image is a generated result. The authenticated stylist/try-on routes are unavailable states.

## Deferred

Personal photos/private Storage, real AI styling/try-on, payments, subscriptions, commerce, social, weather, advanced packing/analytics, complex notifications, and native apps are intentionally out of scope.
