# Wishelier — Product Requirements Document (PRD)

**Version:** 2.0 (Consolidated)
**Status:** Draft for engineering review
**Owner:** Product

---

## 1. Problem Statement

People want to celebrate someone (a birthday, anniversary, wedding, farewell) with something more personal and shareable than a WhatsApp forward, but they don't have the time, design skill, or budget to build a custom website. Existing options are either generic e-card tools (low perceived value, not "premium") or fully custom dev work (too slow, too expensive).

Wishelier closes this gap: pick a template, fill in a short form, pay, and receive a live, shareable website in minutes.

## 2. Vision

A scalable, template-driven B2C platform where users generate, customize, and instantly deploy premium event websites. Birthdays are the launch vertical; the architecture must support weddings, anniversaries, baby showers, graduations, farewells, festivals, and memorials without structural rework — **new event types are a content operation, not an engineering project.**

## 3. Goals & Non-Goals

**Goals**
- Sub-5-minute time-to-live-website from landing on the homepage.
- The homepage itself is the product demo (live template preview, not a marketing page).
- Support thousands of concurrently generated sites without per-purchase build queues.
- Make adding a new template or event category a config/content change, not a code change.

**Non-Goals (v1)**
- No collaborative/multi-editor websites.
- No native mobile app (responsive web only).
- No self-serve template builder for end users (templates are built by Wishelier's design team, not users).
- No multi-language site content generation (platform UI can be localized later; generated sites are single-language per project in v1).

## 4. Target Users

| Segment | Description | Primary need |
|---|---|---|
| Gifters | Friends/family creating a surprise for someone's birthday | Fast, emotional, shareable, affordable |
| Event hosts | Planning weddings/anniversaries | More fields, more media, higher price tolerance |
| Repeat/power users | Use Wishelier for multiple events a year | Dashboard, saved details, discounts |

## 5. Core User Experience

1. **Immersive preview** — landing page renders the actual selected template full-screen; there is no separate "marketing homepage" vs "app."
2. **Floating control bar** — template switcher (dropdown/carousel) + persistent "Use this template" CTA, always visible while scrolling the live preview.
3. **Progressive authentication** — user is not forced to log in before they've chosen a template. Auth triggers only at "Use this template": email → OTP (Resend) → password creation (new user) or password login (returning user).
4. **Dynamic customization form** — generated entirely from the selected template's JSON schema; the frontend contains zero hardcoded per-template fields.
5. **Media upload** — drag-and-drop, client-side direct upload to storage, progress indicators, crop/aspect-ratio validation per template requirements.
6. **Live preview before payment** — the user sees their actual data rendered in the real template renderer, not a mockup, before paying.
7. **Frictionless checkout** — Cashfree hosted checkout; order creation server-side; **site generation is triggered only by a verified payment webhook, never by frontend redirect state.**
8. **Instant delivery** — on confirmed payment, the user gets a short branded URL (`Wishelier.in/riya`) and a pre-filled, editable share message for WhatsApp/Instagram/Facebook/X/Telegram, plus a QR code.
9. **Post-purchase editing** — users can revisit the dashboard, edit text/images, and republish (see §9, Versioning).

## 6. Core Features

### 6.1 Template Marketplace
- Categories: Elegant, Romantic, Luxury, Minimal, Fun, Cartoon, Premium Animated, Video-First, Photo Collage, Story Timeline.
- Each template declares: preview asset, live demo mode, required/optional fields, image/video limits, music support, animation profile, pricing tier, and supported event type(s).
- Templates are versioned (`template_id@version`) so a template can be updated without breaking already-deployed sites (see §9).

### 6.2 Dynamic Homepage
Switching the template dropdown live-updates colors, typography, layout, hero, gallery style, and animation profile of the homepage itself — this **is** the live preview.

### 6.3 Authentication
- Signup: email → OTP (Resend) → password.
- Login: email + password.
- Forgot password: OTP → reset.
- Sessions: JWT access token + rotating refresh token in HTTP-only, secure cookies.

### 6.4 Dynamic Website Creation
- Form fields are generated at runtime from `templates.schema` (JSON Schema-like definition: field key, type, required, min/max for arrays, validation rules).
- Supported field types: text, long-text, image, image-array (min/max), video, audio, date, countdown-date, timeline-entry-array, color-accent (if template allows override).

### 6.5 Media Upload
- Direct-to-storage (ImageKit or Cloudflare R2 with signed URLs) client uploads — servers never proxy raw file bytes.
- Client-side compression, cropping, and aspect-ratio validation before upload.
- Server-side re-validation of file type, size, and dimensions (never trust client validation alone).

### 6.6 Payments
- Cashfree order creation (server-side, authenticated, tied to a `project_id`).
- Webhook is the **only** source of truth for payment success; HMAC signature verified on every webhook call; idempotent handling (duplicate webhook deliveries must not double-charge or double-generate).
- Refund/cancellation policy defined for failed generation or user-requested cancellation within a defined window (see §11).

### 6.7 Site Generation & Deployment
- Triggered only after verified payment.
- Static HTML/CSS/JS + optimized assets + Open Graph metadata generated by a background worker, uploaded to object storage, and served from Cloudflare's edge/CDN.
- Idempotent: re-running generation for the same `project_id` + `version` produces the same output and is safe to retry.

### 6.8 URL / Slug System
- Priority: user custom slug (premium) → name-based slug → name + short hash on collision.
- Rules: lowercase, hyphens allowed, 3–32 characters, reserved-word blocklist (admin, login, signup, api, dashboard, support, pricing, etc.), uniqueness enforced at DB level.

### 6.9 Dashboard
View/edit/duplicate websites, replace media, regenerate, download QR code, view analytics, renew hosting (for time-limited plans), manage saved payment methods (via Cashfree tokenization, not stored directly).

### 6.10 Sharing
Post-deployment share panel: copy link, WhatsApp/Instagram/Facebook/X/Telegram share buttons, QR code, editable pre-filled share message.

### 6.11 Analytics
Privacy-friendly, cookie-free visit tracking per generated site: visitors, unique visitors, country, device class, referrer, share-button clicks, peak traffic windows. Aggregated into the owner's dashboard.

## 7. Scalability & Extensibility Requirements
- **Template-agnostic core:** adding a template = adding a schema + renderer + registry entry, zero platform code changes.
- **Category expansion:** `event_type` is an enum/extensible tag on templates and projects; a new vertical (e.g., weddings) requires new templates/schemas only.
- Architecture must handle 100k+ users and 1M+ generated sites with static, near-zero-server-load delivery for generated sites (see TRD/Architecture docs).

## 8. Explicit Trust & Safety Requirements
- Payment confirmation is server/webhook-authoritative only — never trust client-reported payment state for generation.
- All uploaded media is scanned/validated server-side (type, size, dimensions); explicit content moderation hook reserved for future (flag for manual review), out of scope to auto-moderate in v1 but the schema must support a `moderation_status` field so it can be added without migration.
- Slug and content abuse prevention: rate-limited project creation per account, reserved-word blocklist, optional manual review queue for public/shareable pages reported by visitors.

## 9. Editing, Versioning & Republishing (new in this revision)
The prior reference docs did not specify what happens when a user edits a live site. This version defines it explicitly:
- Each edit creates a new **draft version** of `project.data`.
- Publishing a draft increments `deployment.version`, regenerates static assets, uploads under a versioned path, and atomically swaps the live pointer — old versions are retained for rollback (configurable retention window) and cache is purged for the slug.
- If the underlying **template** itself is updated by Wishelier (e.g., a bug-fixed renderer), already-deployed sites are **not** silently re-rendered; a re-publish is required, so a user's live site never changes without their action.

## 10. Success Metrics (KPIs)
- Landing → "Use this template" click-through rate.
- Template selection → payment conversion rate.
- Median time from "Use this template" to live URL.
- Payment success rate / webhook failure rate.
- Site generation success rate (target ≥ 99.5%) and median generation latency.
- 30-day repeat purchase rate (same user, second event).
- Share-button click-through and resulting referral traffic.

## 11. Monetization & Commercial Policy
- Tiered pricing by template (Standard / Premium / Luxury) and by feature (custom slug, extended hosting duration, higher media limits, priority generation).
- Hosting duration: define whether sites are hosted permanently or on a renewable term (recommendation: 1-year default hosting, renewable, to bound storage/CDN cost — must be decided before build, as it changes the DB schema, §Database doc, `expires_at`).
- Refund policy: full refund if generation fails and cannot be resolved within a defined SLA (e.g., 24h); no refund after successful deployment except for legally mandated cases.

## 12. Risks & Open Questions
| Risk | Mitigation |
|---|---|
| Payment succeeds but generation fails | Idempotent retryable queue + alerting + defined refund SLA |
| Slug squatting / abuse | Rate limits, reserved words, manual report flow |
| Template schema drift breaks old projects | Template versioning; render against the schema version stored at project creation time |
| Storage cost growth from long-tail sites | Hosting expiry/renewal policy, cold-storage archival for inactive sites |
| OTP/email deliverability | Resend + fallback provider consideration, delivery monitoring |

## 13. Out of Scope for v1 (explicitly deferred)
- Multi-editor collaboration on one project.
- User-built custom templates.
- Native apps.
- Multi-currency payments (India/INR only at launch).
- Automated content moderation (manual/report-based only).
