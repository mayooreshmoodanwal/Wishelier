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

  // If not authenticated, render a sign in button
  if (!profileData?.authenticated) {
    return (
      <Link href="/login">
        <button className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#d97706] to-[#c026d3] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0">
          <LogIn size={13} /> <span>Sign In</span>
        </button>
      </Link>
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
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#faf7f2] border-l border-[#e6cb9c]/60 text-[#1e1b2e] shadow-2xl flex flex-col z-[100000]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#e6cb9c]/40 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d97706] to-[#c026d3] flex items-center justify-center text-base font-bold text-white shadow-xs">
                  {userInitial}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1e1b2e] truncate max-w-[200px]">
                    {user?.email}
                  </h3>
                  <span className="inline-block text-[10px] uppercase tracking-wider text-[#0f766e] font-bold">
                    Member • {projects.length} Website{projects.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-[#4a4458] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#e6cb9c]/40 bg-white/50 px-6 pt-3 gap-4">
              <button
                onClick={() => setActiveTab("websites")}
                className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === "websites"
                    ? "border-[#d97706] text-[#d97706]"
                    : "border-transparent text-[#4a4458]/70 hover:text-[#1e1b2e]"
                }`}
              >
                <Globe size={14} /> My Websites ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === "transactions"
                    ? "border-[#d97706] text-[#d97706]"
                    : "border-transparent text-[#4a4458]/70 hover:text-[#1e1b2e]"
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
                    <div className="text-center py-12 text-[#4a4458]/70">
                      <Sparkles size={32} className="mx-auto mb-3 text-[#d97706]" />
                      <p className="text-sm font-bold text-[#1e1b2e] mb-1">No websites created yet</p>
                      <p className="text-xs text-[#4a4458] mb-4">Pick a template and create your first surprise!</p>
                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-xs px-4 py-2 rounded-full bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold shadow-xs"
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
                            className="p-4 rounded-2xl bg-white border border-[#e6cb9c]/60 hover:shadow-md transition-all flex items-center justify-between shadow-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-[#1e1b2e]">
                                  {personName}
                                </span>
                                {proj.status === "live" && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                                    <CheckCircle size={10} /> Live
                                  </span>
                                )}
                                {proj.status === "draft" && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold">
                                    Draft
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#0f766e] font-mono font-semibold">
                                wishelier.in/s/{proj.slug}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                href={`/create/${proj.templateSlug}`}
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl bg-gray-50 hover:bg-[#ebcae8]/30 text-[#c026d3] text-xs flex items-center gap-1 border border-gray-200"
                                title="Edit Website"
                              >
                                <Edit size={14} />
                              </Link>
                              {proj.status === "live" && (
                                <a
                                  href={`/s/${proj.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 rounded-xl bg-gray-50 hover:bg-[#bcf6f0]/40 text-[#0f766e] border border-gray-200"
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
                    <div className="text-center py-12 text-[#4a4458]/70">
                      <CreditCard size={32} className="mx-auto mb-3 text-[#d97706]" />
                      <p className="text-sm font-bold text-[#1e1b2e] mb-1">No transaction history</p>
                      <p className="text-xs text-[#4a4458]">Your payment receipts will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="p-4 rounded-2xl bg-white border border-[#e6cb9c]/60 flex items-center justify-between text-xs shadow-xs"
                        >
                          <div>
                            <div className="font-mono text-[#1e1b2e] font-bold mb-0.5">
                              {tx.orderId}
                            </div>
                            <div className="text-[#4a4458]/70 text-[11px]">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[#1e1b2e] text-sm">
                              ₹{tx.amount}
                            </div>
                            <span
                              className={`inline-block text-[10px] px-2 py-0.5 rounded-full capitalize font-bold ${
                                tx.status === "success"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
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
            <div className="p-4 border-t border-[#e6cb9c]/40 bg-white flex items-center justify-between">
              <span className="text-xs text-[#4a4458]/70 font-semibold">Wishelier Studio</span>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-[#faf7f2] border border-[#e6cb9c] text-xs text-[#1e1b2e] transition-all cursor-pointer shadow-xs"
      >
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#d97706] to-[#c026d3] flex items-center justify-center font-bold text-[10px] text-white">
          {userInitial}
        </div>
        <span className="hidden sm:inline font-bold text-xs truncate max-w-[120px]">
          {user?.email}
        </span>
      </button>

      {mounted ? createPortal(drawerContent, document.body) : null}
    </>
  );
}
