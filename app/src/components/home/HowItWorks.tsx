"use client";

import React from "react";
import { motion } from "framer-motion";
import { Palette, Upload, CreditCard, Share2 } from "lucide-react";

const STEPS = [
  {
    icon: Palette,
    title: "Pick a Template",
    description: "Browse our stunning collection of birthday templates. Each one is uniquely animated and interactive.",
    color: "#f472b6",
  },
  {
    icon: Upload,
    title: "Add Your Content",
    description: "Upload photos, write heartfelt messages, choose background music. Our smart form adapts to each template.",
    color: "#a78bfa",
  },
  {
    icon: CreditCard,
    title: "Preview & Pay",
    description: "See a live preview of your creation. Pay ₹99 (launch offer!) and we generate your unique site instantly.",
    color: "#fbbf24",
  },
  {
    icon: Share2,
    title: "Share the Love",
    description: "Get a unique wishelier.in link and QR code. Share via WhatsApp, Instagram, or anywhere — it's hosted for 1 full year!",
    color: "#34d399",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0d12] to-[#0a0a0f]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-white/40 text-lg">
            Four simple steps to create magic
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 h-full transition-all group-hover:border-white/10 group-hover:bg-white/[0.04]">
                {/* Step number */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-sm font-bold"
                  style={{ backgroundColor: `${step.color}15`, color: step.color }}
                >
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="mb-3">
                  <step.icon size={24} style={{ color: step.color }} />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line (desktop) */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-white/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
