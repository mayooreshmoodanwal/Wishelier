import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  users,
  sessions,
  otpVerifications,
  eventTypes,
  templates,
  templateVersions,
  projects,
  media,
  payments,
  deployments,
  analyticsDaily,
  shareEvents,
} from "@/lib/db/schema";

// ============================================================
// SELECT types (what you get back from the DB)
// ============================================================

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type OtpVerification = InferSelectModel<typeof otpVerifications>;
export type EventType = InferSelectModel<typeof eventTypes>;
export type Template = InferSelectModel<typeof templates>;
export type TemplateVersion = InferSelectModel<typeof templateVersions>;
export type Project = InferSelectModel<typeof projects>;
export type Media = InferSelectModel<typeof media>;
export type Payment = InferSelectModel<typeof payments>;
export type Deployment = InferSelectModel<typeof deployments>;
export type AnalyticsDaily = InferSelectModel<typeof analyticsDaily>;
export type ShareEvent = InferSelectModel<typeof shareEvents>;

// ============================================================
// INSERT types (what you send to the DB)
// ============================================================

export type NewUser = InferInsertModel<typeof users>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewOtpVerification = InferInsertModel<typeof otpVerifications>;
export type NewEventType = InferInsertModel<typeof eventTypes>;
export type NewTemplate = InferInsertModel<typeof templates>;
export type NewTemplateVersion = InferInsertModel<typeof templateVersions>;
export type NewProject = InferInsertModel<typeof projects>;
export type NewMedia = InferInsertModel<typeof media>;
export type NewPayment = InferInsertModel<typeof payments>;
export type NewDeployment = InferInsertModel<typeof deployments>;
export type NewAnalyticsDaily = InferInsertModel<typeof analyticsDaily>;
export type NewShareEvent = InferInsertModel<typeof shareEvents>;

// ============================================================
// Template Schema Field Types
// ============================================================

export type FieldType =
  | "text"
  | "long_text"
  | "number"
  | "image"
  | "images"
  | "video"
  | "audio"
  | "music_select"
  | "text_array"
  | "countdown_date"
  | "timeline_entries"
  | "color_accent"
  | "date";

export interface TemplateField {
  key: string;
  type: FieldType;
  required?: boolean;
  label: string;
  placeholder?: string;
  default?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  aspectRatio?: string;
  maxSizeBytes?: number;
  maxDurationSeconds?: number;
  options?: string[];
  note?: string;
  placeholders?: string[];
}

export interface TemplateSchema {
  fields: TemplateField[];
}

export interface TemplateTheme {
  colors: {
    bg: string;
    card: string;
    glass: string;
    accent: string;
    accent2: string;
    accent3: string;
    text: string;
    textMuted: string;
    glow: string;
  };
  fonts: {
    heading: string;
    script: string;
    body: string;
  };
  borderRadius: string;
  animationProfile: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface ApiSuccess<T> {
  data: T;
}

// ============================================================
// Auth Types
// ============================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
}

// ============================================================
// Project Status Machine
// ============================================================

export type ProjectStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "generating"
  | "live"
  | "failed"
  | "expired";

export type PaymentStatus =
  | "created"
  | "pending"
  | "success"
  | "failed"
  | "refunded";

export type DeploymentStatus =
  | "queued"
  | "generating"
  | "ready"
  | "live"
  | "failed"
  | "superseded";

// ============================================================
// Renderer Props
// ============================================================

export interface RendererProps {
  data: Record<string, unknown>;
  theme: TemplateTheme;
  schema?: TemplateSchema;
  slug?: string;
  isPreview?: boolean;
}
