"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  Star,
  Globe,
  Heart,
  ShieldCheck,
  Gift,
  HelpCircle,
  Music,
  Zap,
  CheckCircle2,
  Camera,
  Layers,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import ProfileDrawer from "@/components/profile/ProfileDrawer";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

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
    category: "Premium Animated 3D",
    price: "FREE",
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
    category: "Romantic & Playful",
    price: "FREE",
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
      reasonGifs: [
        "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyeXBzMDZ3djd6ZnAxZjJkcmVoZ28weGlrYzl5M3ZrbTFraWZ4Y3J6dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif",
      ],
      memoryPhotos: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
      ],
      memoryCaptions: ["First Date", "Weekend Getaway", "Sunset Walks", "Forever Us"],
      memoryDescriptions: [
        "A magical evening under the twinkling fairy lights",
        "Endless laughter and breeze by the beach",
        "Holding hands as the golden hour faded",
        "Here's to a lifetime of love, warmth, and joy",
      ],
      finalMessage:
        "Happy Birthday my love! May this year bring you all the magic, happiness, and peace you bring into my life every single day. 💖",
      endingImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop",
    },
  },
  "blush-elegance": {
    slug: "blush-elegance",
    name: "Blush Elegance",
    category: "Luxury Multi-Chapter",
    price: "FREE",
    originalPrice: "₹399",
    theme: blushTheme as TemplateTheme,
    renderer: LuxeMultiPageRenderer,
    demoData: {
      birthdayPerson: "Akanksha",
      heroImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop",
      heroTagline: "a little universe made just for you ✨",
      heroDescription:
        "Today is wrapped in blush light, tiny stars, warm memories, and all the love you deserve.",
      countdownDate: "2026-12-31T00:00",
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
        "You always know how to comfort my heart.",
        "Your smile feels like warm golden hour.",
        "You turn regular days into beautiful stories.",
        "You are loved more than words could ever say.",
      ],
      letterContent:
        "Dearest Akanksha,\n\nHappy Birthday! Creating this digital haven for you is just a small gesture to reflect how much light, kindness, and beauty you bring into my world every day.\n\nMay this year be filled with warm smiles, boundless joy, and unforgettable adventures. Thank you for simply being you.\n\nWith infinite love & admiration.",
      finalMessage: "You'll always be my favorite chapter.",
      finalImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop",
    },
  },
};

const FAQS = [
  {
    q: "What is Wishelier and why is it the best birthday website builder?",
    a: "Wishelier is the #1 handcrafted 3D birthday website builder and generator. Unlike paper cards or static greeting pages, Wishelier creates personalized, high-performance interactive websites featuring glowing particle animations, 3D candle blowing, custom background music, memory polaroid flip-cards, love letter envelopes, and personalized photo galleries — completely 100% free as part of our limited-time celebration offer.",
  },
  {
    q: "How does the birthday website generator work?",
    a: "Creating your personalized website takes under 2 minutes: 1) Pick a curated 3D animated template, 2) Customize with the birthday person's name, personal message, photos, reasons, and music, 3) Publish instantly for 100% free (no payment or credit card required) to get a custom sharable link like wishelier.in/s/name.",
  },
  {
    q: "Can I add custom background music, video, and photos?",
    a: "Yes! You can choose from our royalty-free celebratory soundtrack library or upload your own audio track, attach high-resolution photo galleries with captions, and even embed surprise memory videos.",
  },
  {
    q: "How much does a Wishelier birthday website cost?",
    a: "Wishelier is currently 100% FREE as part of our limited-time celebration offer (normally ₹399 / ₹99). There are zero fees, zero hidden charges, and no payment required — you get instant 1-click publishing with lifetime edge hosting.",
  },
  {
    q: "How do I share the custom birthday link with my friend or partner?",
    a: "Once published, you get a clean URL like wishelier.in/s/priya that opens instantly in full screen on any smartphone (iOS / Android), tablet, or desktop browser. You can share it directly via WhatsApp, Instagram DM, Telegram, or SMS at midnight!",
  },
  {
    q: "Do I need any coding or design skills?",
    a: "No coding or design skills required at all! Everything is automatically generated and animated in real-time with our smart builder and live preview.",
  },
  {
    q: "Will the generated birthday website have complete content if I only fill in a few details?",
    a: "Yes! Wishelier includes smart fallbacks and rich curated starter templates so your generated birthday website always looks complete, vibrant, and full of heartfelt content even if you're in a rush.",
  },
];

export default function HomePage() {
  const [selectedSlug, setSelectedSlug] = useState<string>("starlit-celebration");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeTemplate = DEMO_TEMPLATES[selectedSlug] || DEMO_TEMPLATES["starlit-celebration"];
  const RendererComponent = activeTemplate.renderer;

  // Schema.org WebApplication, FAQPage & HowTo Structured Data for Google & AI Engines
  const jsonLdApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Wishelier — #1 Best Birthday Website Builder",
    alternateName: ["Wishelier", "Wishelier Birthday Website Generator", "Wishelier 3D Surprise Studio"],
    url: "https://wishelier.in",
    logo: "https://wishelier.in/logo.png",
    image: "https://wishelier.in/logo.png",
    description:
      "The #1 handcrafted 3D birthday website builder and generator. Build interactive personalized birthday websites with music, 3D candles, polaroid memories, and love letters 100% free for a limited time.",
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1280",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      description: "Limited time promotion: 100% Free celebration offer",
    },
    author: {
      "@type": "Organization",
      name: "Wishelier Studio",
      url: "https://wishelier.in",
      logo: "https://wishelier.in/logo.png",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Build a Custom 3D Birthday Website in 2 Minutes",
    description: "Create an interactive personalized birthday website with custom photos, music, and love letters 100% free for a limited time.",
    step: [
      {
        "@type": "HowToStep",
        name: "Choose an Animated Template",
        text: "Select from our 3D Starlit Celebration, Romantic Multi-Page, or Blush Elegance templates.",
      },
      {
        "@type": "HowToStep",
        name: "Personalize with Memories & Music",
        text: "Add the birthday person's name, custom messages, memory photos, reasons, and background music.",
      },
      {
        "@type": "HowToStep",
        name: "Publish & Share Custom Link",
        text: "Publish instantly 100% free with zero payment required to receive your custom surprise URL (wishelier.in/s/name).",
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-[#faf7f2] text-[#1e1b2e]">
      {/* Schema.org Structured Data Scripts for Google & LLM Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      {/* Semantic H1 for Search Engine Spiders */}
      <h1 className="sr-only">
        Wishelier — Best Birthday Website Builder & Handcrafted 3D Birthday Website Generator
      </h1>

      {/* Floating Header Overlay */}
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2 sm:py-2.5 bg-white/85 backdrop-blur-xl border-b border-[#e6cb9c]/40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-4 w-full">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-1.5 group">
              <Image src="/logo.png" alt="Wishelier" width={28} height={28} className="rounded-lg object-contain shrink-0" />
              <span className="text-sm sm:text-xl font-bold bg-gradient-to-r from-[#d97706] via-[#c026d3] to-[#0f766e] bg-clip-text text-transparent">
                Wishelier
              </span>
            </Link>
            <span className="hidden lg:inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#bcf6f0]/50 text-[#0f766e] border border-[#0f766e]/20">
              3D Live Preview
            </span>
          </div>

          {/* Template Switcher Dropdown */}
          <div className="relative shrink min-w-0 z-50">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#faf7f2] hover:bg-white border border-[#e6cb9c]/80 text-[11px] sm:text-sm font-semibold transition-all cursor-pointer max-w-[110px] xs:max-w-[140px] sm:max-w-none shadow-xs"
            >
              <span className="text-[#4a4458]/70 text-xs hidden lg:inline">Template:</span>
              <span className="text-[#1e1b2e] truncate">{activeTemplate.name}</span>
              <ChevronDown
                size={13}
                className={`text-[#4a4458]/70 transition-transform duration-200 shrink-0 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 mt-2 w-64 sm:w-80 p-2 rounded-3xl bg-white border border-[#e6cb9c] backdrop-blur-2xl shadow-2xl z-[100]"
                >
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4a4458]/60 px-3 py-1.5">
                    Select Birthday Template
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
                          className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#bcf6f0]/40 border border-[#0f766e]/30 text-[#1e1b2e]"
                              : "hover:bg-[#faf7f2] text-[#4a4458] hover:text-[#1e1b2e] border border-transparent"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                              {tmpl.name}
                              {isSelected && <Check size={14} className="text-[#0f766e]" />}
                            </div>
                            <div className="text-[10px] sm:text-xs text-[#4a4458]/70 mt-0.5">{tmpl.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-[#d97706]">{tmpl.price}</div>
                            <div className="text-[10px] text-gray-400 line-through">{tmpl.originalPrice}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Offer & Use Template CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1.5 rounded-full">
              <Star size={12} className="fill-emerald-600 text-emerald-600" />
              <span>🎉 Limited Time Offer: 100% FREE (was ₹399)</span>
            </div>

            <Link href={`/create/${selectedSlug}`}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/15 flex items-center gap-1 sm:gap-2 cursor-pointer shrink-0"
              >
                <span>Use Template</span>
                <ArrowRight size={13} className="hidden sm:inline" />
              </motion.button>
            </Link>

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
            transition={{ duration: 0.35 }}
          >
            <RendererComponent data={activeTemplate.demoData} theme={activeTemplate.theme} />
          </motion.div>
        </AnimatePresence>

        {/* High-Authority SEO Content Section */}
        <section className="bg-gradient-to-b from-white via-[#faf7f2] to-white border-t border-[#e6cb9c]/40 px-6 py-20 text-[#1e1b2e]">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Main Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="inline-block text-xs font-bold px-3.5 py-1 rounded-full bg-[#bcf6f0]/60 text-[#0f766e] border border-[#0f766e]/30 uppercase tracking-wider">
                ✨ India&apos;s #1 Best Birthday Website Builder & Generator
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1e1b2e] leading-tight tracking-tight">
                Handcrafted 3D Birthday Website Generator & Personalised Birthday Gifts
              </h2>
              <p className="text-sm sm:text-base text-[#4a4458] leading-relaxed">
                Wishelier is the ultimate digital birthday surprise builder. Transform treasured photos, heartfelt memories, and favorite songs into an unforgettable 3D animated website that opens instantly on any phone, tablet, or laptop.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3.5 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#ebcae8]/50 border border-[#ebcae8] flex items-center justify-center text-[#86198f]">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-bold text-lg text-[#1e1b2e]">3D Animated Particle Magic</h3>
                <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
                  Interactive floating confetti, 3D candle blowing, typewriter love letters, and polaroid memory flips crafted for emotional surprise moments.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3.5 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#bcf6f0]/60 border border-[#bcf6f0] flex items-center justify-center text-[#0f766e]">
                  <Globe size={22} />
                </div>
                <h3 className="font-bold text-lg text-[#1e1b2e]">Instant Shareable Links</h3>
                <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
                  Get your unique link like <code className="text-[#0f766e] font-mono font-bold bg-[#bcf6f0]/30 px-1.5 py-0.5 rounded">wishelier.in/s/name</code> and surprise them on WhatsApp or Instagram at midnight.
                </p>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-[#e6cb9c]/50 shadow-sm space-y-3.5 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#e6cb9c]/50 border border-[#e6cb9c] flex items-center justify-center text-[#92400e]">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-bold text-lg text-[#1e1b2e]">Instant 100% Free Publishing</h3>
                <p className="text-xs sm:text-sm text-[#4a4458] leading-relaxed">
                  Publish instantly with 1-click free activation as part of our limited time celebration offer. Zero payment or credit card required.
                </p>
              </div>
            </div>

            {/* Comparison Table: Wishelier vs Paper Cards vs Generic Card Builders */}
            <div className="rounded-3xl bg-white border border-[#e6cb9c]/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold text-[#0f766e] uppercase tracking-wider">Direct Comparison</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1e1b2e]">Why Wishelier is the #1 Birthday Surprise Choice</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#e6cb9c]/40 text-[#4a4458]/80 font-bold">
                      <th className="py-3 px-4">Feature</th>
                      <th className="py-3 px-4 text-[#0f766e] bg-[#bcf6f0]/30 rounded-t-xl font-extrabold">Wishelier 3D Generator</th>
                      <th className="py-3 px-4">Paper Birthday Cards</th>
                      <th className="py-3 px-4">Generic e-Cards (Canva/GIFs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6cb9c]/20">
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-[#1e1b2e]">Interactive 3D Candle Blowing</td>
                      <td className="py-3.5 px-4 bg-[#bcf6f0]/20 font-bold text-[#0f766e]">✅ Yes (Physics 3D)</td>
                      <td className="py-3.5 px-4 text-gray-400">❌ No</td>
                      <td className="py-3.5 px-4 text-gray-400">❌ No</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-[#1e1b2e]">Custom Background Music & Songs</td>
                      <td className="py-3.5 px-4 bg-[#bcf6f0]/20 font-bold text-[#0f766e]">✅ Yes (Audio Player)</td>
                      <td className="py-3.5 px-4 text-gray-400">❌ No</td>
                      <td className="py-3.5 px-4 text-gray-400">❌ Rare</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-[#1e1b2e]">Polaroid Photo Grids & Flip Cards</td>
                      <td className="py-3.5 px-4 bg-[#bcf6f0]/20 font-bold text-[#0f766e]">✅ Up to 10+ Memories</td>
                      <td className="py-3.5 px-4 text-gray-400">1 printed photo</td>
                      <td className="py-3.5 px-4 text-gray-400">Static image only</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-[#1e1b2e]">Custom Shareable URL Link</td>
                      <td className="py-3.5 px-4 bg-[#bcf6f0]/20 font-bold text-[#0f766e]">✅ wishelier.in/s/name</td>
                      <td className="py-3.5 px-4 text-gray-400">❌ Physical only</td>
                      <td className="py-3.5 px-4 text-gray-400">Generic long link</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-[#1e1b2e]">Price</td>
                      <td className="py-3.5 px-4 bg-[#bcf6f0]/20 font-extrabold text-[#0f766e]">✅ 100% FREE (Limited Time Offer)</td>
                      <td className="py-3.5 px-4 text-gray-600">₹200 - ₹500</td>
                      <td className="py-3.5 px-4 text-gray-600">₹499+/month</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold text-[#92400e] uppercase tracking-wider">Fast & Easy</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1e1b2e]">Create Your Birthday Surprise in 3 Steps</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-[#e6cb9c]/40 text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-[#d97706] text-white font-bold flex items-center justify-center mx-auto text-sm">
                    1
                  </div>
                  <h4 className="font-bold text-base text-[#1e1b2e]">Select a 3D Template</h4>
                  <p className="text-xs text-[#4a4458] leading-relaxed">
                    Pick from Starlit Celebration, Pink Romance, or Blush Elegance based on your relationship.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#e6cb9c]/40 text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-[#0f766e] text-white font-bold flex items-center justify-center mx-auto text-sm">
                    2
                  </div>
                  <h4 className="font-bold text-base text-[#1e1b2e]">Add Memories & Note</h4>
                  <p className="text-xs text-[#4a4458] leading-relaxed">
                    Type your personal message, upload your favorite photos, pick reasons, and choose background music.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#e6cb9c]/40 text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-[#c026d3] text-white font-bold flex items-center justify-center mx-auto text-sm">
                    3
                  </div>
                  <h4 className="font-bold text-base text-[#1e1b2e]">Publish & Share Link</h4>
                  <p className="text-xs text-[#4a4458] leading-relaxed">
                    Activate the limited-time free offer instantly and share your custom link via WhatsApp or Instagram at midnight!
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="space-y-6 pt-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1e1b2e] flex items-center justify-center gap-2">
                  <HelpCircle size={22} className="text-[#0f766e]" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <p className="text-xs text-[#4a4458]/70">
                  Everything you need to know about creating personalized 3D birthday websites on Wishelier.
                </p>
              </div>

              <div className="space-y-3.5 max-w-3xl mx-auto">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={faq.q}
                      className="rounded-2xl bg-white border border-[#e6cb9c]/50 overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#1e1b2e] hover:text-[#0f766e] transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={18}
                          className={`text-[#4a4458]/60 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#0f766e]" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-[#4a4458] leading-relaxed border-t border-[#e6cb9c]/30 pt-3.5">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keyword Links for SEO & AI Retrieval */}
            <div className="pt-6 border-t border-[#e6cb9c]/40 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#92400e]">
                Explore Popular Birthday Surprise Categories
              </h4>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/create/starlit-celebration"
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#e6cb9c]/30 border border-[#e6cb9c]/70 text-xs font-semibold text-[#1e1b2e] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Gift size={12} className="text-[#d97706]" /> Birthday Website Generator
                </Link>
                <Link
                  href="/create/pink-romance"
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#ebcae8]/40 border border-[#ebcae8] text-xs font-semibold text-[#1e1b2e] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Heart size={12} className="text-[#c026d3]" /> Birthday Surprise for Girlfriend
                </Link>
                <Link
                  href="/create/blush-elegance"
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#bcf6f0]/40 border border-[#bcf6f0] text-xs font-semibold text-[#1e1b2e] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles size={12} className="text-[#0f766e]" /> Birthday Website for Boyfriend
                </Link>
                <Link
                  href="/about"
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1e1b2e] transition-all shadow-xs"
                >
                  About Wishelier
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1e1b2e] transition-all shadow-xs"
                >
                  My Projects Dashboard
                </Link>
                <Link
                  href="/contact"
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-[#1e1b2e] transition-all shadow-xs"
                >
                  Support & Help
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e6cb9c]/40 bg-white px-6 py-8 text-xs text-[#4a4458]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Wishelier Logo" width={22} height={22} className="rounded object-contain" />
            <span className="font-bold text-[#1e1b2e]">Wishelier</span>
            <span>© {new Date().getFullYear()} Wishelier Studio. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium">
            <Link href="/about" className="hover:text-[#0f766e] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-[#0f766e] transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-[#0f766e] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#0f766e] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund" className="hover:text-[#0f766e] transition-colors">
              Cancellation & Refund
            </Link>
            <a
              href="https://www.instagram.com/wishelier/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#c026d3] hover:opacity-80 font-bold transition-opacity"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@wishelier</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
