import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Wishelier",
  description: "Learn how Wishelier collects, protects, and manages your personal data and photos.",
};

export default function PrivacyPage() {
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
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#bcf6f0]/60 text-[#0f766e] uppercase tracking-wider">
            <ShieldCheck size={13} /> Legal & Trust
          </span>
          <h1 className="text-3xl font-extrabold text-[#1e1b2e]">Privacy Policy</h1>
          <p className="text-xs text-[#4a4458]/70">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[#4a4458] leading-relaxed border-t border-[#e6cb9c]/40 pt-6 bg-white p-8 rounded-3xl border shadow-xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">1. Information We Collect</h2>
            <p>
              When you use Wishelier, we collect your email address for account authentication, password management, and service updates. When customizing a birthday website, we process the photos, messages, custom names, and audio tracks you upload.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">2. Media & Data Storage</h2>
            <p>
              All user uploaded images and media assets are stored securely on encrypted cloud infrastructure (ImageKit / Cloudflare R2). Your data is private to your unique birthday link and is never sold or shared with third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">3. Payment Security</h2>
            <p>
              Payments on Wishelier are processed securely through Cashfree Payment Gateway. We do not store your credit/debit card numbers, UPI PINs, or bank account credentials on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">4. Cookies & Sessions</h2>
            <p>
              We use secure, HTTP-only JWT cookies to maintain your login session across dashboard visits. We do not use third-party tracking cookies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">5. Data Deletion Requests</h2>
            <p>
              You can request complete deletion of your account and all associated birthday websites and photos at any time by emailing support@wishelier.in.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
