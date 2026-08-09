"use client";

import React from "react";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-white/10 bg-black/40 text-xs text-white/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-pink-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Wishelier
              </span>
            </Link>
            <p className="text-xs text-white/40">
              Create & share personalized animated birthday websites.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
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

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-[11px]">
          <p className="flex items-center gap-1">
            Made with <Heart size={10} className="text-pink-400 fill-pink-400" /> in India © {new Date().getFullYear()} Wishelier. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
