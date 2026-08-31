"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4 py-8">
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
          <h1 className="text-2xl font-extrabold text-[#1e1b2e] mt-3 mb-1">Create your account</h1>
          <p className="text-xs text-[#4a4458]">Start creating custom birthday surprise websites</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < currentStepIdx
                      ? "bg-[#0f766e] text-white"
                      : i === currentStepIdx
                      ? "bg-[#d97706] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < currentStepIdx ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-bold ${i === currentStepIdx ? "text-[#1e1b2e]" : "text-gray-400"}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 max-w-[30px] sm:max-w-[40px] ${i < currentStepIdx ? "bg-[#0f766e]" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white border border-[#e6cb9c]/60 rounded-3xl p-6 shadow-xl overflow-hidden">
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
                  <label className="text-xs text-[#4a4458] font-bold uppercase tracking-wider mb-1.5 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
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
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e6cb9c]/70 rounded-xl text-[#1e1b2e] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-[#4a4458]/70 mt-1.5">We&apos;ll send a verification OTP</p>
                </div>

                {error && (
                  <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                    {isExistingAccount && (
                      <Link
                        href={`/login?email=${encodeURIComponent(email)}`}
                        className="inline-flex items-center gap-1 text-xs text-[#0f766e] font-bold underline underline-offset-4 pt-1"
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
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                  <p className="text-xs text-[#4a4458]">Code sent to</p>
                  <p className="text-xs font-bold text-[#1e1b2e] truncate max-w-[240px] mx-auto">{email}</p>
                </div>
                <div>
                  <label className="text-xs text-[#4a4458] font-bold uppercase tracking-wider mb-1.5 block">
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
                    className="w-full px-4 py-2.5 bg-white border border-[#e6cb9c]/70 rounded-xl text-[#1e1b2e] text-center text-xl font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#e6cb9c]"
                  />
                  <p className="text-[11px] text-[#4a4458]/70 mt-1.5 text-center">Check your inbox (valid for 10 minutes)</p>
                </div>
                {error && <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
                <motion.button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                    className="text-xs text-[#0f766e] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer font-medium"
                  >
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
                  <CheckCircle2 size={32} className="text-[#0f766e] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#4a4458]">Email verified! Set your password.</p>
                </div>
                <div>
                  <label className="text-xs text-[#4a4458] font-bold uppercase tracking-wider mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      minLength={8}
                      autoFocus
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e6cb9c]/70 rounded-xl text-[#1e1b2e] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e6cb9c] font-medium"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${password.length > i * 2 ? i < 2 ? "bg-red-500" : i < 3 ? "bg-amber-500" : "bg-emerald-500" : "bg-gray-200"}`} />
                    ))}
                  </div>
                </div>
                {error && <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
                <motion.button
                  type="submit"
                  disabled={loading || password.length < 8}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Creating account..." : "Complete & Open Studio 🎉"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-[#4a4458] mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0f766e] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
