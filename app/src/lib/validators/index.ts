import { z } from "zod";

// ============================================================
// Auth Validators
// ============================================================

export const signupSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
  purpose: z.enum(["signup", "login_2fa", "password_reset"]),
});

export const setPasswordSchema = z.object({
  signupToken: z.string().min(1, "Signup token is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
});

// ============================================================
// Project Validators
// ============================================================

export const createProjectSchema = z.object({
  templateSlug: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
  customSlug: z.string().min(3).max(32).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
});

export const updateProjectSchema = z.object({
  data: z.record(z.string(), z.unknown()),
});

export const checkSlugSchema = z.object({
  value: z.string().min(3).max(32).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

// ============================================================
// Media Validators
// ============================================================

export const signUploadSchema = z.object({
  projectId: z.string().uuid(),
  fieldKey: z.string().min(1),
  contentType: z.string().min(1),
  sizeBytes: z.number().positive().max(52428800), // 50MB max
});

export const confirmUploadSchema = z.object({
  projectId: z.string().uuid(),
  fieldKey: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["image", "video", "audio"]),
  width: z.number().optional(),
  height: z.number().optional(),
  durationSeconds: z.number().optional(),
  sizeBytes: z.number().positive(),
});

// ============================================================
// Payment Validators
// ============================================================

export const createOrderSchema = z.object({
  projectId: z.string().uuid(),
});

// ============================================================
// Share Validators
// ============================================================

export const shareEventSchema = z.object({
  channel: z.enum(["whatsapp", "instagram", "facebook", "x", "telegram", "copy_link"]),
});

// ============================================================
// Analytics Validators
// ============================================================

export const analyticsBeaconSchema = z.object({
  projectId: z.string().uuid(),
  referrer: z.string().optional(),
  device: z.string().optional(),
  country: z.string().optional(),
});
