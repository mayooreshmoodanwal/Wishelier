"use client";

import React from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-1">
              Wishelier
            </h3>
            <p className="text-sm text-white/30">
              Beautiful birthday surprise websites
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="/terms" className="hover:text-white/60 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link href="/support" className="hover:text-white/60 transition-colors">
              Support
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-white/20 flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-pink-400" fill="currentColor" /> in India
            © {new Date().getFullYear()} Wishelier
          </p>
        </div>
      </div>
    </footer>
  );
}
