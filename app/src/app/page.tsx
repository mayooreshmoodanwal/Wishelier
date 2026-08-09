"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown, Check, Star, Globe, Heart, ShieldCheck, Gift } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ProfileDrawer from "@/components/profile/ProfileDrawer";

// Theme JSONs
import starlitTheme from "@/template-engine/themes/starlit-celebration.json";
import pinkTheme from "@/template-engine/themes/pink-romance.json";
import blushTheme from "@/template-engine/themes/blush-elegance.json";
import type { TemplateTheme } from "@/types";

// Dynamic imports with SSR enabled for maximum SEO crawler visibility
const ElegantSinglePageRenderer = dynamic(
  () => import("@/template-engine/renderers/elegant-single-page")
);
const RomanticMultiPageRenderer = dynamic(
  () => import("@/template-engine/renderers/romantic-multi-page")
);
const LuxeMultiPageRenderer = dynamic(
  () => import("@/template-engine/renderers/luxe-multi-page")
);

interface TemplateOption {
  slug: string;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  theme: TemplateTheme;
  demoData: Record<string, unknown>;
  renderer: React.ComponentType<{ data: Record<string, unknown>; theme: TemplateTheme }>;
}

// Demo data for full-screen immersive template preview
const DEMO_TEMPLATES: Record<string, TemplateOption> = {
  "starlit-celebration": {
    slug: "starlit-celebration",
    name: "Starlit Celebration",
    category: "Premium Animated",
    price: "₹99",
    originalPrice: "₹399",
    theme: starlitTheme as TemplateTheme,
    renderer: ElegantSinglePageRenderer,
    demoData: {
      birthdayPerson: "Sarah",
      heroPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
      specialMessage:
        "Dear Sarah,\n\nOn this beautiful day, I want you to know how incredibly special you are. Your smile lights up every room, your kindness touches every heart, and your spirit inspires everyone around you.\n\nMay this new year of your life bring you endless joy, boundless love, and all the dreams your heart desires. You deserve every bit of happiness the world has to offer.\n\nHere's to another year of adventures, laughter, and beautiful memories together!",
      senderSignature: "With all my love ❤️",
      gallery: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop",
      ],
      galleryCaptions: [
        "Beautiful Smile",
        "Golden Hour",
        "Pure Joy",
        "Best Day Ever",
        "Always Shining",
        "Forever Young",
      ],
      wishes: [
        "May your life be as colorful and vibrant as a rainbow after the rain.",
        "Wishing you success in everything you touch this year and always.",
        "May you spread your wings and soar to new heights this birthday!",
        "Like a sunflower, may you always turn towards the light and grow.",
        "Here's to more laughter, more adventures, and more beautiful moments!",
        "Luck, love, and happiness — may they follow you everywhere you go.",
      ],
      celebrationGifs: [
        "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyeXBzMDZ3djd6ZnAxZjJkcmVoZ28weGlrYzl5M3ZrbTFraWZ4Y3J6dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif",
        "https://media2.giphy.com/media/v1.Y2lkPTZjMDliUycmJieHBuNjN3bDk3OGg1ZG9za203aDlrMjV1cDJvb24wNTV4bTg2cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lMameLIF8voLu8HxWV/giphy.gif",
      ],
    },
  },
  "pink-romance": {
    slug: "pink-romance",
    name: "Pink Romance",
    category: "Romantic",
    price: "₹99",
    originalPrice: "₹399",
    theme: pinkTheme as TemplateTheme,
    renderer: RomanticMultiPageRenderer,
    demoData: {
      birthdayPerson: "Priya",
      greetingMessage: "You're the most adorable human I have ever met! 💕",
      entryButtonText: "Click to Enter Our World 💕",
      reasons: [
        "Your laugh is literally my favorite sound in the whole world.",
        "You always know how to make me smile even on my worst days.",
        "You have the kindest heart and sweetest soul.",
        "Every memory with you feels like a beautiful scene from a movie.",
      ],
      reasonGifs: [],
      memoryPhotos: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
      ],
      memoryCaptions: ["First Date", "Weekend Getaway", "Sunset Walks", "Forever Us"],
      memoryDescriptions: [
        "A magical evening under the lights",
        "Laughter by the beach",
        "Holding hands at golden hour",
        "Here's to a lifetime of love and joy",
      ],
      finalMessage:
        "Happy Birthday my love! May this year bring you all the magic and happiness you bring into my life every single day. 💖",
      endingImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop",
    },
  },
  "blush-elegance": {
    slug: "blush-elegance",
    name: "Blush Elegance",
    category: "Luxury",
    price: "₹99",
    originalPrice: "₹399",
    theme: blushTheme as TemplateTheme,
    renderer: LuxeMultiPageRenderer,
    demoData: {
      birthdayPerson: "Akanksha",
      heroImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop",
      heroTagline: "a little universe made just for you ✨",
      heroDescription:
        "Today is wrapped in blush light, tiny stars, warm memories, and all the love you deserve.",
      countdownDate: "2026-12-31T00:00:00",
      memoryPhotos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop",
      ],
      memoryCaptions: [
        "Summer Sunset",
        "City Lights",
        "Coffee Morning",
        "Laughter",
        "Starry Night",
        "Forever Smile",
      ],
      reasons: [
        "Your kindness illuminates every room.",
        "You make simple moments unforgettable.",
        "Your grace and positivity inspire me daily.",
        "You listen with your whole heart.",
        "Your happiness is infectious.",
        "You are truly one of a kind.",
      ],
      letterContent:
        "Dearest Akanksha,\n\nHappy Birthday! Creating this digital haven for you is just a small gesture to reflect how much light you bring into our lives. May your day be filled with warm smiles, boundless joy, and unforgettable moments.\n\nWith infinite love & admiration.",
      finalMessage: "You'll always be my favorite chapter.",
      finalImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop",
    },
  },
};

export default function HomePage() {
  const [selectedSlug, setSelectedSlug] = useState<string>("starlit-celebration");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeTemplate = DEMO_TEMPLATES[selectedSlug] || DEMO_TEMPLATES["starlit-celebration"];
  const RendererComponent = activeTemplate.renderer;

  // Schema.org WebApplication Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Wishelier",
    url: "https://wishelier.in",
    description:
      "Wishelier lets you create magical, interactive animated birthday websites with custom music, photo galleries, and personalized greetings.",
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "99.00",
      priceCurrency: "INR",
    },
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Primary H1 Heading for SEO Crawlers */}
      <h1 className="sr-only">
        Wishelier — Create & Share Animated Birthday Surprise Websites
      </h1>

      {/* Floating Control Bar Overlay Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2 sm:py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-4 w-full">
          {/* Logo & Brand Navigation */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-1 group">
              <Sparkles size={16} className="text-pink-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="text-xs sm:text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Wishelier
              </span>
            </Link>
            <span className="hidden lg:inline-block text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
              Live Preview
            </span>
          </div>

          {/* Template Switcher Dropdown */}
          <div className="relative shrink min-w-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[10px] sm:text-sm font-medium transition-all cursor-pointer max-w-[95px] xs:max-w-[120px] sm:max-w-none"
            >
              <span className="text-white/60 text-xs hidden lg:inline">Template:</span>
              <span className="text-white font-semibold truncate">{activeTemplate.name}</span>
              <ChevronDown
                size={12}
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
                  className="absolute left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 mt-2 w-60 sm:w-72 p-2 rounded-2xl bg-[#120e1a]/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50"
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

          {/* Pricing & CTA & Profile Drawer */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
              <Star size={12} className="fill-amber-300" />
              <span>₹99 Launch Offer (was ₹399)</span>
            </div>

            <Link href={`/create/${selectedSlug}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 sm:px-5 py-1 sm:py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-[10px] sm:text-sm shadow-lg shadow-pink-500/20 flex items-center gap-1 sm:gap-2 cursor-pointer shrink-0"
              >
                <span>Use Template</span>
                <ArrowRight size={12} className="hidden sm:inline" />
              </motion.button>
            </Link>

            {/* Profile Drawer / Auth Buttons */}
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

        {/* Structured SEO Content Block for Search Engine Spiders (>300 words) */}
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
                  <Globe size={20} />
                </div>
                <h3 className="font-semibold text-lg text-white">Instant Custom Links</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Pick your unique link name (like <code className="text-pink-400 font-mono">wishelier.in/s/sarah</code>) and share it instantly on WhatsApp or Instagram.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-semibold text-lg text-white">Instant UPI Checkout</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Publish your custom website for just ₹99 with secure Cashfree payment via Google Pay, PhonePe, Paytm, or UPI.
                </p>
              </div>
            </div>

            {/* Template Internal Links Grid for SEO */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-400 mb-4">
                Explore Birthday Templates
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/create/starlit-celebration"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-2"
                >
                  <Gift size={14} className="text-pink-400" /> Starlit Celebration Template
                </Link>
                <Link
                  href="/create/pink-romance"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-2"
                >
                  <Heart size={14} className="text-purple-400" /> Pink Romance Template
                </Link>
                <Link
                  href="/create/blush-elegance"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-2"
                >
                  <Sparkles size={14} className="text-amber-400" /> Blush Elegance Template
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
                >
                  My Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
                >
                  My Websites
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
                >
                  Account Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Semantic Internal Links */}
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
