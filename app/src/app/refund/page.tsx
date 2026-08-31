import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy | Wishelier",
  description: "Refund and cancellation guidelines for Wishelier website publishing services.",
};

export default function RefundPage() {
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
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#e6cb9c]/40 text-[#92400e] uppercase tracking-wider">
            <ShieldCheck size={13} /> Customer Protection
          </span>
          <h1 className="text-3xl font-extrabold text-[#1e1b2e]">Cancellation & Refund Policy</h1>
          <p className="text-xs text-[#4a4458]/70">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-sm text-[#4a4458] leading-relaxed border-t border-[#e6cb9c]/40 pt-6 bg-white p-8 rounded-3xl border shadow-xs">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">1. Money-Back Guarantee</h2>
            <p>
              We want you to be 100% satisfied with your birthday surprise website. If you encounter technical difficulties, duplicate charges, or if your website fails to generate properly, you are eligible for a full refund within 7 days of purchase.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">2. Failed / Interrupted Transactions</h2>
            <p>
              If your payment was debited from your bank account or UPI app but your website status shows &quot;Pending&quot;, our real-time payment gateway verification automatically updates your order within minutes. If your account was charged in error without a generated site, a full refund is automatically initiated within 3-5 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1e1b2e]">3. How to Request a Refund</h2>
            <p>
              To request a refund, please send an email to{" "}
              <a href="mailto:support@wishelier.in" className="text-[#0f766e] font-bold underline">
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
