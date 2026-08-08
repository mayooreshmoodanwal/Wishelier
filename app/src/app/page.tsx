"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown, Check, Star } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ProfileDrawer from "@/components/profile/ProfileDrawer";

// Theme JSONs
import starlitTheme from "@/template-engine/themes/starlit-celebration.json";
import pinkTheme from "@/template-engine/themes/pink-romance.json";
import blushTheme from "@/template-engine/themes/blush-elegance.json";
import type { TemplateTheme } from "@/types";

// Dynamic imports for the 3 template renderers
const ElegantSinglePageRenderer = dynamic(
  () => import("@/template-engine/renderers/elegant-single-page"),
  { ssr: false }
);
const RomanticMultiPageRenderer = dynamic(
  () => import("@/template-engine/renderers/romantic-multi-page"),
  { ssr: false }
);
const LuxeMultiPageRenderer = dynamic(
  () => import("@/template-engine/renderers/luxe-multi-page"),
  { ssr: false }
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
        "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUycmJieHBuNjN3bDk3OGg1ZG9za203aDlrMjV1cDJvb24wNTV4bTg2cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lMameLIF8voLu8HxWV/giphy.gif",
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

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">
      {/* Floating Control Bar Overlay */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-pink-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Wishelier
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
              Live Preview
            </span>
          </div>

          {/* Template Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-medium transition-all"
            >
              <span className="text-white/60 text-xs hidden md:inline">Template:</span>
              <span className="text-white font-semibold">{activeTemplate.name}</span>
              <ChevronDown
                size={16}
                className={`text-white/60 transition-transform duration-200 ${
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
                  className="absolute left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 mt-2 w-72 p-2 rounded-2xl bg-[#120e1a]/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 px-3 py-1.5">
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
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-white"
                              : "hover:bg-white/5 text-white/70 hover:text-white border border-transparent"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-sm flex items-center gap-2">
                              {tmpl.name}
                              {isSelected && <Check size={14} className="text-pink-400" />}
                            </div>
                            <div className="text-xs text-white/40 mt-0.5">{tmpl.category}</div>
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

          {/* Pricing & CTA & Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
              <Star size={12} className="fill-amber-300" />
              <span>₹99 Launch Offer (was ₹399)</span>
            </div>

            <Link href={`/create/${selectedSlug}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/20 flex items-center gap-2"
              >
                <span>Use Template</span>
                <ArrowRight size={16} />
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
      </main>
    </div>
  );
}
