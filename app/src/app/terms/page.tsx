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
    <div className="min-h-screen bg-[#faf7f2] text-[#1e1b2e]">
      <header className="px-6 py-3.5 border-b border-[#e6cb9c]/40 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Wishelier Logo" width={30} height={30} className="rounded-lg shrink-0 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#d97706] via-[#c026d3] to-[#0f766e] bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-[#4a4458] hover:text-[#1e1b2e] flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div className="space-y-2">
          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#e6cb9c]/40 text-[#92400e] uppercase tracking-wider">
            Terms of Service
          </span>
          <h1 className="text-3xl font-extrabold text-[#1e1b2e]">Terms & Conditions</h1>
          <p className="text-xs text-[#4a4458]/70">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[#4a4458] leading-relaxed border-t border-[#e6cb9c]/40 pt-6 bg-white p-8 rounded-3xl border shadow-xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">1. Acceptable Use</h2>
            <p>
              Wishelier provides custom animated web page creation tools for personal celebrations. You agree not to upload explicit, offensive, unlawful, or copyrighted content without authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">2. Link Ownership & Availability</h2>
            <p>
              Custom URLs (e.g. <code className="text-[#0f766e] font-bold bg-[#bcf6f0]/40 px-1 rounded">wishelier.in/s/name</code>) are allocated on a first-come, first-served basis. Published birthday sites remain active and accessible online for a minimum period of 1 year from payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">3. Pricing & Payments</h2>
            <p>
              Wishelier services are currently offered 100% free of charge under a limited-time promotional celebration offer. No payment or credit card details are collected during this promotional period.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">4. Content Moderation</h2>
            <p>
              Wishelier reserves the right to suspend or remove any published website that violates community guidelines or Indian cyber regulations without prior notice.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
