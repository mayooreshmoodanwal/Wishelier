# Wishelier — Technical Requirements Document (TRD)

**Version:** 2.0 (Consolidated)
**Companion docs:** `03_SYSTEM_ARCHITECTURE.md`, `04_DATABASE_SCHEMA.md`, `05_API_SPECIFICATION.md`, `06_SECURITY_AND_COMPLIANCE.md`, `07_NFR_AND_LAUNCH_PLAN.md`

---

## 1. Technology Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Next.js 15 (App Router), React 19, TypeScript | Also renders generated-site previews in "live" mode |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion | Design tokens shared with `template-engine` package |
| Backend | Next.js Route Handlers + Server Actions | Thin API layer over the service layer |
| ORM | Drizzle ORM (or Prisma — pick one, see decision note below) | Type-safe schema, migrations |
| Database | Neon (Serverless PostgreSQL) | Autoscaling, branch-per-environment for CI |
| Object/media storage | ImageKit **or** Cloudflare R2 + Images | Direct client upload via signed URLs; ImageKit if on-the-fly transforms are needed, R2 if cost/control is prioritized |
| Payments | Cashfree (Orders API + Webhooks) | India-first; PCI scope stays with Cashfree hosted checkout |
| Transactional email/OTP | Resend | OTP + receipts + generation-complete notification |
| Background processing | Queue (Cloudflare Queues, or Upstash/Redis-backed BullMQ) | Decouples payment webhook from generation |
| Static site hosting | Cloudflare Pages / Workers + R2 | Generated sites are static assets served at the edge |
| CDN / caching | Cloudflare CDN, `immutable` cache headers, versioned asset paths | Cache purge on republish |
| Auth | Custom JWT/session + Argon2id password hashing | Refresh-token rotation, HTTP-only cookies |
| Monitoring/observability | Sentry (errors), Cloudflare Analytics + a structured logging pipeline | See NFR doc |

**Decision note — Prisma vs Drizzle:** the two reference implementations disagreed (Prisma in one, Drizzle in the other). Recommendation: **Drizzle** for the Cloudflare Workers/Edge runtime, since it has a lighter edge-compatible driver footprint than Prisma's engine binary; confirm with a spike before committing.

## 2. System Requirements

### 2.1 Functional Requirements (see PRD §6 for full feature list)
- FR-1: Platform renders any registered template purely from `schema` + `theme` JSON — no per-template frontend code.
- FR-2: Site generation is triggered exclusively by a verified Cashfree webhook event, and is idempotent per `(project_id, version)`.
- FR-3: Slug allocation must be atomic and collision-safe under concurrent requests (DB unique constraint + retry-with-suffix, not a check-then-insert race).
- FR-4: All media uploads are validated server-side regardless of client-side validation.
- FR-5: Every generated site must pass a responsiveness check (defined breakpoints, §NFR) before being marked deployable.
- FR-6: Editing a live project must not mutate the currently-served version until publish (draft/publish separation, PRD §9).

### 2.2 Non-Functional Requirements — summary (full detail in `07_NFR_AND_LAUNCH_PLAN.md`)
- Homepage LCP < 2.5s.
- Generated site Lighthouse score ≥ 95, mobile-first.
- Site generation P50 < 30s, P95 < 2min from verified payment to live URL.
- 99.9% uptime target for the platform API; generated sites target 99.99% (fully static/edge).
- Horizontal scalability of generation workers independent of the web app.

## 3. Core Technical Decisions

### 3.1 Edge rendering over per-purchase builds
Rejecting "spin up a new static build/deploy per purchase" as the primary path (too slow, deployment-queue bound at scale). Instead:
- **Generation** happens once per publish event (payment success or user re-publish) and produces a static bundle stored in object storage.
- **Serving** is edge-delivered directly from storage/CDN with no per-request server rendering — this is what allows thousands of sites to serve with near-zero marginal server load.
- This is *not* SSR-per-visit; it's build-once-serve-static, which differs subtly from the "Cloudflare Worker fetches JSON from DB per request" pattern in one of the reference docs — that pattern (dynamic edge fetch) is kept only as an optional fast-path for *previewing unpaid drafts*, not for serving paid, published sites, to avoid DB read amplification at scale.

### 3.2 Template-as-data
Templates are not React components hardcoded into the app; each template is a registry entry: `{ id, version, eventType, schema, theme, rendererKey }`. A small, fixed set of `rendererKey` implementations (shared layout engines) interpret `schema` + `theme` + project `data`. New visual variety comes from theme/schema authoring, not new renderer code, except for genuinely new interaction patterns (e.g., a new "story timeline" renderer), which is an explicit, rare engineering task.

### 3.3 Payment-webhook-authoritative generation
No code path other than the verified webhook handler is permitted to set `payments.status = 'success'` or enqueue generation. Frontend "payment success" redirects only show an optimistic "confirming..." state and poll project status — they never assume success.

### 3.4 Idempotency & retries
- Webhook handler: dedupe on Cashfree's event/order id (unique constraint) before processing.
- Generation worker: keyed by `(project_id, version)`; re-delivery of the same job is a safe no-op if that version is already deployed.
- Deployment step: uploads go to a versioned path (`/sites/{slug}/{version}/...`); the "live" pointer swap is the only mutable, atomic step.

## 4. Environments & CI/CD
- Environments: `local`, `preview` (per-PR, Neon branch + Cloudflare Pages preview), `staging`, `production`.
- CI: lint, typecheck, unit tests, migration dry-run, and a generation-worker integration test (generate a fixture project end-to-end into a scratch bucket) on every PR.
- CD: main branch auto-deploys to staging; production deploy is a manual promotion gated on staging smoke tests (checkout flow with Cashfree sandbox, OTP flow with Resend test mode).
- Database migrations run via a gated pipeline step before app deploy; every migration must be backward-compatible with the previous app version for at least one release (expand/contract pattern).

## 5. Testing Strategy
| Layer | Approach |
|---|---|
| Unit | Service-layer logic (slug generation, schema validation, pricing) |
| Integration | API route handlers against a real Neon test branch |
| Contract | Cashfree webhook payloads (recorded fixtures), Resend OTP flow |
| E2E | Playwright: template select → auth → form → (sandbox) payment → generated URL live |
| Load | k6/Artillery against generation queue and slug-allocation endpoint to validate collision handling under concurrency |
| Visual/responsiveness | Automated screenshot diff at the required breakpoints (§NFR) per template on every template schema/theme change |

## 6. Explicitly Deferred / Future Technical Work
- Redis-backed caching layer (noted as "future" in reference docs) — add when read load on Neon justifies it; not required for launch given static-site serving strategy.
- Multi-region active-active DB — Neon single-region is sufficient at launch scale; revisit at 500k+ MAU.
- Automated image/video content moderation pipeline.
