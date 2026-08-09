import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, Globe, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Us | Wishelier — Birthday Surprise Websites",
  description: "Meet the founders of Wishelier: Udit Agarwal, Ayush Kumar Singh, and Divyansh Agarwal. Learn how we build interactive digital birthday surprises.",
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
    name: "Udit Agarwal",
    title: "Co-Founder & Lead Developer",
    photo: "/founders/udit.png",
    linkedin: "https://www.linkedin.com/in/udit-agarwal260/",
    bio: "Passionate about full-stack engineering and building seamless, delightful digital experiences for celebrations.",
  },
  {
    name: "Ayush Kumar Singh",
    title: "Co-Founder & System Architect",
    photo: "/founders/ayush.png",
    linkedin: "https://www.linkedin.com/in/ayush-kumar-singh-781aa6337/",
    bio: "Specializing in high-performance web applications, interactive canvas rendering, and scalable backend infrastructure.",
  },
  {
    name: "Divyansh Agarwal",
    title: "Co-Founder & Product Lead",
    photo: "/founders/divyansh.png",
    linkedin: "https://www.linkedin.com/in/divyansh-agarwal2905/",
    bio: "Focused on user experience design, creative animations, and crafting emotional surprise moments.",
  },
];

export default function AboutPage() {
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
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {/* Hero Banner */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 uppercase tracking-wider">
            <Image src="/logo.png" alt="Wishelier Icon" width={16} height={16} className="inline object-contain" />
            <span>Our Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Crafting Unforgettable Birthday Surprises
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Wishelier turns ordinary birthday wishes into interactive, animated digital surprise websites filled with custom photo galleries, personalized notes, background music, and instant shareable links.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <Heart size={28} className="text-pink-400" />
            <h3 className="text-lg font-semibold">Made with Heart</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Every template is designed with rich animations, glowing particle trails, and custom music to make every birthday person feel uniquely loved.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <Globe size={28} className="text-purple-400" />
            <h3 className="text-lg font-semibold">Instant Unique Links</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Get your personalized URL like <code className="text-pink-400">wishelier.in/s/sarah</code> instantly and share it on WhatsApp or Instagram.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <ShieldCheck size={28} className="text-amber-400" />
            <h3 className="text-lg font-semibold">Affordable & Secure</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Premium birthday websites published for just ₹99 with instant UPI payment via Google Pay, PhonePe, Paytm, or Cards.
            </p>
          </div>
        </div>

        {/* MEET OUR FOUNDERS SECTION */}
        <section className="space-y-8 pt-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
              Leadership Team
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Meet Our Founders</h2>
            <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto">
              The creative minds behind Wishelier building India&apos;s leading birthday surprise platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FOUNDERS.map((founder) => (
              <div
                key={founder.name}
                className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-pink-500/30 transition-all flex flex-col items-center text-center space-y-4 group relative overflow-hidden"
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-pink-500/30 group-hover:border-pink-400 transition-all shadow-xl shadow-pink-500/10">
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{founder.name}</h3>
                  <p className="text-xs font-medium text-pink-400">{founder.title}</p>
                </div>
                <p className="text-xs text-white/50 leading-relaxed flex-1">
                  {founder.bio}
                </p>
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077b5]/20 hover:bg-[#0077b5]/30 border border-[#0077b5]/40 text-xs font-semibold text-white transition-all"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#0077b5]" />
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* INSTAGRAM & CTA BANNER */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <InstagramIcon className="w-5 h-5 text-pink-400" />
              <h3 className="text-xl font-bold text-white">Follow us on Instagram</h3>
            </div>
            <p className="text-xs text-white/60">
              Stay updated with new templates, surprise ideas, and featured birthday websites @wishelier.
            </p>
          </div>
          <a
            href="https://www.instagram.com/wishelier/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/20 flex items-center gap-2 cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @wishelier</span>
          </a>
        </div>
      </main>
    </div>
  );
}
