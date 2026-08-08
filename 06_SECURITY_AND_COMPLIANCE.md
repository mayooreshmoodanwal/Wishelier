# Wishelier — Security & Compliance Requirements

**Version:** 2.0 (Consolidated). None of the three reference docs treated this as a standalone document — pulled out here because it needs sign-off before build, not as an afterthought.

---

## 1. Authentication & Session Security
- Passwords hashed with **Argon2id** (never bcrypt-only at this scale, never plaintext).
- OTPs: 6-digit, hashed at rest, 10-minute TTL, max 5 verification attempts before lockout, rate-limited per email and per IP.
- Sessions: short-lived JWT access token (e.g., 15 min) + rotating refresh token stored in an HTTP-only, `Secure`, `SameSite=Lax` cookie; refresh reuse detection (if a rotated-out token is replayed, revoke the whole session family).
- Forgot-password flow requires OTP re-verification; cannot be done from an authenticated session bypassing OTP.

## 2. Payment Security
- **PCI scope minimization**: card data never touches Wishly's servers — Cashfree's hosted checkout/SDK handles it entirely.
- Webhook signature verification (HMAC-SHA256 over timestamp + raw body) is mandatory on every inbound webhook call; requests failing verification are rejected with 400 and logged for anomaly monitoring.
- Idempotency: `provider_event_id` unique constraint prevents duplicate processing of retried webhook deliveries.
- No client-reported payment state is ever trusted to trigger generation or mark an order paid (TRD §3.3).
- Raw webhook payloads retained for dispute/audit purposes per financial record-keeping norms.

## 3. Rate Limiting & Abuse Prevention
| Surface | Limit approach |
|---|---|
| Login | Per-IP + per-account exponential backoff after failed attempts |
| OTP request/verify | Per-email and per-IP caps; cooldown between resend requests |
| Project creation | Per-account cap per hour to prevent slug-squatting/spam |
| Slug allocation | DB-level unique constraint + reserved-word blocklist; race handled via retry-with-suffix, not check-then-insert |
| Media upload | Signed URL scoped to one field/one project, short expiry, size/type constraints embedded in the signature |
| Public analytics beacon | Per-IP rate limit + bot filtering to avoid inflated/garbage analytics |

## 4. Data Protection
- Encryption in transit: TLS everywhere (enforced via Cloudflare + HSTS).
- Encryption at rest: Neon's built-in at-rest encryption; object storage provider's at-rest encryption for media.
- Secrets (Cashfree keys, Resend API key, JWT signing keys, HMAC secrets) held in environment/secret-manager, never committed, rotated on a defined schedule and immediately on suspected compromise.
- Input sanitization: all user-supplied text fields sanitized/escaped before rendering into generated static HTML to prevent stored XSS in someone's "birthday message" field — this is a specific, non-obvious risk unique to this product (user content becomes a publicly served static site).
- SQL injection prevention via parameterized queries/ORM only — no raw string-concatenated SQL.
- CSRF protection on all cookie-authenticated state-changing endpoints.

## 5. Content & Platform Safety
- `media.moderation_status` field reserved from day one (DB schema §2.7) even though automated moderation is deferred; supports a manual "report this site" flow at launch.
- Public report endpoint for visitors to flag a generated site (abusive content, impersonation); flagged sites can be soft-hidden by an admin pending review.
- Reserved-word slug blocklist prevents impersonation of platform routes (`admin`, `api`, `login`, etc.).

## 6. Privacy & Regulatory Compliance
- **Applicable regime:** India's Digital Personal Data Protection Act (DPDP Act) given the `.in` domain and India-first launch (Cashfree, INR); if/when international users are supported, GDPR principles should be layered in (data subject access/delete requests, lawful basis for processing, breach notification).
- Analytics are explicitly designed to be **cookie-free and privacy-friendly** (PRD §6.11) — no cross-site tracking, no third-party ad pixels on generated sites by default.
- Data subject rights to support before launch: account deletion (cascades to draft projects; published sites' historical payment/audit records retained per financial regulation even after account deletion, decoupled from PII where possible), data export of a user's own project data.
- Cookie/consent banner required if any non-essential cookies are introduced later; session cookies themselves are essential and don't require consent banners under most regimes, but this should be confirmed with legal counsel before launch, not assumed by engineering.

## 7. Infrastructure Security
- WAF + DDoS protection via Cloudflare in front of all traffic.
- Admin routes gated behind role check **and** recommend network-level restriction (VPN/allowlist) or step-up auth (re-auth/OTP) for destructive admin actions (deactivating templates, issuing refunds).
- Principle of least privilege on all service credentials (e.g., the generation worker's storage credential can write only to its own bucket/prefix, not read arbitrary user data it doesn't need).

## 8. Audit Logging
- Log (with actor, timestamp, before/after where relevant) for: payment status changes, template version publishes, admin actions (deactivate template, refund, unhide/hide a site), and slug reassignment/rollback events.
- Logs retained separately from application logs, immutable/append-only where feasible, to support dispute resolution and post-incident review.

## 9. Pre-Launch Security Checklist (sign-off gate)
- [ ] Webhook signature verification tested against Cashfree's actual signing behavior in sandbox, including malformed/replayed payloads.
- [ ] Penetration test or at minimum an automated security scan (e.g., OWASP ZAP) run against staging.
- [ ] Rate limits validated under load, not just unit-tested.
- [ ] Secrets scanning enabled in CI.
- [ ] Legal review of Terms of Service, Privacy Policy, and refund policy completed and linked from checkout.
