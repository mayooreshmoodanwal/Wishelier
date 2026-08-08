"use client";

import React, { useState, useEffect, useCallback, use, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, Save, ShoppingCart, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { TemplateSchema, TemplateTheme } from "@/types";

// Lazy load DynamicForm
const DynamicForm = dynamic(() => import("@/components/forms/DynamicForm"), {
  loading: () => <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}</div>,
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

  // Load template
  useEffect(() => {
    fetch(`/api/templates?slug=${templateSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setTemplate(d.data);
          // Initialize defaults
          const defaults: Record<string, unknown> = {};
          d.data.schema.fields.forEach((field: { key: string; default?: unknown }) => {
            if (field.default !== undefined) defaults[field.key] = field.default;
          });
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

  const handleMediaUpload = useCallback(async (fieldKey: string, file: File): Promise<string> => {
    // Automatically initialize project draft if not created yet
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

    const { token, expire, signature, publicKey, urlEndpoint, folder } = authData.data;

    // Upload directly to ImageKit
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

    // Confirm with our backend
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
  }, [projectId, formValues, customSlug, templateSlug]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 size={32} className="text-pink-400 animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Template not found</p>
          <Link href="/" className="text-pink-400 hover:text-pink-300">← Back to templates</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 backdrop-blur-xl bg-black/40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles size={16} className="text-pink-400" />
              <span className="font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">Wishelier</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-sm text-white/50">{template.name}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Preview toggle (mobile) */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60"
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPreview ? "Form" : "Preview"}
            </button>

            {/* Save button */}
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-all disabled:opacity-40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </motion.button>

            {/* Checkout button */}
            <motion.button
              onClick={handleCheckout}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs font-semibold disabled:opacity-40"
              whileHover={!saving ? { scale: 1.03 } : {}}
              whileTap={!saving ? { scale: 0.97 } : {}}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
              Pay ₹99
            </motion.button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-3">
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* LEFT: Form */}
          <div className={`flex-1 min-w-0 ${showPreview ? "hidden lg:block" : "block"}`}>
            {/* Custom slug */}
            <div className="mb-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-medium text-white/70 mb-3">
                🔗 Your unique link
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/30 flex-shrink-0">wishelier.in/s/</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="your-name (auto-generated if empty)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all"
                  />
                  {slugStatus === "checking" && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 animate-spin" />}
                  {slugStatus === "available" && <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />}
                  {slugStatus === "taken" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400">Taken</span>}
                </div>
              </div>
            </div>

            {/* Dynamic form */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
              <h3 className="text-sm font-medium text-white/70 mb-4">✏️ Customize your site</h3>
              <Suspense fallback={<div className="animate-pulse h-32 bg-white/5 rounded-xl" />}>
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
          <div className={`w-[420px] flex-shrink-0 ${!showPreview ? "hidden lg:block" : "block flex-1"}`}>
            <div className="sticky top-20">
              <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-xs text-white/30 flex-1 text-center">Live Preview</span>
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
    const map: Record<string, () => Promise<{ default: React.ComponentType<{ data: Record<string, unknown>; theme: TemplateTheme }> }>> = {
      "elegant-single-page": () => import("@/template-engine/renderers/elegant-single-page"),
      "romantic-multi-page": () => import("@/template-engine/renderers/romantic-multi-page"),
      "luxe-multi-page": () => import("@/template-engine/renderers/luxe-multi-page"),
    };

    const loader = map[rendererKey];
    if (loader) {
      loader().then((mod) => setRenderer(() => mod.default));
    }
  }, [rendererKey]);

  if (!Renderer) return (
    <div className="flex items-center justify-center h-full bg-[#0a0a1a]">
      <Loader2 size={24} className="text-pink-400 animate-spin" />
    </div>
  );

  return <Renderer data={data} theme={theme} />;
}
