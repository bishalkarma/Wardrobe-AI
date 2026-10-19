# UI/UX

**Status:** Phase 1 demo preserved under `/demo/**`; Stage A Auth and route separation implemented. Preview live testing pending.
**Last updated:** 2026-10-19

## Product feel

A premium consumer fashion product: calm, editorial, practical, and personal. Lead with wardrobe photography, generous whitespace, strong type hierarchy, and clear actions. Avoid dense dashboard patterns, excessive gradients, decorative motion, and AI-demo visual tropes.

## Responsive-first rules

- Design phone layouts first. Keep key actions reachable, use comfortably sized touch targets, and present one clear primary action per screen.
- Use a compact bottom navigation on small screens: **Home, Wardrobe, Outfits, AI Stylist, Profile**.
- On wider screens, retain the same destinations and information hierarchy with a restrained side navigation and more spacious content columns; do not turn the experience into an analytics dashboard.
- Preserve image aspect ratios and use consistent editorial crops. Provide useful alt text and avoid layout shifts.
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
| `/` and actual app routes | Protected by server-side Supabase Auth checks. Stage A displays empty-account placeholders; no mock garments, outfits, or preferences are presented as account data. |

## Shared navigation and components

The five approved primary destinations remain Home, Wardrobe, Outfits, AI Stylist, and Profile. Authenticated destinations require a verified session; `/demo/**` uses a visibly labelled mock shell with demo-prefixed navigation. Onboarding and account recovery are focused public flows outside primary navigation. Reusable components include the app shell, navigation, page heading, garment card, category chip, outfit card, modal/dialog, rating control, and generation-status panel.

## Interaction expectations

- In `/demo/**`, search, add, edit, delete, favorite, ratings, and preferences remain temporary in-memory mock interactions and reset on refresh.
- Sign-up and sign-in use real email/password Auth; sign-up explains the confirmation-email step and errors remain recoverable.
- Authenticated routes start empty and do not import or display demo wardrobe/outfit state. Persistence is deferred.
- Stylist and try-on examples remain demo-only and do not make real AI calls or claim a mock image is a generated result.

## Deferred

Payments, subscriptions, commerce, social, weather, advanced packing/analytics, complex notifications, and native apps are intentionally out of scope.
