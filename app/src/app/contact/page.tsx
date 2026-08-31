import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MessageSquare, Clock, ArrowLeft, Headphones } from "lucide-react";

export const metadata = {
  title: "Contact Us | Wishelier — Support & Inquiries",
  description:
    "Get in touch with the Wishelier customer support team for inquiries, help with birthday templates, custom links, or payment assistance.",
};

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1e1b2e]">
      {/* Top Header */}
      <header className="px-6 py-3.5 border-b border-[#e6cb9c]/40 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Wishelier Logo" width={30} height={30} className="rounded-lg shrink-0 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#d97706] via-[#c026d3] to-[#0f766e] bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>
          <div className="flex items-center gap-3.5">
            <a
              href="https://www.instagram.com/wishelier/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ebcae8]/50 border border-[#ebcae8] text-xs font-semibold text-[#86198f] hover:opacity-80 transition-all shadow-xs"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#c026d3]" />
              <span>@wishelier</span>
            </a>
            <Link href="/" className="text-xs font-semibold text-[#4a4458] hover:text-[#1e1b2e] flex items-center gap-1.5 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-4 text-center">
          <span className="inline-block text-xs font-bold px-3.5 py-1 rounded-full bg-[#bcf6f0]/60 text-[#0f766e] border border-[#0f766e]/30 uppercase tracking-wider">
            <Headphones size={13} className="inline mr-1 text-[#0f766e]" /> Help & Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1e1b2e] tracking-tight">
            We&apos;re Here to Help
          </h1>
          <p className="text-base text-[#4a4458] max-w-xl mx-auto leading-relaxed">
            Have questions about customizing your birthday site, unique links, or payment assistance? Contact our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ebcae8]/50 border border-[#ebcae8] flex items-center justify-center text-[#86198f]">
              <Mail size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#1e1b2e]">Email Support</h3>
            <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
              Reach out directly to our support email for quick assistance with payments or site edits.
            </p>
            <a href="mailto:support@wishelier.in" className="inline-block text-sm font-bold text-[#c026d3] hover:underline">
              support@wishelier.in
            </a>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#bcf6f0]/60 border border-[#bcf6f0] flex items-center justify-center text-[#0f766e]">
              <Clock size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#1e1b2e]">Response Time</h3>
            <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
              Our team responds to all customer inquiries within 2 to 4 hours during business days.
            </p>
            <span className="text-xs font-semibold text-[#0f766e]">Mon – Sat: 9 AM – 9 PM IST</span>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#e6cb9c]/50 border border-[#e6cb9c] flex items-center justify-center text-[#92400e]">
              <MessageSquare size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#1e1b2e]">Dashboard Hub</h3>
            <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
              Check your dashboard to view payment statuses, edit birthday templates, or manage existing links.
            </p>
            <Link href="/dashboard" className="inline-block text-xs font-bold text-[#d97706] hover:underline">
              Go to My Dashboard →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
