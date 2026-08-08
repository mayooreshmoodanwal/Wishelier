# Wishelier — Non-Functional Requirements & Launch Readiness Plan

**Version:** 2.0 (Consolidated)

---

## 1. Performance Targets

| Metric | Target |
|---|---|
| Platform homepage LCP | < 2.5s |
| Generated site Lighthouse score | ≥ 95 (mobile-first) |
| Generation latency (payment confirmed → live URL) | P50 < 30s, P95 < 2 min |
| API P95 latency (non-generation endpoints) | < 300ms |
| Generated site TTFB (edge cache hit) | < 100ms |

## 2. Scalability Targets
- 100k+ registered users, 1M+ generated sites, sustained without architecture change (per PRD §7).
- Generation workers scale horizontally and independently from the web app (TRD §3, Architecture §2.4).
- DB connection pooling (Neon's pooled connection mode) required from day one to avoid connection exhaustion under bursty checkout traffic.

## 3. Availability & Reliability
- Platform API target: 99.9% uptime.
- Generated sites (static, edge-served): 99.99% target, since availability here depends on Cloudflare's edge, not app uptime — this is a deliberate architectural property, not just a number.
- Defined RTO/RPO for the primary database (e.g., RPO ≤ 5 min via Neon PITR, RTO ≤ 1 hour) — confirm against Neon's plan-tier backup capabilities before launch.
- Graceful degradation: if the generation queue backs up, the platform must clearly communicate "your site is being created, this can take a few minutes" rather than erroring — queue depth should never surface as a user-facing failure.

## 4. Responsiveness / Device Support
Every template must render correctly at: 320px, 375px, 390px, 768px, 1024px, 1280px, 1440px. The generation pipeline includes an automated responsiveness/visual-regression check (TRD §5) before a deployment can be marked `ready`.

## 5. Accessibility
Not present in any of the three reference documents — added here as a launch requirement:
- Generated sites: sufficient color contrast per template theme, alt text fields for uploaded images (add `altText` as an optional schema field type), keyboard-navigable share/CTA buttons.
- Platform app (auth, dashboard, forms): WCAG 2.1 AA as a target for the core purchase flow at minimum, since this is the revenue-critical path.

## 6. SEO & Social Sharing
- Every generated site emits Open Graph + Twitter Card metadata (title, description, preview image) so shared links render rich previews — this directly supports the product's core "share via WhatsApp/Instagram" mechanic and should be treated as a functional requirement, not a nice-to-have.
- `robots.txt`/indexing policy decision needed: should individual celebration sites be indexable by search engines by default, or `noindex` unless the owner opts in? (Privacy-sensitive — recommend `noindex` by default.)

## 7. Observability
- Structured logging across API, generation worker, and deployment worker with correlation IDs (`project_id`, `deployment_id`) threading through logs for traceability of a single purchase end-to-end.
- Error tracking (e.g., Sentry) on frontend and backend.
- Dashboards/alerts on: webhook failure rate, generation failure rate, generation queue depth/age, OTP delivery failure rate, payment success rate. Alert thresholds tied to the refund SLA in PRD §11 (if generation failures can't be resolved within the SLA window, on-call must be paged before the SLA is breached, not after).

## 8. Launch Readiness Checklist
- [ ] PRD, TRD, Architecture, DB schema, API spec, Security doc all reviewed and signed off by eng + product.
- [ ] Cashfree production credentials configured; webhook endpoint verified in production with a real low-value test transaction.
- [ ] Resend production domain verified (SPF/DKIM/DMARC) to avoid OTP emails landing in spam.
- [ ] At least 3 templates per launch event type (birthday) live and passing the responsiveness/visual-regression suite.
- [ ] Refund policy, Terms of Service, Privacy Policy published and linked from checkout.
- [ ] Monitoring/alerting (§7) live and tested with a synthetic failure (e.g., intentionally fail a sandbox webhook signature and confirm alert fires).
- [ ] Load test of checkout + generation pipeline at a realistic launch-day concurrency estimate.
- [ ] Security pre-launch checklist (see `06_SECURITY_AND_COMPLIANCE.md` §9) complete.
- [ ] Rollback runbook written and rehearsed: how to roll a project back to a prior deployment, how to pause new checkouts platform-wide if generation is failing broadly.

## 9. Post-Launch Roadmap (event-type expansion)
Per PRD §3/§7, expansion to weddings/anniversaries/etc. should require **only**: new `event_types` row (if using the lookup-table approach from `04_DATABASE_SCHEMA.md` §2.4), new templates + `template_versions` rows, and design assets. This roadmap item is the primary test of whether the "template-as-data" architectural bet paid off — the first non-birthday vertical launch should be tracked as a metric of engineering-effort-required, with a target of zero backend code changes.
