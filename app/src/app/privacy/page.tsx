import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Wishelier",
  description: "Learn how Wishelier collects, protects, and manages your personal data and photos.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-pink-500 selection:text-white">
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

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div className="space-y-2">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            Legal & Trust
          </span>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-xs text-white/40">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-6">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Information We Collect</h2>
            <p>
              When you use Wishelier, we collect your email address for account authentication, password management, and service updates. When customizing a birthday website, we process the photos, messages, custom names, and audio tracks you upload.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Media & Data Storage</h2>
            <p>
              All user uploaded images and media assets are stored securely on encrypted cloud infrastructure (ImageKit / Cloudflare R2). Your data is private to your unique birthday link and is never sold or shared with third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Payment Security</h2>
            <p>
              Payments on Wishelier are processed through Cashfree Payment Gateway. We do not store your credit/debit card numbers, UPI PINs, or bank account credentials on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Cookies & Sessions</h2>
            <p>
              We use secure, HTTP-only authentication cookies to maintain your login session. No tracking cookies are used to profile your external browsing activity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">5. Contact Us</h2>
            <p>
              If you have any questions or requests regarding your data deletion, please contact us at{" "}
              <a href="mailto:support@wishelier.in" className="text-pink-400 underline">
                support@wishelier.in
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
