"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  FileText,
  Lock,
  Crown,
  Flame,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRevenueCat } from "@/components/providers/revenuecat-provider";

interface Roast {
  id: string;
  role: string;
  industry: string;
  score: number;
  headline: string;
  plan: string;
  created_at: string;
}

type FetchState =
  | { status: "loading" }
  | { status: "locked" }                // free user — no access
  | { status: "empty" }                 // paid user, no roasts yet
  | { status: "ready"; roasts: Roast[] };

export function RoastHistory() {
  const router = useRouter();
  const { showPaywall, isInitialized, isLoading: isRcLoading } = useRevenueCat();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");

        // 403 = free user — history is locked
        if (res.status === 403) {
          setState({ status: "locked" });
          return;
        }

        const data = await res.json();
        const roasts: Roast[] = data.roasts ?? [];
        setState(roasts.length === 0 ? { status: "empty" } : { status: "ready", roasts });
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setState({ status: "empty" });
      }
    };
    fetchHistory();
  }, []);

  // ── Loading skeleton ──────────────────────────────────────────────────
  if (state.status === "loading") {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-white/5 border border-white/5" />
        ))}
      </div>
    );
  }

  // ── Free-user upgrade wall ────────────────────────────────────────────
  if (state.status === "locked") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-black/30 to-purple-600/5 p-8 text-center"
      >
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-600/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-600/10 blur-[80px]" />

        <div className="relative flex flex-col items-center gap-5">
          {/* Lock icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/20 to-purple-600/20">
            <Lock className="h-7 w-7 text-orange-400" />
          </div>

          {/* Heading */}
          <div>
            <h3 className="text-xl font-black text-white">
              History is a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
                Pro Feature
              </span>
            </h3>
            <p className="mt-2 text-sm text-gray-400 max-w-xs mx-auto">
              Upgrade to a paid plan to access your full roast history, revisit
              past reports, and track your resume improvement over time.
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Full roast history",
              "Revisit past reports",
              "Track improvement",
              "Export past reports",
            ].map((feat) => (
              <div
                key={feat}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                <span className="text-xs font-semibold text-gray-300">{feat}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => showPaywall()}
            disabled={!isInitialized || isRcLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 px-6 py-3 text-sm font-black text-white shadow-[0_0_24px_rgba(249,115,22,0.35)] transition-all hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(249,115,22,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Crown className="h-4 w-4" />
            {(!isInitialized || isRcLoading) ? "Loading..." : "Unlock History — Upgrade Now"}
          </button>

          <p className="text-[11px] text-gray-600">
            Cancel anytime · Plans from $9/mo
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Empty state (paid user, no roasts yet) ────────────────────────────
  if (state.status === "empty") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-white/5 p-6 text-gray-600 mb-4 border border-white/5">
          <FileText className="h-10 w-10 opacity-20" />
        </div>
        <p className="text-lg font-bold text-white">No reports yet.</p>
        <p className="mt-1 text-sm text-gray-500">Upload your resume to get your first roast.</p>
      </div>
    );
  }

  // ── Roast list (paid user, has history) ──────────────────────────────
  const { roasts } = state;
  return (
    <div className="grid grid-cols-1 gap-4">
      {roasts.map((roast, index) => (
        <motion.div
          key={roast.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-orange-500/30 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-6">
            {/* Score Badge */}
            <div className={cn(
              "flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl font-black shadow-2xl",
              roast.score >= 70
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : roast.score >= 40
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "bg-red-500/10 text-red-500 border border-red-500/20"
            )}>
              <span className="text-3xl">{roast.score}</span>
              <span className="text-[8px] uppercase tracking-tighter opacity-60">/ 100</span>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">
                  {roast.role}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {roast.industry}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  roast.plan === "pro"
                    ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                )}>
                  {roast.plan}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-400 line-clamp-1 italic">
                &ldquo;{roast.headline.length > 90 ? roast.headline.substring(0, 87) + "..." : roast.headline}&rdquo;
              </p>

              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                {new Date(roast.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date(roast.created_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/dashboard/roast/${roast.id}`)}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-xs font-black text-white hover:bg-white/10 transition-all active:scale-95 group-hover:border-orange-500/40"
          >
            VIEW REPORT
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
