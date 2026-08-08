#  wishelier — System Architecture Design

**Version:** 2.0 (Consolidated)

---

## 1. High-Level Diagram (textual)

```
                              ┌───────────────────────┐
                              │        Browser          │
                              └───────────┬────────────┘
                                          │ HTTPS
                              ┌───────────▼────────────┐
                              │   Cloudflare Edge/CDN    │
                              │  (WAF, rate limit, TLS)  │
                              └───────────┬────────────┘
                     ┌────────────────────┼─────────────────────┐
                     │                                          │
         ┌───────────▼───────────┐                 ┌───────────▼────────────┐
         │  Next.js App (Web)      │                 │  Static Generated Sites  │
         │  - Marketing/preview UI │                 │  {slug}/{version}/*      │
         │  - Auth, dashboard      │                 │  served directly from    │
         │  - API layer (routes +  │                 │  R2/Pages, no server     │
         │    server actions)      │                 │  round-trip              │
         └───────────┬───────────┘                 └────────────────────────┘
                     │
      ┌───────────────┼────────────────────────────────────────┐
      │               │                                        │
┌─────▼─────┐  ┌──────▼──────┐  ┌──────────────┐   ┌───────────▼───────────┐
│ Auth       │  │ Template    │  │ Project        │   │ Payment Service        │
│ Service    │  │ Service     │  │ Service        │   │ (Cashfree orders +     │
│ (JWT,      │  │ (registry,  │  │ (CRUD, draft/  │   │  webhook verification) │
│  Argon2id) │  │  schema)    │  │  publish state)│   └───────────┬───────────┘
└─────┬─────┘  └──────┬──────┘  └───────┬────────┘               │
      │               │                 │                        │ verified webhook
      │        ┌──────▼─────────────────▼───────────┐            │
      │        │            Neon PostgreSQL             │◄───────┘
      │        │  users, templates, projects, media,    │
      │        │  payments, deployments, analytics, ...  │
      │        └──────┬─────────────────┬───────────────┘
      │               │                 │
┌─────▼─────┐  ┌──────▼──────┐   ┌──────▼─────────────┐
│ Resend     │  │ ImageKit /  │   │  Generation Queue    │
│ (OTP,      │  │ R2 (media)  │   │  (Cloudflare Queues /│
│  emails)   │  │ signed      │   │   Redis)              │
└────────────┘  │ direct      │   └──────┬───────────────┘
                 │ upload      │          │
                 └─────────────┘   ┌──────▼──────────────┐
                                    │ Generation Worker      │
                                    │ - fetch project+template│
                                    │ - render static assets  │
                                    │ - optimize images        │
                                    │ - write OG/meta          │
                                    │ - upload to R2 (versioned)│
                                    └──────┬──────────────────┘
                                          │
                                    ┌──────▼──────────────┐
                                    │ Deployment Worker      │
                                    │ - atomic "live" pointer │
                                    │   swap for slug          │
                                    │ - purge CDN cache        │
                                    │ - notify user (Resend)   │
                                    └──────────────────────┘
```

Analytics is a lightweight async sink (edge log → batched writer → `analytics` tables), decoupled from the request path so it never adds latency to a visitor's page load.

## 2. Component Responsibilities

### 2.1 Client (Next.js App)
- Renders the marketing/preview experience using the **same** template-engine package that the generation worker uses, so "live preview" and "final generated site" are guaranteed pixel-identical (single source of rendering truth — this was a gap in all three reference docs, which implied two separate rendering paths).
- Owns auth UI, dynamic form rendering (driven by `template.schema`), media upload UI, checkout initiation, and the dashboard.

### 2.2 API Layer
Thin Next.js route handlers/server actions that validate input, enforce auth/rate limits, and delegate to the service layer. No business logic lives here.

### 2.3 Service Layer
- **Auth Service** — signup/login/OTP/session/token rotation.
- **Template Service** — template CRUD (admin-only), schema retrieval, versioning.
- **Project Service** — draft creation/editing, publish-state machine (`draft → pending_payment → paid → generating → live → failed`).
- **Media Service** — issues signed upload URLs, validates uploaded object metadata server-side post-upload.
- **Payment Service** — order creation, **and the sole owner of webhook signature verification and payment-status writes.**
- **Generation Service** — enqueues generation jobs; itself does no rendering (rendering is worker-side).
- **Deployment Service** — manages versioned storage paths and the live-pointer swap.
- **Analytics Service** — ingest + aggregate visit events.

### 2.4 Generation Worker (separate deployable, scales independently)
Stateless; pulls jobs keyed by `(project_id, version)`; idempotent; on failure, retries with backoff and dead-letters after N attempts with alerting.

### 2.5 Deployment Worker
The **only** component allowed to flip which version is "live" for a slug. This isolation keeps publish atomic and auditable.

## 3. Request/Data Flows

### 3.1 Template Preview (unauthenticated)
Browser → Next.js (SSR/CSR) → Template Service (schema+theme for currently selected template) → rendered client-side. No DB writes.

### 3.2 Project Creation → Payment → Generation
1. User authenticates, submits form + media → Project Service creates `project` (status `draft`), Media Service stores asset refs.
2. User confirms → Payment Service creates a Cashfree order tied to `project_id`; project moves to `pending_payment`.
3. Cashfree redirects user to a "confirming" screen; **no state change happens here.**
4. Cashfree calls the webhook → Payment Service verifies HMAC signature, dedupes on event id, marks `payments.status = success`, moves project to `paid`, enqueues a generation job.
5. Generation Worker renders the static bundle, optimizes assets, uploads to a versioned path, marks `deployments.status = ready`.
6. Deployment Worker swaps the live pointer, purges cache, project → `live`; Resend sends the "your site is live" email; dashboard reflects the new URL.

### 3.3 Edit & Republish
User edits in dashboard → new draft `data` (project stays `live` on the *currently served* version) → on "Publish," steps 5–6 above repeat with an incremented `version`; prior version retained per retention policy for rollback.

### 3.4 Visitor Traffic to a Generated Site
Browser → Cloudflare CDN → static asset from R2/Pages (edge cache hit in the common case) → a small async analytics beacon fires (non-blocking) → batched into `analytics` tables. No DB read is on the critical path of serving a visitor.

## 4. Failure Domains & Isolation
- Payment verification failures never touch the generation queue.
- Generation worker crashes/retries don't affect already-live sites (live pointer only changes on explicit success).
- Media storage outage blocks new uploads but not serving of already-generated sites (static assets are already copied into the versioned bundle at generation time, not referenced live from the media provider).
- Queue backlog degrades **time-to-live** for new purchases but never serving of existing sites — this is the core scalability property of the architecture.

## 5. Multi-Region / Edge Considerations
- Static generated sites are inherently multi-region via Cloudflare's edge network.
- The Neon primary DB is single-region at launch (see TRD §6); this only affects platform API latency for authenticated actions, not visitor-facing site delivery.

## 6. Admin/Internal Tooling (new — not covered in reference docs)
- Internal admin app (or admin-gated routes) for: template registry management (create/update/version/activate/deactivate templates), manual payment dispute resolution, slug moderation/report queue, and generation dead-letter queue inspection/retry.
