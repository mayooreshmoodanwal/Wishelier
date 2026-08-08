import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  bigint,
  jsonb,
  inet,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ============================================================
// ENUMS
// ============================================================

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const otpPurposeEnum = pgEnum("otp_purpose", [
  "signup",
  "login_2fa",
  "password_reset",
]);

export const mediaProviderEnum = pgEnum("media_provider", [
  "imagekit",
  "r2",
]);

export const mediaTypeEnum = pgEnum("media_type", [
  "image",
  "video",
  "audio",
]);

export const moderationStatusEnum = pgEnum("moderation_status", [
  "unreviewed",
  "ok",
  "flagged",
  "removed",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "pending_payment",
  "paid",
  "generating",
  "live",
  "failed",
  "expired",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "created",
  "pending",
  "success",
  "failed",
  "refunded",
]);

export const deploymentStatusEnum = pgEnum("deployment_status", [
  "queued",
  "generating",
  "ready",
  "live",
  "failed",
  "superseded",
]);

export const pricingTierEnum = pgEnum("pricing_tier", [
  "standard",
  "premium",
  "luxury",
]);

export const shareChannelEnum = pgEnum("share_channel", [
  "whatsapp",
  "instagram",
  "facebook",
  "x",
  "telegram",
  "copy_link",
]);

// ============================================================
// TABLES
// ============================================================

// --- Event Types (lookup table for extensibility) ---
export const eventTypes = pgTable("event_types", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  key: text("key").unique().notNull(),
  label: text("label").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Users ---
export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  phone: text("phone"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Sessions ---
export const sessions = pgTable("sessions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  refreshTokenHash: text("refresh_token_hash").notNull(),
  userAgent: text("user_agent"),
  ipAddress: inet("ip_address"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- OTP Verifications ---
export const otpVerifications = pgTable("otp_verifications", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  otpHash: text("otp_hash").notNull(),
  purpose: otpPurposeEnum("purpose").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Templates ---
export const templates = pgTable("templates", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  eventTypeId: uuid("event_type_id")
    .references(() => eventTypes.id)
    .notNull(),
  category: text("category"),
  thumbnailUrl: text("thumbnail_url"),
  previewUrl: text("preview_url"),
  rendererKey: text("renderer_key").notNull(),
  pricingTier: pricingTierEnum("pricing_tier").notNull(),
  // Pricing: MRP ₹399 → Launch Offer ₹99
  priceAmount: numeric("price_amount", { precision: 10, scale: 2 })
    .default("99.00")
    .notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 })
    .default("399.00")
    .notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Template Versions ---
export const templateVersions = pgTable(
  "template_versions",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    templateId: uuid("template_id")
      .references(() => templates.id, { onDelete: "cascade" })
      .notNull(),
    version: integer("version").notNull(),
    schema: jsonb("schema").notNull(),
    theme: jsonb("theme").notNull(),
    animationsProfile: text("animations_profile"),
    isCurrent: boolean("is_current").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("template_version_unique").on(
      table.templateId,
      table.version
    ),
  ]
);

// --- Projects ---
export const projects = pgTable(
  "projects",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    templateId: uuid("template_id")
      .references(() => templates.id)
      .notNull(),
    templateVersionId: uuid("template_version_id")
      .references(() => templateVersions.id)
      .notNull(),
    eventType: text("event_type"),
    slug: text("slug").unique().notNull(),
    status: projectStatusEnum("status").default("draft").notNull(),
    data: jsonb("data").notNull(),
    liveDeploymentId: uuid("live_deployment_id"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("projects_status_idx")
      .on(table.status)
      .where(
        sql`${table.status} IN ('pending_payment', 'generating')`
      ),
  ]
);

// --- Media ---
export const media = pgTable("media", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  fieldKey: text("field_key").notNull(),
  provider: mediaProviderEnum("provider").notNull(),
  url: text("url").notNull(),
  type: mediaTypeEnum("type").notNull(),
  width: integer("width"),
  height: integer("height"),
  durationSeconds: numeric("duration_seconds"),
  sizeBytes: bigint("size_bytes", { mode: "number" }),
  moderationStatus: moderationStatusEnum("moderation_status")
    .default("unreviewed")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Payments ---
export const payments = pgTable("payments", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  provider: text("provider").default("cashfree").notNull(),
  providerOrderId: text("provider_order_id").unique().notNull(),
  providerEventId: text("provider_event_id").unique(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("INR").notNull(),
  status: paymentStatusEnum("status").default("created").notNull(),
  rawWebhookPayload: jsonb("raw_webhook_payload"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Deployments ---
export const deployments = pgTable(
  "deployments",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    version: integer("version").notNull(),
    status: deploymentStatusEnum("status").default("queued").notNull(),
    storagePath: text("storage_path"),
    buildLog: text("build_log"),
    generatedAt: timestamp("generated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("deployment_version_unique").on(
      table.projectId,
      table.version
    ),
  ]
);

// --- Analytics (pre-aggregated daily) ---
export const analyticsDaily = pgTable(
  "analytics_daily",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date", { mode: "date" }).notNull(),
    visitors: integer("visitors").default(0).notNull(),
    uniqueVisitors: integer("unique_visitors").default(0).notNull(),
    shares: integer("shares").default(0).notNull(),
    topCountry: text("top_country"),
    topDevice: text("top_device"),
  },
  (table) => [
    uniqueIndex("analytics_daily_unique").on(table.projectId, table.date),
  ]
);

// --- Share Events ---
export const shareEvents = pgTable("share_events", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  channel: shareChannelEnum("channel").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  projects: many(projects),
  payments: many(payments),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  eventType: one(eventTypes, {
    fields: [templates.eventTypeId],
    references: [eventTypes.id],
  }),
  versions: many(templateVersions),
  projects: many(projects),
}));

export const templateVersionsRelations = relations(
  templateVersions,
  ({ one }) => ({
    template: one(templates, {
      fields: [templateVersions.templateId],
      references: [templates.id],
    }),
  })
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [projects.templateId],
    references: [templates.id],
  }),
  templateVersion: one(templateVersions, {
    fields: [projects.templateVersionId],
    references: [templateVersions.id],
  }),
  media: many(media),
  payments: many(payments),
  deployments: many(deployments),
  analytics: many(analyticsDaily),
  shareEvents: many(shareEvents),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  project: one(projects, {
    fields: [media.projectId],
    references: [projects.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  project: one(projects, {
    fields: [payments.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const deploymentsRelations = relations(deployments, ({ one }) => ({
  project: one(projects, {
    fields: [deployments.projectId],
    references: [projects.id],
  }),
}));

export const analyticsDailyRelations = relations(
  analyticsDaily,
  ({ one }) => ({
    project: one(projects, {
      fields: [analyticsDaily.projectId],
      references: [projects.id],
    }),
  })
);

export const shareEventsRelations = relations(shareEvents, ({ one }) => ({
  project: one(projects, {
    fields: [shareEvents.projectId],
    references: [projects.id],
  }),
}));
