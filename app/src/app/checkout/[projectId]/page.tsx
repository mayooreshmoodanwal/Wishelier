"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Cashfree: any;
  }
}

interface CheckoutContentProps {
  projectId: string;
}

function CheckoutContent({ projectId }: CheckoutContentProps) {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");
  const session = searchParams.get("session");

  const [status, setStatus] = useState<"loading" | "redirecting" | "polling" | "success" | "failed">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
  const cashfreeHostedUrl = session
    ? `${cashfreeEnv === "production" ? "https://api.cashfree.com/pg/orders/pay" : "https://sandbox.cashfree.com/pg/orders/pay"}/${session}`
    : "";

  // Load Cashfree Web SDK script dynamically
  const loadCashfreeScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (orderId) {
      // User returned from Cashfree checkout, start polling webhook status
      setStatus("polling");
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/payments/${projectId}/status?order_id=${encodeURIComponent(orderId)}`);
          const data = await res.json();
          if (res.ok && data.data?.status === "success") {
            setStatus("success");
            clearInterval(interval);
          } else if (data.data?.status === "failed") {
            setStatus("failed");
            setErrorMessage("Payment was not completed");
            clearInterval(interval);
          }
        } catch {
          // Keep polling
        }
      }, 3000);

      timeout = setTimeout(() => {
        clearInterval(interval);
        if (status === "polling") {
          setStatus("failed");
          setErrorMessage("Payment status check timed out. Please check your dashboard or email.");
        }
      }, 30000);
    } else if (session) {
      // Initial session created — launch Cashfree Payment Gateway Checkout
      setStatus("redirecting");
      loadCashfreeScript().then((loaded) => {
        if (loaded && window.Cashfree) {
          try {
            const cashfree = window.Cashfree({ mode: cashfreeEnv });
            cashfree.checkout({
              paymentSessionId: session,
              redirectTarget: "_self",
            });
            return;
          } catch (err) {
            console.error("Cashfree SDK error, redirecting to hosted checkout:", err);
          }
        }
        // Direct fallback to Cashfree Hosted Payment Page
        if (cashfreeHostedUrl) {
          window.location.href = cashfreeHostedUrl;
        }
      });
    } else {
      setStatus("loading");
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [orderId, session, projectId, cashfreeEnv, cashfreeHostedUrl]);

  return (
    <>
      {status === "loading" && (
        <div className="py-8">
          <Loader2 size={40} className="animate-spin text-pink-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Preparing Checkout</h2>
          <p className="text-sm text-white/50">Setting up secure Cashfree payment...</p>
        </div>
      )}

      {status === "redirecting" && (
        <div className="py-8">
          <ShieldCheck size={48} className="text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Redirecting to Cashfree Gateway</h2>
          <p className="text-sm text-white/50 mb-6">Opening payment window for ₹99...</p>
          <Loader2 size={24} className="animate-spin text-purple-400 mx-auto mb-6" />

          {cashfreeHostedUrl && (
            <a
              href={cashfreeHostedUrl}
              className="inline-flex items-center gap-2 text-xs text-pink-400 hover:text-pink-300 font-medium underline underline-offset-4"
            >
              <span>Click here if payment page doesn&apos;t open automatically</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {status === "polling" && (
        <div className="py-8">
          <div className="w-12 h-12 rounded-full border-2 border-pink-500/20 border-t-pink-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Verifying Payment</h2>
          <p className="text-sm text-white/50 mb-4">
            We are waiting for Cashfree payment confirmation...
          </p>
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/5 text-white/40">
            Please do not close this window
          </span>
        </div>
      )}

      {status === "success" && (
        <div className="py-8">
          <CheckCircle2 size={56} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Payment Confirmed! 🎉</h2>
          <p className="text-sm text-white/60 mb-8">
            Your birthday surprise site is active and ready to share.
          </p>

          <Link href="/dashboard">
            <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-sm flex items-center justify-center gap-2">
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="py-8">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Payment Pending / Unconfirmed</h2>
          <p className="text-sm text-white/50 mb-6">{errorMessage || "Payment could not be completed."}</p>

          <div className="space-y-3">
            {cashfreeHostedUrl && (
              <a href={cashfreeHostedUrl} className="block w-full">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm">
                  Retry Payment on Cashfree
                </button>
              </a>
            )}
            <Link href="/dashboard" className="block w-full">
              <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function CheckoutPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-3xl bg-white/[0.03] border border-white/10 p-8 backdrop-blur-xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500" />
        <Suspense fallback={<div className="py-8 text-center text-white/40 text-sm">Loading checkout...</div>}>
          <CheckoutContent projectId={projectId} />
        </Suspense>
      </motion.div>
    </div>
  );
}
