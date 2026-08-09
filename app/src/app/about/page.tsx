import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Sparkles, Heart, Globe, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | Wishelier — Birthday Surprise Websites",
  description: "Learn about Wishelier, India's premier platform for creating animated, personalized birthday surprise websites.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles size={20} className="text-pink-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>
          <Link href="/" className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} /> Back to Templates
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-4 text-center">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 uppercase tracking-wider">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Making Birthdays Unforgettable Digital Experiences
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Wishelier was created with a simple, magical vision: to turn standard birthday wishes into interactive, animated digital surprise websites that your loved ones will cherish forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <Heart size={28} className="text-pink-400" />
            <h3 className="text-lg font-semibold">Made with Heart</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Every template is designed with rich animations, glowing particle effects, and customized music to make every birthday person feel uniquely loved.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <Globe size={28} className="text-purple-400" />
            <h3 className="text-lg font-semibold">Instant Unique Links</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Get your personalized URL like <code className="text-pink-400">wishelier.in/s/sarah</code> instantly and share it on WhatsApp or Instagram with zero tech skills needed.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <ShieldCheck size={28} className="text-amber-400" />
            <h3 className="text-lg font-semibold">Affordable & Secure</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Premium birthday websites published for just ₹99 with instant UPI payment via Google Pay, PhonePe, Paytm, or Credit/Debit Cards.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Ready to create a birthday surprise?</h3>
            <p className="text-xs text-white/60">Choose a template and publish your custom website in under 2 minutes.</p>
          </div>
          <Link href="/">
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/20 flex items-center gap-2 cursor-pointer shrink-0">
              <span>Browse Templates</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
