"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertTriangle, CheckCircle2, Share2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScoreColor, getScoreGradient, getScoreLabel } from "@/utils/format";
import type { RoastResult } from "@/types";
import { ShareCard } from "./share-card";
import { ScoreBreakdownModal } from "./score-breakdown-modal";
import { useState } from "react";

interface RoastCardProps {
  roast: RoastResult;
  className?: string;
}

// ── Collapsible Burn Card (mobile-optimized) ──────────────────────────────────
function BurnItem({ burn, index }: { burn: RoastResult["burns"][number]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.07 }}
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
    >
      {/* ── Header row — always visible ── */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.04] active:bg-white/[0.06]"
      >
        {/* Number badge */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-[11px] font-black text-gray-400 border border-white/10">
          {index + 1}
        </span>

        {/* Quote preview — truncated on mobile */}
        <p className="flex-1 font-mono text-xs text-gray-400 italic line-clamp-2">
          &ldquo;{burn.quote}&rdquo;
        </p>

        {/* Expand chevron */}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-600 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* ── Expanded content ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-white/5 p-4">
              {/* Full quote */}
              <p className="font-mono text-xs text-gray-400 italic leading-relaxed mb-3">
                &ldquo;{burn.quote}&rdquo;
              </p>

              {/* Burn */}
              <div className="flex items-start gap-2.5 rounded-xl bg-red-500/[0.05] px-3 py-3 border border-red-500/20 shadow-[inset_0_1px_1px_rgba(239,68,68,0.15)]">
                <Flame className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                <p className="text-xs font-medium text-red-400 leading-relaxed">{burn.burn}</p>
              </div>

              {/* Fix */}
              <div className="flex items-start gap-2.5 rounded-xl bg-emerald-500/[0.05] px-3 py-3 border border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(16,185,129,0.15)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/50 mb-1">
                    Fix
                  </p>
                  <p className="text-xs font-medium text-emerald-400 leading-relaxed">{burn.fix}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main RoastCard ─────────────────────────────────────────────────────────────
export function RoastCard({ roast, className }: RoastCardProps) {
  const [showShare, setShowShare] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Listen for global share requests
  useState(() => {
    if (typeof window !== "undefined") {
      const handleOpenShare = () => setShowShare(true);
      window.addEventListener("open-share-modal", handleOpenShare);
      return () => window.removeEventListener("open-share-modal", handleOpenShare);
    }
  });

  return (
    <div className={cn("space-y-4 sm:space-y-8 pb-10", className)}>

      {/* ── Score Hero Card ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "circOut" }}
        className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10 bg-white/[0.02] p-1 shadow-[0_0_60px_-15px_rgba(255,255,255,0.05)]"
      >
        <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] bg-black/40 border border-white/5 p-4 sm:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">

          {/* Mobile: horizontal compact layout | Desktop: stacked then side-by-side */}
          <div className="flex flex-row items-center gap-4 sm:flex-col sm:gap-8 md:flex-row md:gap-12">

            {/* Score Circle — small on mobile, large on desktop */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="relative flex h-24 w-24 sm:h-40 sm:w-40 md:h-56 md:w-56 shrink-0 items-center justify-center rounded-full border border-white/10"
            >
              <svg className="absolute inset-0 h-full w-full -rotate-90 scale-110" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="60" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="4" />
                <motion.circle
                  cx="64" cy="64" r="60" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                  className={cn("filter brightness-110", getScoreColor(roast.score).replace("text-", "stroke-"))}
                  style={{ strokeDasharray: `${2 * Math.PI * 60}` }}
                  initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - roast.score / 100) }}
                  transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                />
              </svg>
              <div className="text-center z-10 flex flex-col items-center">
                <motion.span
                  className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-md"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <span className="contents">{roast.score}</span>
                </motion.span>
                <div className="h-px w-8 sm:w-12 bg-white/40 my-1 sm:my-2" />
                <p className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em]">SCORE</p>
              </div>
            </motion.div>

            {/* Headline & Actions */}
            <div className="flex-1 min-w-0 text-left space-y-3 sm:space-y-6 sm:text-center md:text-left">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                {/* Label row */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={cn(
                    "inline-block px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white"
                  )}>
                    {getScoreLabel(roast.score)}
                  </span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block">
                    {100 - roast.score}% Destroyed
                  </span>
                </div>

                {/* Headline — smaller on mobile to keep it tidy */}
                <h1 className="text-base sm:text-2xl md:text-4xl font-black leading-tight text-white tracking-tight line-clamp-3 sm:line-clamp-none">
                  {roast.headline}
                </h1>
              </motion.div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 sm:justify-center md:justify-start">
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                  onClick={() => setShowShare(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-sm font-black text-black hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                >
                  <Share2 className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">SHARE</span>
                  <span className="xs:hidden">Share</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
                  onClick={() => setShowBreakdown(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-sm font-black text-white hover:bg-white/10 hover:border-orange-500/40 transition-all active:scale-95"
                >
                  <Flame className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-orange-500" />
                  Score: {roast.score}/100
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── MOBILE/TABLET: Verdict summary strip (compact) ──────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        {/* Biggest Crime — compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-xl border border-red-500/30 bg-red-500/[0.05] p-3 shadow-[inset_0_1px_1px_rgba(239,68,68,0.2)]"
        >
          <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-1">⚠ Biggest Crime</p>
          <p className="text-xs font-semibold text-white leading-snug line-clamp-4">{roast.biggest_crime}</p>
        </motion.div>

        {/* Verdict — compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        >
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">The Verdict</p>
          <p className="text-xs text-gray-300 italic leading-snug line-clamp-4">&ldquo;{roast.verdict}&rdquo;</p>
        </motion.div>
      </div>

      {/* Executive Summary — mobile/tablet compact strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="lg:hidden rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-3 shadow-[inset_0_1px_1px_rgba(16,185,129,0.2)]"
      >
        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">✓ Executive Fix</p>
        <p className="text-xs font-medium text-emerald-400 leading-relaxed">{roast.fixed_summary}</p>
      </motion.div>

      {/* ── Burns section ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">

        {/* Burns — accordion on mobile, full cards on desktop */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base sm:text-xl font-black uppercase tracking-tighter text-white">
              <Flame className="h-4 w-4 sm:h-6 sm:w-6 text-orange-500" />
              Detailed Roasts
            </h3>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase border border-white/10 rounded-full px-2 sm:px-3 py-0.5 sm:py-1">
              {roast.burns.length} Issues
            </span>
          </div>

          {/* Mobile/Tablet: accordion | Desktop: expanded cards */}
          <div className="space-y-2 lg:hidden">
            {roast.burns.map((burn, index) => (
              <BurnItem key={index} burn={burn} index={index} />
            ))}
          </div>

          {/* Desktop expanded burn cards (hidden on mobile/tablet) */}
          <div className="hidden lg:space-y-4 lg:block">
            {roast.burns.map((burn, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-white/20 group-hover:bg-orange-500 transition-colors shrink-0" />
                    <p className="font-mono text-xs text-gray-400 leading-relaxed italic">
                      &ldquo;{burn.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pl-5 space-y-3">
                    <div className="flex items-start gap-3 rounded-xl bg-red-500/[0.05] px-4 pt-4 pb-5 border border-red-500/20 shadow-[inset_0_1px_1px_rgba(239,68,68,0.15)]">
                      <Flame className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                      <p className="text-sm font-medium text-red-400">{burn.burn}</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-emerald-500/[0.05] px-4 pt-4 pb-5 border border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(16,185,129,0.15)]">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/50 mb-1">Recommended Fix</p>
                        <p className="text-sm font-medium text-emerald-400">{burn.fix}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Verdict Column — hidden on mobile/tablet (shown in strips above), visible lg+ */}
        <div className="hidden lg:block lg:col-span-5 space-y-6">
          <h3 className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter text-white">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Final Verdict
          </h3>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
              className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/[0.03] px-8 pt-8 pb-10 shadow-[inset_0_1px_1px_rgba(239,68,68,0.2),0_0_40px_-10px_rgba(239,68,68,0.15)]"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="h-24 w-24" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-red-500 mb-4">Biggest Crime</h4>
              <p className="text-lg font-bold text-white leading-snug">{roast.biggest_crime}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-8 pt-8 pb-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            >
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">The Verdict</h4>
              <p className="text-lg text-gray-300 italic leading-relaxed">&ldquo;{roast.verdict}&rdquo;</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.9 }}
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] px-8 pt-8 pb-10 shadow-[inset_0_1px_1px_rgba(16,185,129,0.2),0_0_40px_-10px_rgba(16,185,129,0.15)]"
            >
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4 text-center">Executive Summary Fix</h4>
              <p className="text-sm font-medium text-emerald-400 text-center leading-relaxed">{roast.fixed_summary}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <ShareCard
          score={roast.score}
          headline={roast.headline}
          bestBurn={roast.burns[0]?.burn || ""}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* Score Breakdown Modal */}
      {showBreakdown && (
        <ScoreBreakdownModal
          roast={roast}
          onClose={() => setShowBreakdown(false)}
        />
      )}
    </div>
  );
}
