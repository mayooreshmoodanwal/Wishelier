CREATE TYPE "public"."deployment_status" AS ENUM('queued', 'generating', 'ready', 'live', 'failed', 'superseded');--> statement-breakpoint
CREATE TYPE "public"."media_provider" AS ENUM('imagekit', 'r2');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'audio');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('unreviewed', 'ok', 'flagged', 'removed');--> statement-breakpoint
CREATE TYPE "public"."otp_purpose" AS ENUM('signup', 'login_2fa', 'password_reset');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('created', 'pending', 'success', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."pricing_tier" AS ENUM('standard', 'premium', 'luxury');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'pending_payment', 'paid', 'generating', 'live', 'failed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."share_channel" AS ENUM('whatsapp', 'instagram', 'facebook', 'x', 'telegram', 'copy_link');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "analytics_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"visitors" integer DEFAULT 0 NOT NULL,
	"unique_visitors" integer DEFAULT 0 NOT NULL,
	"shares" integer DEFAULT 0 NOT NULL,
	"top_country" text,
	"top_device" text
);
--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"status" "deployment_status" DEFAULT 'queued' NOT NULL,
	"storage_path" text,
	"build_log" text,
	"generated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_types_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"field_key" text NOT NULL,
	"provider" "media_provider" NOT NULL,
	"url" text NOT NULL,
	"type" "media_type" NOT NULL,
	"width" integer,
	"height" integer,
	"duration_seconds" numeric,
	"size_bytes" bigint,
	"moderation_status" "moderation_status" DEFAULT 'unreviewed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"otp_hash" text NOT NULL,
	"purpose" "otp_purpose" NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text DEFAULT 'cashfree' NOT NULL,
	"provider_order_id" text NOT NULL,
	"provider_event_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"status" "payment_status" DEFAULT 'created' NOT NULL,
	"raw_webhook_payload" jsonb,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_provider_order_id_unique" UNIQUE("provider_order_id"),
	CONSTRAINT "payments_provider_event_id_unique" UNIQUE("provider_event_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"template_version_id" uuid NOT NULL,
	"event_type" text,
	"slug" text NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"data" jsonb NOT NULL,
	"live_deployment_id" uuid,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"user_agent" text,
	"ip_address" "inet",
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "share_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"channel" "share_channel" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"schema" jsonb NOT NULL,
	"theme" jsonb NOT NULL,
	"animations_profile" text,
	"is_current" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"event_type_id" uuid NOT NULL,
	"category" text,
	"thumbnail_url" text,
	"preview_url" text,
	"renderer_key" text NOT NULL,
	"pricing_tier" "pricing_tier" NOT NULL,
	"price_amount" numeric(10, 2) DEFAULT '99.00' NOT NULL,
	"original_price" numeric(10, 2) DEFAULT '399.00' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"phone" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analytics_daily" ADD CONSTRAINT "analytics_daily_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_template_version_id_template_versions_id_fk" FOREIGN KEY ("template_version_id") REFERENCES "public"."template_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_events" ADD CONSTRAINT "share_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_versions" ADD CONSTRAINT "template_versions_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_event_type_id_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."event_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "analytics_daily_unique" ON "analytics_daily" USING btree ("project_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "deployment_version_unique" ON "deployments" USING btree ("project_id","version");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status") WHERE "projects"."status" IN ('pending_payment', 'generating');--> statement-breakpoint
CREATE UNIQUE INDEX "template_version_unique" ON "template_versions" USING btree ("template_id","version");