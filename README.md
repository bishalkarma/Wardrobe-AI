# Wardrobe AI

**Your Clothes. Your Style.**

A mobile-first, PWA-ready personal wardrobe experience designed around the clothes a person actually owns. The MVP is built toward this journey: add a profile photo and real garments, review AI-suggested garment metadata, get an outfit assembled from owned item IDs, preview a virtual try-on, then save and rate the outfit.

## Current status

**Phase 1 — UI/UX prototype with mock data.** The application demonstrates the end-to-end experience using local, illustrative data only. It does not authenticate users, upload private photos, call AI providers, persist user changes to a backend, or generate real try-on images.

## Run locally

Requirements: Node.js 22 or later and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. For a production build check:

```bash
npm run typecheck
npm run lint
npm run build
```

## Technology direction

- Next.js App Router, React, and TypeScript for the Phase 1 responsive web experience.
- Custom CSS for the product design system; Lucide icons for interface iconography.
- Supabase Auth, PostgreSQL, RLS, and private Storage are approved for the MVP integration phase, but are not connected in Phase 1.
- AI calls will remain behind replaceable server-side provider adapters. No AI provider is wired into this prototype.

## Product principles

- Recommendations use the user's actual wardrobe and stable wardrobe item IDs.
- Original garment images are retained separately from any derived or processed images.
- User media is private and ownership-checked.
- AI classifications are editable suggestions.
- Try-on quality is measured; the product must not claim exact garment preservation without evidence.
- Expensive work is represented as a trackable job rather than blocking the application synchronously.

## Project layout

```text
app/                 Next.js routes and application shell
components/           Reusable UI and product components
lib/                  Mock data and client-side prototype state
public/               Local illustrative fashion imagery and PWA assets
docs/                 Architecture, UX, database, AI, security, decisions, roadmap
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [UI/UX](docs/UI_UX.md)
- [Database](docs/DATABASE.md)
- [AI architecture and Garment Fidelity Test](docs/AI_ARCHITECTURE.md)
- [Security and privacy](docs/SECURITY.md)
- [Decisions](docs/DECISIONS.md)
- [Roadmap](docs/ROADMAP.md)

## Phase 1 boundary

All displayed people, garments, recommendations, and generation states are examples for visual testing. “Generate try-on” only simulates a job locally. No credentials, production data, external AI requests, Supabase calls, or real image uploads are used. Phase 2 and any production integration require separate approval.
