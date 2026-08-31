"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
        <label className="text-xs text-[#4a4458] font-bold uppercase tracking-wider mb-1.5 block">
          Email Address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e6cb9c]/70 rounded-xl text-[#1e1b2e] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] font-medium"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-[#4a4458] font-bold uppercase tracking-wider">Password</label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#0f766e] hover:underline"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e6cb9c]/70 rounded-xl text-[#1e1b2e] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] font-medium"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.p
          className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2"
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
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        {loading ? "Signing in..." : "Sign In to Wishelier"}
      </motion.button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="Wishelier" width={32} height={32} className="rounded-lg object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#d97706] via-[#c026d3] to-[#0f766e] bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#1e1b2e] mt-4 mb-1">Welcome back</h1>
          <p className="text-xs text-[#4a4458]">Sign in to manage your birthday websites</p>
        </div>

        {/* Form wrapped in Suspense */}
        <div className="bg-white border border-[#e6cb9c]/60 rounded-3xl p-6 shadow-xl">
          <Suspense fallback={<div className="py-8 text-center text-gray-400 text-xs">Loading...</div>}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-xs text-[#4a4458] mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#0f766e] font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
