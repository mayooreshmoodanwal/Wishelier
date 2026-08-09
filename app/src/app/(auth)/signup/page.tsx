"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = "email" | "otp" | "password";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [signupToken, setSignupToken] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExistingAccount, setIsExistingAccount] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsExistingAccount(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error?.message || "Failed to send OTP";
        setError(msg);
        if (res.status === 409 || data.error?.code === "ACCOUNT_EXISTS") {
          setIsExistingAccount(true);
        } else {
          setIsExistingAccount(false);
        }
        return;
      }
      setStep("otp");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, purpose: "signup" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Invalid OTP");
        return;
      }
      setSignupToken(data.data.signupToken);
      setStep("password");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupToken, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Account creation failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Email", "Verify", "Password"];
  const currentStepIdx = step === "email" ? 0 : step === "otp" ? 1 : 2;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles size={20} className="text-pink-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-3 mb-1">Create your account</h1>
          <p className="text-xs sm:text-sm text-white/40">Start creating birthday surprises</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < currentStepIdx
                      ? "bg-emerald-500 text-white"
                      : i === currentStepIdx
                      ? "bg-pink-500 text-white"
                      : "bg-white/10 text-white/30"
                  }`}
                >
                  {i < currentStepIdx ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-xs ${i === currentStepIdx ? "text-white/70 font-medium" : "text-white/30"}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px max-w-[30px] sm:max-w-[40px] ${i < currentStepIdx ? "bg-emerald-500/50" : "bg-white/10"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {/* STEP 1: Email */}
            {step === "email" && (
              <motion.form
                key="email"
                onSubmit={handleEmailSubmit}
                className="space-y-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                        setIsExistingAccount(false);
                      }}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40 transition-all"
                    />
                  </div>
                  <p className="text-xs text-white/30 mt-1.5">We&apos;ll send a verification code</p>
                </div>

                {error && (
                  <div className="text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                    {isExistingAccount && (
                      <Link
                        href={`/login?email=${encodeURIComponent(email)}`}
                        className="inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-semibold underline underline-offset-4 pt-1"
                      >
                        <span>Click here to Log In instead</span>
                        <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Sending code..." : "Send Verification Code"}
                </motion.button>
              </motion.form>
            )}

            {/* STEP 2: OTP */}
            {step === "otp" && (
              <motion.form
                key="otp"
                onSubmit={handleOtpSubmit}
                className="space-y-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="text-center mb-2">
                  <p className="text-sm text-white/50">Code sent to</p>
                  <p className="text-sm text-white font-medium truncate max-w-[240px] mx-auto">{email}</p>
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    required
                    maxLength={6}
                    autoFocus
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl sm:text-2xl font-bold tracking-[0.4em] placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40 transition-all"
                  />
                  <p className="text-xs text-white/30 mt-1.5 text-center">Check your inbox (expires in 10 minutes)</p>
                </div>
                {error && <p className="text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>}
                <motion.button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Verifying..." : "Verify Code"}
                </motion.button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOtp("");
                      setError("");
                      handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent);
                    }}
                    disabled={loading}
                    className="text-xs text-pink-400 hover:text-pink-300 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                  >
                    Resend Code
                  </button>
                  <button type="button" onClick={() => setStep("email")} className="text-xs text-white/30 hover:text-white/50 transition-colors cursor-pointer">
                    ← Change email
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: Password */}
            {step === "password" && (
              <motion.form
                key="password"
                onSubmit={handlePasswordSubmit}
                className="space-y-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="text-center mb-2">
                  <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-white/50">Email verified! Set your password.</p>
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      minLength={8}
                      autoFocus
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${password.length > i * 2 ? i < 2 ? "bg-red-500" : i < 3 ? "bg-amber-500" : "bg-emerald-500" : "bg-white/10"}`} />
                    ))}
                  </div>
                </div>
                {error && <p className="text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>}
                <motion.button
                  type="submit"
                  disabled={loading || password.length < 8}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Creating account..." : "Create Account 🎉"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-xs sm:text-sm text-white/40 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-400 hover:text-pink-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
