"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Crown } from "lucide-react";
import Link from "next/link";

const TEMPLATES = [
  {
    slug: "starlit-celebration",
    name: "Starlit Celebration",
    category: "Premium Animated",
    description: "Golden particles, interactive cake, photo gallery with lightbox",
    gradient: "from-amber-600/20 via-yellow-500/10 to-amber-800/20",
    accent: "#d4af37",
    icon: Sparkles,
    features: ["Particle Background", "Candle Blowing", "Photo Lightbox", "Background Music"],
  },
  {
    slug: "pink-romance",
    name: "Pink Romance",
    category: "Romantic",
    description: "Typing effects, floating emojis, progressive card reveals, sparkle memories",
    gradient: "from-pink-600/20 via-rose-500/10 to-pink-800/20",
    accent: "#ff69b4",
    icon: Heart,
    features: ["Typing Animation", "Floating Emojis", "Card Reveals", "Memory Sparkles"],
  },
  {
    slug: "blush-elegance",
    name: "Blush Elegance",
    category: "Luxury",
    description: "Countdown timer, polaroid masonry, flip cards, envelope letter, 3D cake",
    gradient: "from-purple-600/20 via-violet-500/10 to-purple-800/20",
    accent: "#c9b1d0",
    icon: Crown,
    features: ["Countdown Timer", "Flip Cards (100+)", "Envelope Animation", "Night Mode Cake"],
  },
];

export default function TemplatePreviews() {
  return (
    <section id="templates" className="relative py-24 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0a14] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Template
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Three hand-crafted designs, each with stunning animations and
            interactive elements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATES.map((template, i) => (
            <motion.div
              key={template.slug}
              className="group relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              {/* Card */}
              <div
                className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm h-full flex flex-col transition-all duration-300 group-hover:border-white/10 group-hover:bg-white/[0.04]"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at center, ${template.accent}10, transparent 70%)`,
                  }}
                />

                {/* Category badge */}
                <div className="relative flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${template.accent}20` }}
                  >
                    <template.icon size={16} style={{ color: template.accent }} />
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-widest font-medium"
                    style={{ color: template.accent }}
                  >
                    {template.category}
                  </span>
                </div>

                {/* Preview area */}
                <div
                  className={`relative h-48 rounded-xl bg-gradient-to-br ${template.gradient} mb-5 flex items-center justify-center overflow-hidden`}
                >
                  <motion.div
                    className="text-6xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🎂
                  </motion.div>
                  {/* Animated particles in preview */}
                  {[1, 2, 3, 4, 5].map((j) => (
                    <motion.div
                      key={j}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ backgroundColor: template.accent }}
                      initial={{
                        x: Math.random() * 200 - 100,
                        y: Math.random() * 150 - 75,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: 2 + j * 0.5,
                        repeat: Infinity,
                        delay: j * 0.3,
                      }}
                    />
                  ))}
                </div>

                {/* Info */}
                <h3 className="relative text-xl font-semibold text-white mb-2">
                  {template.name}
                </h3>
                <p className="relative text-sm text-white/40 mb-4 flex-1">
                  {template.description}
                </p>

                {/* Feature tags */}
                <div className="relative flex flex-wrap gap-1.5 mb-5">
                  {template.features.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40 border border-white/5"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link href={`/create/${template.slug}`}>
                  <motion.button
                    className="relative w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      backgroundColor: `${template.accent}15`,
                      color: template.accent,
                      border: `1px solid ${template.accent}30`,
                    }}
                    whileHover={{
                      backgroundColor: `${template.accent}25`,
                      boxShadow: `0 0 20px ${template.accent}20`,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Use This Template <ArrowRight size={14} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
