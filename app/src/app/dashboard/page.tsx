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
      // 1. Fetch user profile & transactions data
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
        // Fallback to /api/projects
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
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <CheckCircle size={12} /> Live
          </span>
        );
      case "pending_payment":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
            <Clock size={12} /> Payment Pending
          </span>
        );
      case "generating":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
            <RefreshCw size={12} className="animate-spin" /> Generating...
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
            <AlertCircle size={12} /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/60 border border-white/10 font-medium">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles size={20} className="text-pink-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Wishelier
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-white/70 hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/projects" className="text-xs text-white/70 hover:text-white transition-colors">
              Projects
            </Link>
            <ProfileDrawer />
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Dashboard Overview
            </h1>
            <p className="text-sm text-white/40">
              Manage your birthday surprise websites and payments
            </p>
          </div>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-pink-500/20"
            >
              <Plus size={16} />
              <span>Create New Site</span>
            </motion.button>
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="space-y-10">
          {/* Section: My Websites */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe size={18} className="text-pink-400" /> My Websites ({projects.length})
              </h2>
              {projects.length > 0 && (
                <Link href="/projects" className="text-xs text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1">
                  View All <ArrowRight size={12} />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl">
                <Sparkles size={40} className="text-pink-400/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white/80 mb-2">
                  No websites created yet
                </h3>
                <p className="text-sm text-white/40 max-w-md mx-auto mb-6">
                  Select a template, customize messages and photos, and deploy a shareable website in minutes!
                </p>
                <Link href="/">
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm">
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
                      whileHover={{ y: -4 }}
                      className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
                            {project.templateName}
                          </span>
                          {getStatusBadge(project.status)}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">
                          {birthdayPerson}
                        </h3>
                        <p className="text-xs text-white/40 font-mono mb-4">
                          wishelier.in/s/{project.slug}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <Link
                          href={`/create/${project.templateSlug}`}
                          className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-medium"
                        >
                          <Edit size={14} /> Edit Site
                        </Link>

                        {project.status === "live" && (
                          <a
                            href={`/s/${project.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white font-medium"
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
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-purple-400" /> Recent Transactions
              </h2>
              <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between text-xs sm:text-sm">
                      <div>
                        <p className="font-mono text-white font-medium mb-0.5">
                          Order #{tx.orderId}
                        </p>
                        <p className="text-xs text-white/40">
                          {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white text-sm sm:text-base">
                          ₹{tx.amount}
                        </p>
                        <span
                          className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full capitalize font-medium ${
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
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
