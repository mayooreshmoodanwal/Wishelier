import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MessageSquare, Clock, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Contact Us | Wishelier — Support & Inquiries",
  description: "Get in touch with the Wishelier customer support team for inquiries, help, or payment assistance.",
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
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Wishelier Logo" width={32} height={32} className="rounded-lg shrink-0 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/wishelier/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-500/30 text-xs text-pink-300 hover:text-white transition-all"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>@wishelier</span>
            </a>
            <Link href="/" className="text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-4 text-center">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
            Help & Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            We&apos;re Here to Help
          </h1>
          <p className="text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            Have questions about creating your birthday site, custom links, or payment status? Contact our dedicated support team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <Mail size={28} className="text-pink-400" />
            <h3 className="text-lg font-semibold">Email Support</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Reach out directly to our support email for quick assistance with payments or site edits.
            </p>
            <a href="mailto:support@wishelier.in" className="inline-block text-sm font-semibold text-pink-400 hover:underline">
              support@wishelier.in
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <Clock size={28} className="text-purple-400" />
            <h3 className="text-lg font-semibold">Response Time</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Our team responds to all customer inquiries within 2 to 4 hours during business days.
            </p>
            <span className="text-xs font-medium text-white/70">Mon – Sat: 9 AM – 9 PM IST</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <MessageSquare size={28} className="text-amber-400" />
            <h3 className="text-lg font-semibold">Instant Help</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Check your dashboard to view payment statuses, edit birthday templates, or manage existing links.
            </p>
            <Link href="/dashboard" className="inline-block text-xs font-semibold text-amber-400 hover:underline">
              Go to My Dashboard →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
