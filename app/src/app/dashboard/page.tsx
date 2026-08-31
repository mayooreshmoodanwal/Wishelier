"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ExternalLink,
  Edit,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProfileDrawer from "@/components/profile/ProfileDrawer";

interface UserProject {
  id: string;
  slug: string;
  status: string;
  data: Record<string, unknown>;
  templateName: string;
  templateSlug: string;
  templateCategory: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

interface UserTransaction {
  id: string;
  orderId: string;
  amount: string;
  currency: string;
  status: string;
  createdAt: string;
  projectId: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const profileRes = await fetch("/api/user/profile");
      if (profileRes.status === 401) {
        window.location.href = "/login?redirect=/dashboard";
        return;
      }

      const profileData = await profileRes.json();
      if (profileRes.ok && profileData.data?.authenticated) {
        setProjects(profileData.data.projects || []);
        setTransactions(profileData.data.transactions || []);
      } else {
        const projRes = await fetch("/api/projects");
        if (projRes.status === 401) {
          window.location.href = "/login?redirect=/dashboard";
          return;
        }
        const projData = await projRes.json();
        if (projRes.ok) {
          setProjects(projData.data || []);
        } else {
          setError(projData.error?.message || "Failed to load dashboard");
        }
      }
    } catch {
      setError("Network error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            <CheckCircle size={12} /> Live
          </span>
        );
      case "pending_payment":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
            <Clock size={12} /> Payment Pending
          </span>
        );
      case "generating":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold">
            <RefreshCw size={12} className="animate-spin" /> Generating...
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold">
            <AlertCircle size={12} /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-bold">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1e1b2e] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e6cb9c]/40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Wishelier" width={28} height={28} className="rounded-lg object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#d97706] via-[#c026d3] to-[#0f766e] bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-[#4a4458] hover:text-[#1e1b2e] transition-colors">
              Templates
            </Link>
            <ProfileDrawer />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12">
        {/* Title & Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e6cb9c]/40">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e1b2e] mb-1">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#4a4458]">
              Manage your personalized birthday websites and orders
            </p>
          </div>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/15 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create New Website</span>
            </motion.button>
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold mb-6">
            {error}
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="space-y-10">
          {/* Section: My Websites */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1e1b2e] flex items-center gap-2">
                <Globe size={18} className="text-[#0f766e]" /> My Birthday Websites ({projects.length})
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 rounded-3xl bg-white animate-pulse border border-[#e6cb9c]/40" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#e6cb9c]/50 rounded-3xl p-8 shadow-xs">
                <Sparkles size={40} className="text-[#d97706] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1e1b2e] mb-2">
                  No websites created yet
                </h3>
                <p className="text-xs sm:text-sm text-[#4a4458] max-w-md mx-auto mb-6 leading-relaxed">
                  Select a template, customize messages and photos, and deploy your personalized surprise in 2 minutes!
                </p>
                <Link href="/">
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d97706] to-[#c026d3] text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer">
                    Browse Birthday Templates
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const birthdayPerson =
                    (project.data?.birthdayPerson as string) || "Birthday Surprise";
                  return (
                    <motion.div
                      key={project.id}
                      whileHover={{ y: -3 }}
                      className="rounded-3xl bg-white border border-[#e6cb9c]/60 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] text-[#4a4458]/70 uppercase tracking-wider font-bold">
                            {project.templateName}
                          </span>
                          {getStatusBadge(project.status)}
                        </div>

                        <h3 className="text-xl font-extrabold text-[#1e1b2e] mb-1">
                          {birthdayPerson}
                        </h3>
                        <p className="text-xs text-[#0f766e] font-mono font-bold mb-4 bg-[#bcf6f0]/40 px-2 py-1 rounded-lg inline-block">
                          wishelier.in/s/{project.slug}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#e6cb9c]/30 flex items-center justify-between">
                        <Link
                          href={`/create/${project.templateSlug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c026d3] hover:underline"
                        >
                          <Edit size={14} /> Edit Content
                        </Link>

                        {project.status === "live" && (
                          <a
                            href={`/s/${project.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0f766e] hover:underline"
                          >
                            Visit Site <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Transaction History */}
          {transactions.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#1e1b2e] mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#d97706]" /> Recent Transactions
              </h2>
              <div className="rounded-3xl bg-white border border-[#e6cb9c]/50 overflow-hidden shadow-xs">
                <div className="divide-y divide-[#e6cb9c]/30">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between text-xs sm:text-sm">
                      <div>
                        <p className="font-mono text-[#1e1b2e] font-bold mb-0.5">
                          Order #{tx.orderId}
                        </p>
                        <p className="text-xs text-[#4a4458]/70">
                          {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-[#1e1b2e] text-sm sm:text-base">
                          ₹{tx.amount}
                        </p>
                        <span
                          className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full capitalize font-bold ${
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
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
