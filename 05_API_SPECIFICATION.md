# Wishelier — API Specification (v1)

Base URL: `https://api.wishly.in/v1` (or co-hosted under `/api` in the Next.js app)
Auth: Bearer JWT (access token) in `Authorization` header, except where noted public.
All write endpoints require CSRF protection on cookie-authenticated browser calls.

---

## 1. Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | public | `{email}` → sends OTP |
| POST | `/auth/verify-otp` | public | `{email, otp, purpose}` → verifies, returns short-lived signup token |
| POST | `/auth/set-password` | signup token | `{signupToken, password}` → creates user, returns session |
| POST | `/auth/login` | public | `{email, password}` → session (access + refresh cookie) |
| POST | `/auth/forgot-password` | public | `{email}` → sends OTP |
| POST | `/auth/reset-password` | public | `{email, otp, newPassword}` |
| POST | `/auth/refresh` | refresh cookie | rotates refresh token, issues new access token |
| POST | `/auth/logout` | session | revokes current session |

Rate limits: `signup`, `login`, `verify-otp`, `forgot-password` limited per-IP and per-email (see Security doc §3).

## 2. Templates

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/templates` | public | list active templates, filter by `event_type`, `category` |
| GET | `/templates/:slug` | public | template detail incl. current version metadata |
| GET | `/templates/:slug/schema` | public | current `schema` + `theme` JSON, used to render the dynamic form |
| POST | `/admin/templates` | admin | create template |
| POST | `/admin/templates/:id/versions` | admin | publish a new schema/theme version |
| PATCH | `/admin/templates/:id` | admin | activate/deactivate, update metadata |

## 3. Projects

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/projects` | user | `{templateSlug, data}` → creates draft project, allocates slug |
| GET | `/projects/:id` | owner | project detail (draft data + live deployment info) |
| PATCH | `/projects/:id` | owner | update draft `data` (must pass schema validation server-side) |
| GET | `/projects` | user | list own projects (dashboard) |
| POST | `/projects/:id/duplicate` | owner | clone a project as a new draft |
| DELETE | `/projects/:id` | owner | soft-delete a draft (not allowed once paid, except via admin/refund flow) |
| POST | `/projects/:id/publish` | owner | re-publish current draft as a new deployment (post-purchase edits) |

Slug availability check:

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/slugs/check?value=riya` | user | availability + suggested alternatives on collision |

## 4. Media

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/media/sign-upload` | owner | `{projectId, fieldKey, contentType, sizeBytes}` → returns signed direct-upload URL + constraints from the template schema |
| POST | `/media/confirm` | owner | called after client upload completes; server fetches/validates the object (type/size/dimensions) and writes the `media` row |
| DELETE | `/media/:id` | owner | remove an uploaded asset from a draft |

## 5. Payments

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/create-order` | owner | `{projectId}` → creates Cashfree order, project → `pending_payment` |
| POST | `/payments/webhook` | **Cashfree only**, signature-verified | authoritative payment confirmation; enqueues generation |
| GET | `/payments/:projectId/status` | owner | poll-friendly status (`pending`/`success`/`failed`) for the "confirming..." UI |

`POST /payments/webhook` is never called by the frontend and is exempt from standard JWT auth but strictly requires HMAC signature verification (see Security doc §4) and idempotency handling on `provider_event_id`.

## 6. Generation & Deployment

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/projects/:id/deployments` | owner | list versions with status, for rollback UI |
| POST | `/admin/deployments/:id/retry` | admin | manually retry a failed generation job |
| POST | `/projects/:id/rollback` | owner | re-point live to a prior successful deployment (subject to retention policy) |

## 7. Sharing & Analytics

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/share/:slug` | public | returns share message, QR code URL, social links for a live project |
| POST | `/share/:slug/event` | public | `{channel}` → records a `share_events` row |
| GET | `/projects/:id/analytics?range=30d` | owner | aggregated visitor stats from `analytics_daily` |
| POST | `/analytics/beacon` | public, rate-limited | fired from generated site pages; batched into `analytics_daily` |

## 8. Error Handling Conventions
- Standard shape: `{ "error": { "code": "SLUG_TAKEN", "message": "..." } }`.
- HTTP status conventions: 400 validation, 401 unauthenticated, 403 forbidden/ownership, 404 not found, 409 conflict (e.g., slug race, duplicate webhook), 422 schema validation failure, 429 rate limited, 5xx server.
- All mutating endpoints are safe to retry with the same idempotency key where applicable (`Idempotency-Key` header supported on `/projects`, `/payments/create-order`).

## 9. Versioning
- URL-versioned (`/v1`); breaking changes ship as `/v2` with a deprecation window; template `schema`/`theme` payloads carry their own `template_versions.version` so old drafts continue to validate against the version they were created with even after `/v1` itself evolves.
