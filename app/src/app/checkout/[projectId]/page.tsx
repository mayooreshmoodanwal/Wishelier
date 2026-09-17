"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Gift,
  Share2,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface CheckoutContentProps {
  projectId: string;
}

function CheckoutContent({ projectId }: CheckoutContentProps) {
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const activateAndLoad = async () => {
      try {
        setLoading(true);

        // First activate the project for free
        const activateRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });

        const activateData = await activateRes.json();
        if (activateData.data?.slug) {
          if (isMounted) setSlug(activateData.data.slug);
        }

        // Fetch latest project info for slug if not in activation response
        if (!activateData.data?.slug) {
          const projectRes = await fetch(`/api/projects/${projectId}`);
          if (projectRes.ok) {
            const projectData = await projectRes.json();
            if (isMounted && projectData.data?.slug) {
              setSlug(projectData.data.slug);
            }
          }
        }

        // Fire celebratory confetti!
        if (typeof window !== "undefined") {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#10b981", "#d97706", "#c026d3", "#38bdf8"],
          });
        }
      } catch (err) {
        console.error("Activation error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load project details.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    activateAndLoad();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const liveUrl = typeof window !== "undefined"
    ? `${window.location.origin}/s/${slug || projectId}`
    : `/s/${slug || projectId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const shareText = encodeURIComponent(
    `🎉 I created an interactive 3D birthday surprise website for you! Open it here: ${liveUrl}`
  );

  if (loading) {
    return (
      <div className="py-12 text-center">
        <Loader2 size={42} className="animate-spin text-emerald-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#1e1b2e] mb-2">Activating Your Website...</h2>
        <p className="text-xs sm:text-sm text-[#4a4458]">
          Applying 100% Free Limited Time Offer. No payment required!
        </p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6">
      {/* Free Offer Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800 uppercase tracking-wider">
        <Sparkles size={13} className="text-emerald-600" />
        <span>Limited Time Offer Claimed — 100% FREE</span>
      </div>

      {/* Main Confirmation */}
      <div className="space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1e1b2e]">
          Your Birthday Website is Live! 🎉
        </h1>
        <p className="text-xs sm:text-sm text-[#4a4458] max-w-sm mx-auto">
          All services and hosting are completely free of charge. Your custom interactive celebration is ready to share.
        </p>
      </div>

      {/* Pricing Receipt Summary */}
      <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e6cb9c]/60 text-left text-xs space-y-2">
        <div className="flex justify-between items-center text-[#4a4458]">
          <span>Website Publishing:</span>
          <span className="line-through text-gray-400">₹399.00</span>
        </div>
        <div className="flex justify-between items-center text-[#4a4458]">
          <span>Launch Price:</span>
          <span className="line-through text-gray-400">₹99.00</span>
        </div>
        <div className="flex justify-between items-center text-[#0f766e] font-bold text-sm pt-2 border-t border-[#e6cb9c]/40">
          <span className="flex items-center gap-1">
            <Gift size={15} /> Limited Time Promo:
          </span>
          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-extrabold">
            ₹0.00 (FREE)
          </span>
        </div>
      </div>

      {/* Share Link Box */}
      <div className="p-4 rounded-2xl bg-white border border-[#e6cb9c] shadow-xs space-y-3 text-left">
        <div className="flex items-center justify-between text-xs font-bold text-[#1e1b2e]">
          <span className="flex items-center gap-1.5">
            <Share2 size={14} className="text-[#d97706]" />
            Your Custom Sharable Link
          </span>
          <span className="text-[10px] text-emerald-600 font-extrabold uppercase">Live & Ready</span>
        </div>
        <div className="flex items-center gap-2 bg-[#faf7f2] p-2.5 rounded-xl border border-[#e6cb9c]/50 font-mono text-xs text-[#0f766e] break-all">
          <span className="flex-1 truncate">{liveUrl}</span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-[#e6cb9c] text-xs font-semibold text-[#1e1b2e] hover:bg-[#faf7f2] flex items-center gap-1 cursor-pointer shrink-0 transition-all"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="space-y-2.5 pt-2">
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <span>View Live Birthday Website</span>
          <ExternalLink size={16} />
        </a>

        <a
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Share2 size={14} />
          <span>Share on WhatsApp at Midnight</span>
        </a>

        <Link href="/dashboard" className="block w-full">
          <button className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#1e1b2e] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
            <span>Manage in Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </Link>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1e1b2e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-3xl bg-white border border-[#e6cb9c]/70 p-6 sm:p-8 shadow-xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <Suspense fallback={<div className="py-8 text-center text-[#4a4458]/70 text-xs">Activating website...</div>}>
          <CheckoutContent projectId={projectId} />
        </Suspense>
      </motion.div>
    </div>
  );
}
