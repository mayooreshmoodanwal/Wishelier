import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, Globe, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "About Us | Wishelier — Best Birthday Website Builder",
  description:
    "Meet the founder of Wishelier: Ayush Kumar Singh. Learn how we build interactive 3D digital birthday surprise websites with custom music, photo memories, and instant links.",
};

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FOUNDERS = [
  {
    name: "Ayush Kumar Singh",
    title: "Founder & Lead Architect",
    photo: "/founders/ayush.png",
    linkedin: "https://www.linkedin.com/in/ayush-kumar-singh-781aa6337/",
    bio: "Specializing in high-performance interactive web applications, real-time 3D canvas animation, and scalable cloud infrastructure for celebration memories.",
  },
];

export default function AboutPage() {
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
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {/* Hero Banner */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1 rounded-full bg-[#bcf6f0]/60 text-[#0f766e] border border-[#0f766e]/30 uppercase tracking-wider">
            <Sparkles size={13} className="text-[#0f766e]" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1e1b2e] tracking-tight">
            Crafting Unforgettable Birthday Surprises
          </h1>
          <p className="text-base sm:text-lg text-[#4a4458] max-w-2xl mx-auto leading-relaxed">
            Wishelier turns ordinary birthday greetings into interactive, animated digital surprise websites filled with custom photo galleries, personalized notes, background music, and instant shareable links.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ebcae8]/50 border border-[#ebcae8] flex items-center justify-center text-[#86198f]">
              <Heart size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#1e1b2e]">Made with Heart</h3>
            <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
              Every template is designed with rich animations, glowing particle trails, and custom music to make every birthday person feel uniquely loved.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#bcf6f0]/60 border border-[#bcf6f0] flex items-center justify-center text-[#0f766e]">
              <Globe size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#1e1b2e]">Instant Unique Links</h3>
            <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
              Get your personalized URL like <code className="text-[#0f766e] font-bold bg-[#bcf6f0]/40 px-1 rounded">wishelier.in/s/name</code> instantly and share it on WhatsApp or Instagram at midnight.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#e6cb9c]/50 border border-[#e6cb9c] flex items-center justify-center text-[#92400e]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#1e1b2e]">100% Free Limited-Time Offer</h3>
            <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
              Premium 3D birthday websites published completely free of charge with instant 1-click publishing as part of our celebration offer.
            </p>
          </div>
        </div>

        {/* MEET OUR FOUNDER SECTION */}
        <section className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ebcae8]/50 text-[#86198f] uppercase tracking-wider">
              Leadership
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1e1b2e]">Meet the Creator</h2>
            <p className="text-xs sm:text-sm text-[#4a4458]/80 max-w-lg mx-auto">
              The engineer and designer behind Wishelier building India&apos;s leading birthday surprise platform.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {FOUNDERS.map((founder) => (
              <div
                key={founder.name}
                className="p-8 rounded-3xl bg-white border border-[#e6cb9c]/60 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center space-y-4 group relative overflow-hidden"
              >
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-3 border-[#e6cb9c] shadow-lg group-hover:scale-105 transition-transform">
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#1e1b2e]">{founder.name}</h3>
                  <p className="text-xs font-bold text-[#d97706]">{founder.title}</p>
                </div>
                <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
                  {founder.bio}
                </p>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0077b5] hover:bg-[#005f93] text-xs font-bold text-white transition-all shadow-sm"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* INSTAGRAM & CTA BANNER */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#ebcae8]/40 via-[#bcf6f0]/40 to-[#e6cb9c]/40 border border-[#e6cb9c]/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <InstagramIcon className="w-5 h-5 text-[#c026d3]" />
              <h3 className="text-xl font-bold text-[#1e1b2e]">Follow Wishelier on Instagram</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#4a4458]">
              Stay updated with new 3D templates, celebration surprise ideas, and featured websites @wishelier.
            </p>
          </div>
          <a
            href="https://www.instagram.com/wishelier/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @wishelier</span>
          </a>
        </div>
      </main>
    </div>
  );
}
