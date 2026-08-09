import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy | Wishelier",
  description: "Refund and cancellation guidelines for Wishelier website publishing services.",
};

export default function RefundPage() {
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
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            Customer Protection
          </span>
          <h1 className="text-3xl font-bold text-white">Cancellation & Refund Policy</h1>
          <p className="text-xs text-white/40">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-6">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Money-Back Guarantee</h2>
            <p>
              We want you to be 100% satisfied with your birthday surprise website. If you encounter technical difficulties, duplicate charges, or if your website fails to generate properly, you are eligible for a full refund within 7 days of purchase.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Failed / Interrupted Transactions</h2>
            <p>
              If your payment was debited from your bank account or UPI app but your website status shows &quot;Pending&quot;, our real-time payment gateway verification automatically updates your order within minutes. If your account was charged in error without a generated site, a full refund is automatically initiated within 3-5 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. How to Request a Refund</h2>
            <p>
              To request a refund, please send an email to{" "}
              <a href="mailto:support@wishelier.in" className="text-pink-400 underline">
                support@wishelier.in
              </a>{" "}
              with your <strong>Order ID</strong> (found in your transaction history or email receipt). Refunds are credited back to the original payment method (UPI / Bank Account) within 5 to 7 working days.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
