# UI/UX

**Status:** Phase 1 prototype scope.  
**Last updated:** 2026-10-07

## Product feel

A premium consumer fashion product: calm, editorial, practical, and personal. Lead with wardrobe photography, generous whitespace, strong type hierarchy, and clear actions. Avoid dense dashboard patterns, excessive gradients, decorative motion, and AI-demo visual tropes.

## Responsive-first rules

- Design phone layouts first. Keep key actions reachable, use comfortably sized touch targets, and present one clear primary action per screen.
- Use a compact bottom navigation on small screens: **Home, Wardrobe, Outfits, AI Stylist, Profile**.
- On wider screens, retain the same destinations and information hierarchy with a restrained side navigation and more spacious content columns; do not turn the experience into an analytics dashboard.
- Preserve image aspect ratios and use consistent editorial crops. Provide useful alt text and avoid layout shifts.
- Respect reduced-motion preferences; animations should be brief and status-oriented.
- Use semantic controls, visible focus, keyboard access, labelled dialogs, and accessible contrast.

## Screen and route map

| Route | Purpose and important states |
|---|---|
| `/welcome` | Brand welcome, “Your Clothes. Your Style.”, Get Started and sign-in/register placeholders. |
| `/` | Home: personal welcome, profile-photo reminder when needed, wardrobe snapshot, stylist entry point, and outfit inspiration. |
| `/profile/photo` | Add/take/upload affordances, full-body photo guidance, preview, replace and delete states. No real upload in Phase 1. |
| `/wardrobe` | Search, category filters, garment cards, empty/loading examples, add action, and item detail/edit/delete interactions. |
| `/stylist` | Conversational mock chat, suggested prompts, sample response, and a structured outfit recommendation using mock item IDs. |
| `/try-on` | Selected outfit, generation progress, success, failure, save/favorite/rating states. Generation is simulated only. |
| `/outfits` | Saved outfits, favorites filter, outfit cards, and outfit details. |
| `/profile` | Mock profile, editable style preference controls, style-profile placeholder, settings, and privacy placeholder. |

## Shared navigation and components

The five approved primary destinations are Home, Wardrobe, Outfits, AI Stylist, and Profile. Onboarding and profile-photo setup are focused flows outside primary navigation. Reusable components include the app shell, navigation, page heading, garment card, category chip, outfit card, modal/dialog, rating control, and generation-status panel.

## Interaction expectations

- Search and category chips filter local wardrobe data immediately.
- Add, edit, delete, favorite, and rating controls provide clear mock feedback. They do not persist to a backend.
- Login/register buttons explain that authentication is a future integration; they must not imply an account was created.
- AI Stylist examples explain outfit rationale and show the selected wardrobe item IDs in a user-friendly way.
- Try-on has distinct queued/processing/success/failure examples and does not describe the mock image as a genuine generated result.

## Deferred

Payments, subscriptions, commerce, social, weather, advanced packing/analytics, complex notifications, and native apps are intentionally out of scope.
