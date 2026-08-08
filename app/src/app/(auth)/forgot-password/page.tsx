"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = "email" | "otp" | "password" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always move to OTP step (security: don't reveal if email exists)
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Reset failed");
        return;
      }
      setStep("done");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-pink-500/5" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-500/8 rounded-full blur-[100px]" />

      <motion.div className="relative z-10 w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles size={20} className="text-pink-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">Wishelier</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4 mb-1">Reset Password</h1>
          <p className="text-sm text-white/40">We&apos;ll send a code to your email</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.form key="email" onSubmit={handleEmailSubmit} className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all" />
                  </div>
                </div>
                <motion.button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50" whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}>
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Sending..." : "Send Reset Code"}
                </motion.button>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form key="reset" onSubmit={handleResetSubmit} className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center text-sm text-white/50 mb-2">
                  Code sent to <span className="text-white">{email}</span>
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Reset Code</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" maxLength={6} required autoFocus
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl font-bold tracking-[0.4em] placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all" />
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" minLength={8} required
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                <motion.button type="submit" disabled={loading || otp.length < 6 || newPassword.length < 8} className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50" whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}>
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Resetting..." : "Reset Password"}
                </motion.button>
                <button type="button" onClick={() => setStep("email")} className="w-full text-xs text-white/30 hover:text-white/50 transition-colors flex items-center justify-center gap-1">
                  <ArrowLeft size={12} /> Change email
                </button>
              </motion.form>
            )}

            {step === "done" && (
              <motion.div key="done" className="text-center py-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Password Reset!</h3>
                <p className="text-sm text-white/50 mb-6">You can now sign in with your new password.</p>
                <Link href="/login">
                  <motion.button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Go to Login
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== "done" && (
            <p className="text-center text-sm text-white/40 mt-5">
              Remember it?{" "}
              <Link href="/login" className="text-pink-400 hover:text-pink-300 transition-colors font-medium">Sign in</Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
