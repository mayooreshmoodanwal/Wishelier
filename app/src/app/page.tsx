"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  Star,
  Check,
  Heart,
  Gift,
  Eye,
  ShieldCheck,
  Zap,
} from "lucide-react";

import ProfileDrawer from "@/components/profile/ProfileDrawer";

// Dynamically import heavy canvas template renderers
const StarlitCelebration = dynamic(
  () => import("@/template-engine/renderers/elegant-single-page"),
  { ssr: true }
);
const PinkRomance = dynamic(
  () => import("@/template-engine/renderers/romantic-multi-page"),
  { ssr: true }
);
const BlushElegance = dynamic(
  () => import("@/template-engine/renderers/luxe-multi-page"),
  { ssr: true }
);

interface TemplateInfo {
  name: string;
  category: string;
  slug: string;
  price: string;
  originalPrice: string;
  description: string;
  badge: string;
  color: string;
  component: React.ComponentType<{
    data: Record<string, unknown>;
    theme: Record<string, unknown>;
  }>;
  demoData: Record<string, unknown>;
  theme: Record<string, unknown>;
}

const DEMO_TEMPLATES: Record<string, TemplateInfo> = {
  "starlit-celebration": {
    name: "Starlit Celebration",
    category: "Magical & Deep Night",
    slug: "starlit-celebration",
    price: "₹99",
    originalPrice: "₹399",
    description: "Floating star particle trails, ambient night glow, and interactive birthday journey.",
    badge: "Most Popular",
    color: "from-violet-500 to-indigo-500",
    component: StarlitCelebration as unknown as React.ComponentType<{
      data: Record<string, unknown>;
      theme: Record<string, unknown>;
    }>,
    demoData: {
      birthdayPerson: "Sarah",
      headline: "Happy Birthday Sarah!",
      tagline: "Wishing you the most magical day ✨",
      letterTitle: "A Special Message",
      letterBody:
        "Dear Sarah,\n\nOn this beautiful day, I want you to know how incredibly special you are. Your smile lights up every room, your kindness touches every heart, and your spirit inspires everyone around you.\n\nMay this new year of your life bring you endless joy, boundless love, and all the dreams your heart desires.\n\nHere's to another year of adventures, laughter, and beautiful memories together!\n\nWith all my love ❤️",
      letterClosing: "With all my love ❤️",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
          caption: "Unforgettable Moments",
        },
        {
          url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
          caption: "Shining Bright",
        },
      ],
      audioUrl: "",
      wishes: [
        { from: "Alex", text: "Happy Birthday! Have an incredible year ahead!" },
        { from: "Maya", text: "Sending you tons of love and big hugs today! 🎉" },
      ],
    },
    theme: {
      primaryColor: "#f472b6",
      secondaryColor: "#a78bfa",
      backgroundColor: "#0a0a0f",
      fontFamily: "playfair",
      particleStyle: "stars",
    },
  },
  "pink-romance": {
    name: "Pink Romance",
    category: "Sweet & Romantic",
    slug: "pink-romance",
    price: "₹99",
    originalPrice: "₹399",
    description: "Soft glowing hearts, ambient rose gold lighting, and romantic photo gallery.",
    badge: "Trending",
    color: "from-pink-500 to-rose-500",
    component: PinkRomance as unknown as React.ComponentType<{
      data: Record<string, unknown>;
      theme: Record<string, unknown>;
    }>,
    demoData: {
      birthdayPerson: "Emma",
      headline: "Happy Birthday My Love!",
      tagline: "You make every day brighter 💖",
      letterTitle: "For My Special Someone",
      letterBody:
        "My Dearest Emma,\n\nHappy Birthday! Having you in my life is the greatest gift I could ever ask for. Every moment with you is filled with warmth, laughter, and happiness.\n\nThank you for being your wonderful, caring, and beautiful self. Today is all about celebrating YOU!\n\nForever & Always 💕",
      letterClosing: "Forever & Always 💕",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
          caption: "Precious Memories",
        },
      ],
      audioUrl: "",
      wishes: [{ from: "Liam", text: "Happy Birthday Emma! You're the best!" }],
    },
    theme: {
      primaryColor: "#ec4899",
      secondaryColor: "#f472b6",
      backgroundColor: "#0f0610",
      fontFamily: "inter",
      particleStyle: "hearts",
    },
  },
  "blush-elegance": {
    name: "Blush Elegance",
    category: "Elegant & Modern",
    slug: "blush-elegance",
    price: "₹99",
    originalPrice: "₹399",
    description: "Minimalist luxury, golden serif typography, and elegant photo showcase.",
    badge: "New Release",
    color: "from-amber-400 to-rose-400",
    component: BlushElegance as unknown as React.ComponentType<{
      data: Record<string, unknown>;
      theme: Record<string, unknown>;
    }>,
    demoData: {
      birthdayPerson: "Victoria",
      headline: "Celebrating Victoria",
      tagline: "A toast to sophistication & elegance ✨",
      letterTitle: "A Gentle Birthday Note",
      letterBody:
        "Dearest Victoria,\n\nWishing you a magnificent birthday filled with peace, prosperity, and endless inspiration. Your grace and warmth touch everyone around you.\n\nCheers to another stellar year!",
      letterClosing: "Warmest Regards",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop",
          caption: "Elegance & Grace",
        },
      ],
      audioUrl: "",
      wishes: [{ from: "Sophia", text: "Happy Birthday Victoria! Wishing you health and success!" }],
    },
    theme: {
      primaryColor: "#fbbf24",
      secondaryColor: "#f43f5e",
      backgroundColor: "#0d0b12",
      fontFamily: "playfair",
      particleStyle: "sparks",
    },
  },
};

export default function HomePage() {
  const [selectedSlug, setSelectedSlug] = useState("starlit-celebration");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeTemplate = DEMO_TEMPLATES[selectedSlug] || DEMO_TEMPLATES["starlit-celebration"];
  const RendererComponent = activeTemplate.component;

  // Schema.org Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Wishelier",
    url: "https://wishelier.in",
    description:
      "Create & share personalized, interactive animated birthday surprise websites with music and photos.",
    applicationCategory: "EntertainmentApplication",
    offers: {
      "@type": "Offer",
      price: "99.00",
      priceCurrency: "INR",
    },
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white selection:bg-pink-500 selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Primary H1 Heading for SEO Crawlers */}
      <h1 className="sr-only">
        Wishelier — Create & Share Animated Birthday Surprise Websites
      </h1>

      {/* Floating Control Bar Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2.5 sm:py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group shrink-0">
            <Sparkles size={18} className="text-pink-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>

          {/* Template Switcher Dropdown (Center) */}
          <div className="relative shrink min-w-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-medium transition-all cursor-pointer max-w-[130px] sm:max-w-none"
            >
              <span className="text-white/60 text-xs hidden lg:inline">Template:</span>
              <span className="text-white font-semibold truncate">{activeTemplate.name}</span>
              <ChevronDown
                size={14}
                className={`text-white/60 transition-transform duration-200 shrink-0 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 mt-2 w-64 sm:w-72 p-2 rounded-2xl bg-[#120e1a]/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50"
                >
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white/40 px-3 py-1.5">
                    Select a Birthday Template
                  </p>
                  <div className="space-y-1">
                    {Object.values(DEMO_TEMPLATES).map((tmpl) => {
                      const isSelected = tmpl.slug === selectedSlug;
                      return (
                        <button
                          key={tmpl.slug}
                          onClick={() => {
                            setSelectedSlug(tmpl.slug);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-white"
                              : "hover:bg-white/5 text-white/70 hover:text-white border border-transparent"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-xs sm:text-sm flex items-center gap-1.5">
                              {tmpl.name}
                              {isSelected && <Check size={14} className="text-pink-400" />}
                            </div>
                            <div className="text-[10px] sm:text-xs text-white/40 mt-0.5">{tmpl.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-pink-400">{tmpl.price}</div>
                            <div className="text-[10px] text-white/30 line-through">
                              {tmpl.originalPrice}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href={`/create/${selectedSlug}`} className="hidden xs:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Use Template</span>
                <ArrowRight size={14} />
              </motion.button>
            </Link>

            {/* Profile Drawer / Single Auth Button */}
            <ProfileDrawer />
          </div>
        </div>
      </header>

      {/* Main Full-Screen Immersive Live Demo View */}
      <main className="pt-0 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSlug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <RendererComponent data={activeTemplate.demoData} theme={activeTemplate.theme} />
          </motion.div>
        </AnimatePresence>

        {/* TEMPLATES SHOWCASE SECTION — DESKTOP & MOBILE GRID */}
        <section className="bg-[#0b0813] border-t border-white/10 px-4 sm:px-8 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 uppercase tracking-wider">
                Explore All Designs
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white">
                Choose a Birthday Surprise Template
              </h2>
              <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto">
                Every template comes with custom photos, personal wishes, background music, and an instant shareable link.
              </p>
            </div>

            {/* Grid of 3 Templates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {Object.values(DEMO_TEMPLATES).map((tmpl) => {
                const isCurrent = tmpl.slug === selectedSlug;
                return (
                  <div
                    key={tmpl.slug}
                    className={`rounded-3xl p-6 bg-white/[0.03] border transition-all space-y-5 relative overflow-hidden flex flex-col justify-between ${
                      isCurrent
                        ? "border-pink-500/50 shadow-xl shadow-pink-500/10 bg-gradient-to-b from-pink-500/10 via-transparent to-transparent"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                        {tmpl.badge}
                      </span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-pink-400">{tmpl.price}</span>
                        <span className="text-xs text-white/40 line-through ml-1.5">{tmpl.originalPrice}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {tmpl.name}
                        {isCurrent && <Sparkles size={16} className="text-pink-400" />}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-white/70">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Custom Photo Gallery & Captions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Background Music & Sound Effects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400 shrink-0" />
                        <span>Custom URL (wishelier.in/s/name)</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedSlug(tmpl.slug);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-white/15 text-white border border-white/20"
                            : "bg-white/5 hover:bg-white/10 text-white/80 border border-white/10"
                        }`}
                      >
                        <Eye size={14} /> Preview
                      </button>
                      <Link href={`/create/${tmpl.slug}`} className="flex-1">
                        <button className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center gap-1 shadow-md shadow-pink-500/20 cursor-pointer">
                          <span>Use Template</span>
                          <ArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Structured SEO Content Block for Search Engine Spiders */}
        <section className="bg-[#0e0a16] border-t border-white/10 px-6 py-16 text-white/80">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Create & Share Magical Birthday Websites with Wishelier
              </h2>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                Wishelier is India&apos;s premier platform for creating personalized, interactive animated birthday surprise websites. Make your loved ones feel extraordinary on their special day with custom photo galleries, personal notes, custom music, and instant shareable links.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-semibold text-lg text-white">Stunning Animations</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Interactive floating confetti, glowing stars, particle trails, and photo carousels tailored to celebrate birthdays in style.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Zap size={20} />
                </div>
                <h3 className="font-semibold text-lg text-white">Instant Custom Link</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Generates an immediate shareable link such as <code className="text-pink-400">wishelier.in/s/sarah</code> ready for WhatsApp, Instagram, or email.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-semibold text-lg text-white">Secure UPI Checkout</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Seamless payment via PhonePe, Google Pay, Paytm, or cards with guaranteed uptime and 100% money-back protection.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 px-6 py-8 text-xs text-white/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-pink-400" />
            <span className="font-semibold text-white/90">Wishelier</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund" className="hover:text-white transition-colors">
              Cancellation & Refund
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
