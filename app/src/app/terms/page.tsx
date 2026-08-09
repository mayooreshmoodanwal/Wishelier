import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Wishelier",
  description: "Terms of service and conditions for using Wishelier birthday surprise website generator.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-pink-500 selection:text-white">
      <header className="px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Wishelier Logo" width={32} height={32} className="rounded-lg shrink-0 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>
          <Link href="/" className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div className="space-y-2">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
            Terms of Service
          </span>
          <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
          <p className="text-xs text-white/40">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-6">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Acceptable Use</h2>
            <p>
              Wishelier provides custom animated web page creation tools for personal celebrations. You agree not to upload explicit, offensive, unlawful, or copyrighted content without authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Link Ownership & Availability</h2>
            <p>
              Custom URLs (e.g. <code className="text-pink-400">wishelier.in/s/name</code>) are allocated on a first-come, first-served basis. Published birthday sites remain active and accessible online for a minimum period of 1 year from payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Pricing & Payments</h2>
            <p>
              All purchases are processed in Indian Rupees (INR). Pricing is clearly disclosed before checkout (e.g. ₹99 per website).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Content Moderation</h2>
            <p>
              Wishelier reserves the right to suspend or remove any public link violating applicable laws or safety guidelines without notice.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
