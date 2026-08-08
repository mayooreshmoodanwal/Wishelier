"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star, Heart, Gift } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number; color: string }>
  >([]);

  useEffect(() => {
    const colors = ["#f472b6", "#a78bfa", "#fbbf24", "#34d399", "#60a5fa"];
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        color: colors[i % colors.length],
      }))
    );
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a1a] to-[#0a0a0f]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-500/10 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[150px]" />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            animate={{ y: [-15, 15], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs tracking-wider uppercase mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles size={12} className="text-amber-400" />
          <span className="text-white/60">Launch Offer — ₹99 only</span>
          <Star size={12} className="text-amber-400" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-white">Create </span>
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Beautiful
          </span>
          <br />
          <span className="text-white">Birthday </span>
          <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
            Surprises
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Pick a stunning template, add photos & messages, and share a unique animated website —
          all in under 5 minutes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="#templates">
            <motion.button
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold text-lg flex items-center gap-2 shadow-lg shadow-pink-500/25"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(244,114,182,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Templates
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </motion.button>
          </Link>
          <Link href="#how-it-works">
            <motion.button
              className="px-8 py-4 rounded-full border border-white/10 text-white/70 font-medium text-lg hover:bg-white/5 hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              How It Works
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-16 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { icon: Heart, label: "Premium Templates", value: "3+" },
            { icon: Gift, label: "Sites Created", value: "Launch!" },
            { icon: Star, label: "Hosted for 1 Year", value: "Free" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 text-white/40">
              <stat.icon size={14} className="text-pink-400/60" />
              <span>
                <strong className="text-white/70">{stat.value}</strong> {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-white/40"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
