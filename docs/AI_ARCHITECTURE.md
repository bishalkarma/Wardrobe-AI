# AI Architecture

**Status:** Provider-neutral design approved; Phase 1 uses local mock data only.  
**Last updated:** 2026-10-07

## Non-negotiable boundary

Browser code must not call AI vendors or contain provider credentials. Future AI requests pass through the server-side application layer, which authenticates the user, checks ownership and limits, retrieves only relevant wardrobe context, creates a trackable job/request record, calls an adapter, validates the result, and records available usage.

## Internal service and adapters

Keep product operations stable while vendors can change:

```text
AIService
  ├── analyzeClothing(imageRef)       → suggested metadata + confidence
  ├── classifyClothing(imageRef)      → category/subcategory candidates
  ├── recommendOutfit(request, items) → structured wardrobe item IDs
  ├── generateTryOn(person, outfit)   → generation job/result
  ├── generateStyleProfile(history)  → optional future profile
  └── moderateImage(imageRef)         → decision + reason

Provider adapters
  ├── VisionProvider
  ├── StylistProvider
  ├── ImageProcessingProvider
  ├── TryOnProvider
  └── ModerationProvider
```

Each adapter maps provider responses/errors into internal types. Providers can differ by task; the product must not assume that one vendor supports every operation. Provider selection is an explicit configuration choice and can be replaced without changing UI or domain rules.

## Wardrobe-grounded recommendations

1. Authenticate the user and retrieve active, owned candidate items using structured filters/search.
2. Send the stylist only relevant metadata and, when necessary, a limited set of private image references.
3. Require structured output with item IDs, occasion, style, explanation, and any confidence/limitations.
4. Validate schema, candidate membership, item ownership, active state, and outfit-slot constraints on the server.
5. Reject or repair invalid output; never silently invent an unowned garment. Shopping suggestions are out of MVP scope.

Use a deterministic fallback or a clear unavailable state if the stylist provider fails. Cache clothing analysis by source-image/version and relevant model configuration so unchanged items are not repeatedly analyzed. Apply configurable generation limits and log usage where available.

## Generation jobs and usage

Internal job states: `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED`, `CANCELLED`. Record user, operation, provider, model, input references, created/started/completed times, normalized error category, generated-media reference, duration, and usage/cost metadata where available. Use idempotent updates and do not keep a client request open while a slow provider runs. Queue/worker technology is a later deployment decision.

Track `ai_requests` (or equivalent) for every attempted AI operation, including failed attempts when practical. Capture token counts for text/vision, image-operation units or dimensions where the provider exposes them, duration, and estimated cost. Never log image contents, secrets, or unnecessary raw prompts containing personal data.

## Garment Fidelity Test

This is a required provider-evaluation protocol, not a claim that any current model passes.

### Test set and procedure

- Prepare a controlled set of consented or synthetic person and garment references. Include solid light/dark garments, multiple colors, patterns, visible logos/branding, buttons, collars, sleeves, distinctive silhouettes, shoes/accessories, and small design details.
- Record the source item ID and a short reference checklist for each garment before generation. Keep original reference images unchanged.
- Use a fixed prompt and input format for each provider/model, with the same person, pose, and garment references where supported. Record model/version, settings, date, latency, failures, and cost.
- Run repeated generations for representative samples; one attractive result is not evidence of reliable fidelity.
- Have reviewers compare outputs to references using a 1–5 rubric: 1 = absent/wrong, 3 = recognizable but materially changed, 5 = closely preserved. Score color, pattern, logo, buttons, collar, sleeves, shape/silhouette, important design details, and overall garment identity separately.
- Score user identity (face consistency and overall appearance), body consistency, and pose consistency separately. Note distortions, substitutions, missing items, and unwanted beautification.
- Report per-attribute results and failure examples, plus latency, rate-limit behavior, availability, retention/privacy terms, and estimated unit cost. Do not hide failures in an aggregate score.

Define pass thresholds before evaluating providers with product stakeholders. If results do not meet those thresholds, disclose the limitation, change the provider/workflow, or defer the claim/feature. Never advertise exact garment preservation unless measured evidence supports that statement.

## Phase 1 boundary

All chat messages, classifications, outfit IDs, loading/success/failure states, and try-on previews in the prototype are local mock fixtures. No real AI requests, provider credentials, or user images are involved. Nano Banana may be included in a future candidate evaluation; it is not selected by this document.
