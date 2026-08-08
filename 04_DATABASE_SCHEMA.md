# Wishelier — Database Schema Design

**Version:** 2.0 (Consolidated) — Neon PostgreSQL

Design principles: templates and generated-site content are **data**, never new tables/columns per template; every payment-adjacent write is idempotent; every "live" mutation is versioned, never a destructive in-place update.

---

## 1. Entity Overview

```
users ──< projects >── templates
  │           │
  │           ├──< media
  │           ├──< payments
  │           ├──< deployments
  │           └──< analytics_daily
  │
  ├──< sessions
  └──< otp_verifications

templates ──< template_versions
```

## 2. Table Definitions

### 2.1 `users`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| email | text unique not null | |
| password_hash | text not null | Argon2id |
| email_verified | boolean default false | |
| phone | text nullable | optional, for future WhatsApp notifications |
| role | enum('user','admin') default 'user' | |
| created_at | timestamptz default now() | |
| updated_at | timestamptz default now() | |

### 2.2 `sessions`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users.id | |
| refresh_token_hash | text not null | never store raw token |
| user_agent | text | |
| ip_address | inet | |
| expires_at | timestamptz not null | |
| revoked_at | timestamptz nullable | supports logout / rotation |
| created_at | timestamptz default now() | |

### 2.3 `otp_verifications`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| email | text not null | |
| otp_hash | text not null | never store plaintext OTP |
| purpose | enum('signup','login_2fa','password_reset') | |
| attempts | int default 0 | lock after N failed attempts |
| expires_at | timestamptz not null | short TTL, e.g. 10 min |
| consumed_at | timestamptz nullable | |
| created_at | timestamptz default now() | |

### 2.4 `templates`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| slug | text unique not null | e.g. `elegant-gold` |
| name | text not null | |
| event_type | enum('birthday','anniversary','wedding','baby_shower','graduation','farewell','festival','memorial', ...) | extensible enum or lookup table (see note) |
| category | text | Elegant / Romantic / Luxury / Minimal / Fun / Cartoon / Premium Animated / Video-First / Photo Collage / Story Timeline |
| thumbnail_url | text | |
| preview_url | text | |
| renderer_key | text not null | which shared renderer implementation handles this template |
| pricing_tier | enum('standard','premium','luxury') | |
| active | boolean default true | inactive templates hidden from marketplace but existing projects keep working |
| created_at / updated_at | timestamptz | |

> **Note on `event_type`:** a native Postgres enum requires a migration to add values. If new event categories will be added frequently post-launch, prefer a `event_types` lookup table (`id`, `key`, `label`) referenced by FK instead of a hard enum, so expansion is a data insert, not a migration. Recommended for this product given the explicit roadmap of many future event types.

### 2.5 `template_versions`
Templates are versioned so a live project always renders against the schema/theme it was created with, even if the template is later updated.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| template_id | uuid FK → templates.id | |
| version | int not null | monotonically increasing per template |
| schema | jsonb not null | field definitions, see §3 |
| theme | jsonb not null | colors, typography, animation profile |
| animations_profile | text | e.g. "luxury" |
| is_current | boolean default true | only one current version per template |
| created_at | timestamptz default now() | |
| unique(template_id, version) | | |

### 2.6 `projects`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users.id | |
| template_id | uuid FK → templates.id | |
| template_version_id | uuid FK → template_versions.id | pinned at creation time |
| event_type | text/FK | denormalized copy for fast filtering |
| slug | text unique not null | the short URL |
| status | enum('draft','pending_payment','paid','generating','live','failed','expired') | state machine, see §4 |
| data | jsonb not null | current **draft** form values |
| live_deployment_id | uuid FK → deployments.id, nullable | which deployment is currently served |
| expires_at | timestamptz nullable | hosting-term expiry, if applicable (PRD §11) |
| created_at / updated_at | timestamptz | |

### 2.7 `media`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK → projects.id | |
| field_key | text not null | which schema field this asset belongs to |
| provider | enum('imagekit','r2') | |
| url | text not null | |
| type | enum('image','video','audio') | |
| width / height | int nullable | |
| duration_seconds | numeric nullable | for video/audio |
| size_bytes | bigint | |
| moderation_status | enum('unreviewed','ok','flagged','removed') default 'unreviewed' | reserved for future moderation (PRD §8) |
| created_at | timestamptz default now() | |

### 2.8 `payments`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK → projects.id | |
| user_id | uuid FK → users.id | |
| provider | text default 'cashfree' | |
| provider_order_id | text unique not null | Cashfree order id |
| provider_event_id | text unique nullable | for webhook dedupe |
| amount | numeric(10,2) not null | |
| currency | text default 'INR' | |
| status | enum('created','pending','success','failed','refunded') | |
| raw_webhook_payload | jsonb | stored for audit/dispute resolution |
| verified_at | timestamptz nullable | set only after signature verification |
| created_at | timestamptz default now() | |

### 2.9 `deployments`
Represents one generated, versioned build of a project.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK → projects.id | |
| version | int not null | increments per publish |
| status | enum('queued','generating','ready','live','failed','superseded') | |
| storage_path | text | e.g. `sites/{slug}/{version}/` |
| build_log | text nullable | for debugging failures |
| generated_at | timestamptz nullable | |
| unique(project_id, version) | | |

### 2.10 `analytics_daily`
Pre-aggregated to keep the table small; raw events are processed in the batching pipeline and not stored row-per-visit long-term.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK → projects.id | |
| date | date not null | |
| visitors | int default 0 | |
| unique_visitors | int default 0 | |
| shares | int default 0 | |
| top_country | text nullable | |
| top_device | text nullable | |
| unique(project_id, date) | | |

### 2.11 `share_events` (optional detail table, for share-button attribution)
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK → projects.id | |
| channel | enum('whatsapp','instagram','facebook','x','telegram','copy_link') | |
| created_at | timestamptz default now() | |

## 3. `template_versions.schema` JSON Shape

```json
{
  "fields": [
    { "key": "birthdayPerson", "type": "text", "required": true, "maxLength": 60 },
    { "key": "age", "type": "number", "required": false },
    { "key": "gallery", "type": "images", "min": 3, "max": 12, "aspectRatio": "1:1" },
    { "key": "music", "type": "audio", "required": false, "maxDurationSeconds": 60 },
    { "key": "message", "type": "long_text", "required": true, "maxLength": 500 },
    { "key": "timeline", "type": "timeline_entries", "min": 0, "max": 10 }
  ]
}
```

Validation of `projects.data` against this schema happens both client-side (UX) and server-side (authoritative, before allowing payment) — never trust client validation alone (TRD FR-4).

## 4. Key State Machines

**`projects.status`**
`draft → pending_payment → paid → generating → live → (failed | expired)`
Edits after `live` do not change `projects.status`; they update `projects.data` and, on publish, create a new `deployments` row and re-run `paid→generating→live` for that deployment only.

**`payments.status`**
`created → pending → success | failed`, with `success → refunded` as an admin-triggered transition.

**`deployments.status`**
`queued → generating → ready → live` (set live only by the Deployment Worker's atomic swap) or `→ failed`. A previous `live` deployment becomes `superseded` when a new one goes live (never deleted immediately — supports rollback).

## 5. Indexing Notes
- `projects.slug` — unique index (hot path for every visitor request resolution, if a dynamic fallback route is ever used for previews).
- `payments.provider_order_id`, `payments.provider_event_id` — unique indexes, critical for webhook idempotency.
- `deployments(project_id, version)` — unique composite index.
- `analytics_daily(project_id, date)` — unique composite index, supports upsert-on-ingest.
- Partial index on `projects(status) WHERE status IN ('pending_payment','generating')` to make ops dashboards/stuck-job queries cheap.

## 6. Retention & Archival
- `deployments` for superseded versions: retain last N (configurable, e.g., 5) versions per project; older ones' storage objects can be archived/deleted on a schedule, DB row retained with `status='superseded'` for audit history.
- `otp_verifications`: purge rows older than 30 days via scheduled job.
- `payments.raw_webhook_payload`: retain per financial record-keeping requirements (see Security & Compliance doc).
