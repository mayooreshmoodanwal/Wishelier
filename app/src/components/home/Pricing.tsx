"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  "Premium animated template",
  "Custom photos & messages",
  "Background music (library or upload)",
  "Custom slug (yourname.wishelier.in)",
  "1 year free hosting",
  "Share via WhatsApp, social media",
  "QR code for sharing",
  "Mobile-optimized design",
  "Instant site generation",
];

export default function Pricing() {
  return (
    <section className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#100a14] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple{" "}
            <span className="bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-white/40 text-lg mb-12">
            One price. Everything included.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Glow border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/20 via-violet-500/20 to-amber-500/20 p-px">
            <div className="w-full h-full rounded-3xl bg-[#0e0a14]" />
          </div>

          <div className="relative p-8 md:p-10">
            {/* Launch offer badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/20 text-xs tracking-wider uppercase mb-6"
              animate={{ boxShadow: ["0 0 15px rgba(244,114,182,0.1)", "0 0 30px rgba(244,114,182,0.2)", "0 0 15px rgba(244,114,182,0.1)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={12} className="text-pink-400" />
              <span className="text-pink-300">Launch Offer</span>
            </motion.div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-2xl text-white/30 line-through">₹399</span>
                <span className="text-6xl font-bold text-white">₹99</span>
              </div>
              <p className="text-sm text-white/30">one-time payment • no subscriptions</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8 text-left">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-emerald-400" />
                  </div>
                  <span className="text-sm text-white/60">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link href="#templates">
              <motion.button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(244,114,182,0.25)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started <ArrowRight size={18} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
