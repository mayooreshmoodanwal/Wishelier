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
  const sessionFromUrl = searchParams.get("session");

  const [status, setStatus] = useState<"loading" | "redirecting" | "polling" | "success" | "failed">("loading");
  const [activeSession, setActiveSession] = useState<string | null>(sessionFromUrl);
  const [errorMessage, setErrorMessage] = useState("");

  const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
  const cashfreeHostedUrl = activeSession
    ? `${cashfreeEnv === "production" ? "https://api.cashfree.com/pg/orders/pay" : "https://sandbox.cashfree.com/pg/orders/pay"}/${activeSession}`
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

    // Helper to start polling payment status
    const pollStatus = (targetOrderId?: string) => {
      setStatus("polling");
      const url = targetOrderId
        ? `/api/payments/${projectId}/status?order_id=${encodeURIComponent(targetOrderId)}`
        : `/api/payments/${projectId}/status`;

      interval = setInterval(async () => {
        try {
          const res = await fetch(url);
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
      }, 2500);

      timeout = setTimeout(() => {
        clearInterval(interval);
        if (status === "polling") {
          setStatus("failed");
          setErrorMessage("Payment status check timed out. Please check your dashboard.");
        }
      }, 30000);
    };

    // Helper to launch Cashfree SDK / Payment page
    const triggerCashfreeCheckout = (paymentSession: string) => {
      setStatus("redirecting");
      loadCashfreeScript().then((loaded) => {
        if (loaded && window.Cashfree) {
          try {
            const cashfree = window.Cashfree({ mode: cashfreeEnv });
            cashfree.checkout({
              paymentSessionId: paymentSession,
              redirectTarget: "_self",
            });
            return;
          } catch (err) {
            console.error("Cashfree SDK error, falling back to hosted page:", err);
          }
        }
        const fallbackUrl = `${cashfreeEnv === "production" ? "https://api.cashfree.com/pg/orders/pay" : "https://sandbox.cashfree.com/pg/orders/pay"}/${paymentSession}`;
        window.location.href = fallbackUrl;
      });
    };

    if (orderId) {
      pollStatus(orderId);
    } else if (sessionFromUrl) {
      triggerCashfreeCheckout(sessionFromUrl);
    } else {
      setStatus("loading");
      fetch(`/api/payments/${projectId}/status`)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.data?.status === "success") {
            setStatus("success");
          } else if (data.data?.status === "created" && data.data?.paymentSessionId) {
            setActiveSession(data.data.paymentSessionId);
            triggerCashfreeCheckout(data.data.paymentSessionId);
          } else {
            const orderRes = await fetch("/api/payments/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ projectId }),
            });
            const orderData = await orderRes.json();
            if (orderRes.ok && orderData.data?.paymentSessionId) {
              setActiveSession(orderData.data.paymentSessionId);
              triggerCashfreeCheckout(orderData.data.paymentSessionId);
            } else {
              setStatus("failed");
              setErrorMessage(orderData.error?.message || "Failed to initialize payment session.");
            }
          }
        })
        .catch((err) => {
          console.error("Error loading project checkout status:", err);
          setStatus("failed");
          setErrorMessage("Network error initializing checkout.");
        });
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [orderId, sessionFromUrl, projectId, cashfreeEnv]);

  return (
    <>
      {status === "loading" && (
        <div className="py-8">
          <Loader2 size={40} className="animate-spin text-[#0f766e] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1e1b2e] mb-2">Preparing Checkout</h2>
          <p className="text-xs sm:text-sm text-[#4a4458]">Setting up secure Cashfree payment...</p>
        </div>
      )}

      {status === "redirecting" && (
        <div className="py-8">
          <ShieldCheck size={48} className="text-[#0f766e] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1e1b2e] mb-2">Redirecting to Cashfree</h2>
          <p className="text-xs sm:text-sm text-[#4a4458] mb-6">Opening payment window for ₹99...</p>
          <Loader2 size={24} className="animate-spin text-[#d97706] mx-auto mb-6" />

          {cashfreeHostedUrl && (
            <a
              href={cashfreeHostedUrl}
              className="inline-flex items-center gap-1.5 text-xs text-[#0f766e] font-bold underline"
            >
              <span>Click here if payment page doesn&apos;t open automatically</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {status === "polling" && (
        <div className="py-8">
          <div className="w-12 h-12 rounded-full border-3 border-[#bcf6f0] border-t-[#0f766e] animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1e1b2e] mb-2">Verifying Payment</h2>
          <p className="text-xs sm:text-sm text-[#4a4458] mb-4">
            We are confirming your payment with Cashfree...
          </p>
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-gray-100 text-[#4a4458]/80 font-medium">
            Please do not close this window
          </span>
        </div>
      )}

      {status === "success" && (
        <div className="py-8">
          <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-[#1e1b2e] mb-2">Payment Confirmed! 🎉</h2>
          <p className="text-xs sm:text-sm text-[#4a4458] mb-8">
            Your custom birthday website is active and ready to share!
          </p>

          <Link href="/dashboard">
            <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer">
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="py-8">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1e1b2e] mb-2">Payment Status Check</h2>
          <p className="text-xs sm:text-sm text-[#4a4458] mb-6">{errorMessage || "Payment could not be confirmed."}</p>

          <div className="space-y-3">
            {cashfreeHostedUrl ? (
              <a href={cashfreeHostedUrl} className="block w-full">
                <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-sm shadow-md cursor-pointer">
                  Complete Payment on Cashfree
                </button>
              </a>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-sm shadow-md cursor-pointer"
              >
                Retry Payment
              </button>
            )}
            <Link href="/dashboard" className="block w-full">
              <button className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#1e1b2e] font-semibold text-sm cursor-pointer">
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
    <div className="min-h-screen bg-[#faf7f2] text-[#1e1b2e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-3xl bg-white border border-[#e6cb9c]/60 p-8 shadow-xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d97706] via-[#c026d3] to-[#0f766e]" />
        <Suspense fallback={<div className="py-8 text-center text-[#4a4458]/70 text-xs">Loading checkout...</div>}>
          <CheckoutContent projectId={projectId} />
        </Suspense>
      </motion.div>
    </div>
  );
}
