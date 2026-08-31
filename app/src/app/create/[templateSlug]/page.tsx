"use client";

import React, { useState, useEffect, useCallback, use, Suspense } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Save, ShoppingCart, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { TemplateSchema, TemplateTheme } from "@/types";

// Lazy load DynamicForm
const DynamicForm = dynamic(() => import("@/components/forms/DynamicForm"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-white/60 rounded-2xl border border-[#e6cb9c]/30" />
      ))}
    </div>
  ),
});

interface TemplateData {
  id: string;
  slug: string;
  name: string;
  category: string;
  rendererKey: string;
  priceAmount: string;
  originalPrice: string;
  schema: TemplateSchema;
  theme: TemplateTheme;
}

interface CreatePageProps {
  params: Promise<{ templateSlug: string }>;
}

export default function CreatePage({ params }: CreatePageProps) {
  const { templateSlug } = use(params);
  const router = useRouter();

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [customSlug, setCustomSlug] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load template & initialize defaults
  useEffect(() => {
    fetch(`/api/templates?slug=${templateSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setTemplate(d.data);
          const defaults: Record<string, unknown> = {};
          if (d.data.schema?.fields) {
            d.data.schema.fields.forEach((field: { key: string; default?: unknown }) => {
              if (field.default !== undefined) {
                defaults[field.key] = field.default;
              }
            });
          }
          setFormValues(defaults);
        }
      })
      .catch(() => setError("Failed to load template"))
      .finally(() => setLoading(false));
  }, [templateSlug]);

  // Slug availability check (debounced)
  useEffect(() => {
    if (!customSlug || customSlug.length < 3) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/slugs/check?value=${customSlug}`);
        const data = await res.json();
        setSlugStatus(data.data?.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [customSlug]);

  const handleFieldChange = useCallback((key: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Auto-create or save project draft when needed
  const ensureProjectCreated = async (currentValues = formValues): Promise<string> => {
    if (projectId) return projectId;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateSlug,
        data: currentValues,
        customSlug: customSlug || undefined,
      }),
    });

    if (res.status === 401) {
      router.push(`/login?redirect=/create/${templateSlug}`);
      throw new Error("Please log in to save your project or upload media");
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Failed to initialize project draft");

    const newId = data.data.id;
    setProjectId(newId);
    return newId;
  };

  const handleMediaUpload = useCallback(
    async (fieldKey: string, file: File): Promise<string> => {
      let targetProjectId = projectId;
      if (!targetProjectId) {
        targetProjectId = await ensureProjectCreated();
      }

      // Get signed upload credentials from ImageKit
      const authRes = await fetch("/api/media/sign-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: targetProjectId, fieldKey, contentType: file.type }),
      });
      const authData = await authRes.json();
      if (!authRes.ok) throw new Error(authData.error?.message || "Failed to get upload credentials");

      const { token, expire, signature, publicKey, folder } = authData.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", publicKey);
      formData.append("signature", signature);
      formData.append("expire", expire.toString());
      formData.append("token", token);
      formData.append("folder", folder);
      formData.append("useUniqueFileName", "true");

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error("Upload failed");

      const url = uploadData.url;

      // Confirm with backend
      await fetch("/api/media/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: targetProjectId,
          fieldKey,
          url,
          type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "audio",
          sizeBytes: file.size,
        }),
      });

      return url;
    },
    [projectId, formValues, customSlug, templateSlug]
  );

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaveSuccess(false);
    try {
      if (!projectId) {
        await ensureProjectCreated();
      } else {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: formValues }),
        });

        if (res.status === 401) {
          router.push(`/login?redirect=/create/${templateSlug}`);
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setError(data.error?.message || "Save failed");
          return;
        }
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCheckout = async () => {
    setSaving(true);
    setError("");
    try {
      let targetProjectId = projectId;
      if (!targetProjectId) {
        targetProjectId = await ensureProjectCreated();
      }

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: targetProjectId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Payment setup failed");
        return;
      }

      const { paymentSessionId } = data.data;
      router.push(`/checkout/${targetProjectId}?session=${paymentSessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <Loader2 size={32} className="text-[#0f766e] animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center text-[#1e1b2e]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-[#e6cb9c]/40">
          <p className="text-xl font-bold mb-4">Template not found</p>
          <Link href="/" className="text-[#0f766e] font-semibold hover:underline">
            ← Back to templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1e1b2e]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e6cb9c]/40 backdrop-blur-xl bg-white/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo.png" alt="Wishelier" width={26} height={26} className="rounded-lg object-contain" />
              <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-[#d97706] via-[#c026d3] to-[#0f766e] bg-clip-text text-transparent">
                Wishelier
              </span>
            </Link>
            <span className="text-[#4a4458]/30">/</span>
            <span className="text-xs sm:text-sm font-semibold text-[#4a4458]/80 truncate max-w-[140px] sm:max-w-none">
              {template.name}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Preview toggle (mobile) */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#e6cb9c]/60 text-xs font-semibold text-[#1e1b2e] cursor-pointer"
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showPreview ? "Form" : "Preview"}</span>
            </button>

            {/* Save button */}
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#e6cb9c]/80 text-xs font-semibold text-[#1e1b2e] hover:bg-[#faf7f2] transition-all disabled:opacity-40 cursor-pointer shadow-xs"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saveSuccess ? "Saved ✓" : "Save"}</span>
            </motion.button>

            {/* Checkout button */}
            <motion.button
              onClick={handleCheckout}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white text-xs font-bold shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-40"
              whileHover={!saving ? { scale: 1.03 } : {}}
              whileTap={!saving ? { scale: 0.97 } : {}}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
              <span>Publish for ₹99</span>
            </motion.button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-3">
          <p className="text-xs sm:text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 shadow-xs">
            {error}
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* LEFT: Form */}
          <div className={`flex-1 min-w-0 ${showPreview ? "hidden lg:block" : "block"}`}>
            {/* Custom slug */}
            <div className="mb-6 p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-[#e6cb9c]/50 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-[#1e1b2e] mb-2 flex items-center gap-1.5">
                <span>🔗 Your Custom Birthday Link</span>
              </h3>
              <p className="text-xs text-[#4a4458]/70 mb-3">
                Create a memorable share link for WhatsApp or Instagram (e.g. wishelier.in/s/priya)
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-[#4a4458]/70 bg-gray-100 px-3 py-2.5 rounded-xl border border-gray-200 shrink-0">
                  wishelier.in/s/
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="birthday-name"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#e6cb9c]/70 rounded-xl text-[#1e1b2e] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] transition-all"
                  />
                  {slugStatus === "checking" && (
                    <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                  )}
                  {slugStatus === "available" && (
                    <CheckCircle2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                  )}
                  {slugStatus === "taken" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-red-500">
                      Already Taken
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic form */}
            <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-[#e6cb9c]/50 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#1e1b2e]">✏️ Personalize Your Website</h3>
                <span className="text-[11px] font-semibold text-[#0f766e] bg-[#bcf6f0]/40 px-2.5 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>
              <Suspense fallback={<div className="animate-pulse h-32 bg-white rounded-2xl" />}>
                <DynamicForm
                  schema={template.schema}
                  values={formValues}
                  onChange={handleFieldChange}
                  onMediaUpload={handleMediaUpload}
                />
              </Suspense>
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div className={`w-[440px] flex-shrink-0 ${!showPreview ? "hidden lg:block" : "block flex-1"}`}>
            <div className="sticky top-20">
              <div className="rounded-3xl border border-[#e6cb9c]/60 bg-white overflow-hidden shadow-xl" style={{ height: "calc(100vh - 110px)" }}>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#faf7f2] border-b border-[#e6cb9c]/40">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold text-[#4a4458]/70 flex-1 text-center">
                    Instant Live Preview
                  </span>
                </div>
                <div className="h-full overflow-auto">
                  <LivePreview
                    rendererKey={template.rendererKey}
                    data={formValues}
                    theme={template.theme}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic renderer loader for live preview
function LivePreview({
  rendererKey,
  data,
  theme,
}: {
  rendererKey: string;
  data: Record<string, unknown>;
  theme: TemplateTheme;
}) {
  const [Renderer, setRenderer] = useState<React.ComponentType<{ data: Record<string, unknown>; theme: TemplateTheme }> | null>(null);

  useEffect(() => {
    const map: Record<
      string,
      () => Promise<{ default: React.ComponentType<{ data: Record<string, unknown>; theme: TemplateTheme }> }>
    > = {
      "elegant-single-page": () => import("@/template-engine/renderers/elegant-single-page"),
      "romantic-multi-page": () => import("@/template-engine/renderers/romantic-multi-page"),
      "luxe-multi-page": () => import("@/template-engine/renderers/luxe-multi-page"),
    };

    const loader = map[rendererKey];
    if (loader) {
      loader().then((mod) => setRenderer(() => mod.default));
    }
  }, [rendererKey]);

  if (!Renderer) {
    return (
      <div className="flex items-center justify-center h-full bg-[#faf7f2]">
        <Loader2 size={24} className="text-[#0f766e] animate-spin" />
      </div>
    );
  }

  return <Renderer data={data} theme={theme} />;
}
