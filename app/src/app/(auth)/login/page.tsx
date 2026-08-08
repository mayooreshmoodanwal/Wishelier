"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error?.message || "Invalid email or password");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">
          Email
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40 transition-all"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-white/50 uppercase tracking-wider">Password</label>
          <Link
            href="/forgot-password"
            className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.p
          className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        {loading ? "Signing in..." : "Sign In"}
      </motion.button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-violet-500/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]" />

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles size={20} className="text-pink-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4 mb-1">Welcome back</h1>
          <p className="text-sm text-white/40">Sign in to your account</p>
        </div>

        {/* Form wrapped in Suspense */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <Suspense fallback={<div className="py-8 text-center text-white/40 text-sm">Loading...</div>}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-white/40 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-pink-400 hover:text-pink-300 transition-colors font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
