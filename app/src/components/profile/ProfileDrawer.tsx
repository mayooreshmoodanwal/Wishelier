"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Globe,
  CreditCard,
  LogOut,
  ExternalLink,
  Edit,
  CheckCircle,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfileData {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  } | null;
  projects: Array<{
    id: string;
    slug: string;
    status: string;
    data: Record<string, unknown>;
    templateName: string;
    templateSlug: string;
    templateCategory: string;
    createdAt: string;
  }>;
  transactions: Array<{
    id: string;
    orderId: string;
    amount: string;
    currency: string;
    status: string;
    createdAt: string;
    projectId: string;
  }>;
}

export default function ProfileDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"websites" | "transactions">("websites");
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok) {
        setProfileData(data.data);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setProfileData({ authenticated: false, user: null, projects: [], transactions: [] });
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // If not authenticated, render Login / Signup buttons
  if (!profileData?.authenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <button className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5">
            <LogIn size={13} /> Log In
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md shadow-pink-500/10">
            <UserPlus size={13} /> Sign Up
          </button>
        </Link>
      </div>
    );
  }

  const { user, projects, transactions } = profileData;
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#120e1a] border-l border-white/10 text-white shadow-2xl flex flex-col z-[100000]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                  {userInitial}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white truncate max-w-[200px]">
                    {user?.email}
                  </h3>
                  <span className="inline-block text-[10px] uppercase tracking-wider text-pink-400 font-medium">
                    Member • {projects.length} Website{projects.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-black/20 px-6 pt-3 gap-4">
              <button
                onClick={() => setActiveTab("websites")}
                className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "websites"
                    ? "border-pink-500 text-pink-400"
                    : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <Globe size={14} /> My Websites ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "transactions"
                    ? "border-pink-500 text-pink-400"
                    : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <CreditCard size={14} /> Transactions ({transactions.length})
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === "websites" && (
                <div>
                  {projects.length === 0 ? (
                    <div className="text-center py-12 text-white/40">
                      <Sparkles size={32} className="mx-auto mb-3 text-pink-400/40" />
                      <p className="text-sm font-medium mb-1">No websites created yet</p>
                      <p className="text-xs text-white/30 mb-4">Pick a template and create your first birthday surprise!</p>
                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-xs px-4 py-2 rounded-full bg-pink-500 text-white font-medium"
                      >
                        Explore Templates
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((proj) => {
                        const personName =
                          (proj.data?.birthdayPerson as string) || "Birthday Site";
                        return (
                          <div
                            key={proj.id}
                            className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-white">
                                  {personName}
                                </span>
                                {proj.status === "live" && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                    <CheckCircle size={10} /> Live
                                  </span>
                                )}
                                {proj.status === "draft" && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                                    Draft
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/40 font-mono">
                                wishelier.in/s/{proj.slug}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                href={`/create/${proj.templateSlug}`}
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-pink-400 text-xs flex items-center gap-1"
                                title="Edit Website"
                              >
                                <Edit size={14} />
                              </Link>
                              {proj.status === "live" && (
                                <a
                                  href={`/s/${proj.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                                  title="View Live Site"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "transactions" && (
                <div>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12 text-white/40">
                      <CreditCard size={32} className="mx-auto mb-3 text-purple-400/40" />
                      <p className="text-sm font-medium mb-1">No transaction history</p>
                      <p className="text-xs text-white/30">Your payment receipts will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-mono text-white/80 font-medium mb-0.5">
                              {tx.orderId}
                            </div>
                            <div className="text-white/40">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-white text-sm">
                              ₹{tx.amount}
                            </div>
                            <span
                              className={`inline-block text-[10px] px-2 py-0.5 rounded-full capitalize ${
                                tx.status === "success"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer — Logout */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <span className="text-xs text-white/30">Wishelier Account</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Profile Button in Header */}
      <button
        onClick={() => {
          fetchProfile();
          setIsOpen(true);
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-all cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center font-bold text-[11px] text-white">
          {userInitial}
        </div>
        <span className="hidden sm:inline font-medium text-white/90 truncate max-w-[120px]">
          {user?.email}
        </span>
      </button>

      {/* Portal slide-over panel to document.body */}
      {mounted ? createPortal(drawerContent, document.body) : null}
    </>
  );
}
