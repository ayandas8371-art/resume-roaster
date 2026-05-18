"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingDown, AlertTriangle, CheckCircle2, Flame, Target, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPng } from "html-to-image";
import type { Burn, RoastResult } from "@/types";

interface ScoreBreakdownModalProps {
  roast: RoastResult;
  onClose: () => void;
}

// ─── Section Detection Logic ────────────────────────────────────────────────
// Maps keywords in quotes/burns to standard resume sections
const SECTION_KEYWORDS: Record<string, string[]> = {
  "Impact & Achievements": ["measurable", "outcome", "result", "achievement", "impact", "increase", "decrease", "reduce", "improve", "growth", "revenue", "metric", "quantif", "number", "kpi", "%", "dollar"],
  "Skills & Expertise": ["skill", "proficient", "microsoft", "excel", "tool", "technology", "tech", "software", "language", "framework", "platform"],
  "Experience & Roles": ["experience", "work", "job", "role", "position", "manager", "managed", "led", "team", "project", "various", "responsible"],
  "Profile Summary": ["passionate", "enthusiastic", "results-driven", "team player", "motivated", "hard-working", "dedicated", "communication", "innovative", "dynamic"],
  "Language & Clarity": ["vague", "buzzword", "cliché", "jargon", "clear", "concise", "word", "phrase", "sentence", "generic", "overused", "bland"],
  "Specificity & Detail": ["specific", "detail", "vague", "general", "context", "example", "evidence", "proof", "demonstrate"],
};

interface SectionDeduction {
  section: string;
  pointsLost: number;
  burns: Burn[];
  severity: "high" | "medium" | "low";
}

// ─── Derives logical score deductions from the AI burns ─────────────────────
function computeBreakdown(roast: RoastResult): SectionDeduction[] {
  const totalLost = 100 - roast.score;
  const burnCount = roast.burns.length;

  // Bucket each burn into a section
  const buckets: Record<string, Burn[]> = {};

  for (const burn of roast.burns) {
    const text = `${burn.quote} ${burn.burn} ${burn.fix}`.toLowerCase();
    let matched = false;

    for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
      if (keywords.some((kw) => text.includes(kw))) {
        if (!buckets[section]) buckets[section] = [];
        buckets[section].push(burn);
        matched = true;
        break; // assign to first matching section
      }
    }

    // Fallback for burns that don't match any keyword
    if (!matched) {
      const fallback = "Experience & Roles";
      if (!buckets[fallback]) buckets[fallback] = [];
      buckets[fallback].push(burn);
    }
  }

  // Calculate point deductions proportionally
  const sections: SectionDeduction[] = [];
  let pointsDistributed = 0;
  const bucketEntries = Object.entries(buckets);

  bucketEntries.forEach(([section, burns], idx) => {
    const weight = burns.length / burnCount;
    // Give more weight to sections with more burns; last section absorbs remainder
    const isLast = idx === bucketEntries.length - 1;
    const raw = isLast ? totalLost - pointsDistributed : Math.round(weight * totalLost);
    const pointsLost = Math.max(raw, 1);
    pointsDistributed += pointsLost;

    sections.push({
      section,
      pointsLost,
      burns,
      severity: pointsLost >= 20 ? "high" : pointsLost >= 10 ? "medium" : "low",
    });
  });

  // Sort: highest deduction first
  return sections.sort((a, b) => b.pointsLost - a.pointsLost);
}

// ─── Color helpers ───────────────────────────────────────────────────────────
function getSeverityColors(severity: "high" | "medium" | "low") {
  if (severity === "high") return {
    bar: "bg-red-500",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: "text-red-500",
    glow: "from-red-500/20",
  };
  if (severity === "medium") return {
    bar: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: "text-amber-500",
    glow: "from-amber-500/20",
  };
  return {
    bar: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "text-blue-500",
    glow: "from-blue-500/20",
  };
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function ScoreBreakdownModal({ roast, onClose }: ScoreBreakdownModalProps) {
  const breakdown = computeBreakdown(roast).slice(0, 3); // Max 3 sections to prevent scroll
  const totalLost = 100 - roast.score;
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      // Wait slightly to ensure fonts are fully ready
      await new Promise(resolve => setTimeout(resolve, 50));

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "transparent",
      });
      const link = document.createElement("a");
      link.download = `scorecard-${roast.score}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4 py-12">
        <motion.div
          initial={{ scale: 0.93, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.93, y: 24 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="relative w-full max-w-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Top Actions: Close & Download (Outside the capture zone) */}
        <div className="absolute -top-12 right-0 z-20 flex items-center gap-2">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex h-8 items-center gap-2 rounded-full bg-white/10 px-4 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50 border border-white/10"
          >
            {isDownloading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
            Save
          </button>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 backdrop-blur-md transition-all hover:bg-red-500/20 hover:text-red-400 border border-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── The Actual Card to Capture ── */}
        <div 
          ref={cardRef} 
          className="relative w-full h-fit overflow-hidden rounded-[32px] border border-white/10 bg-[#0c0514] shadow-[0_0_60px_-15px_rgba(249,115,22,0.15)] ring-1 ring-white/10"
        >
          {/* Custom 3D Background Image matching ShareCard */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/fun_roast_bg.png" 
            alt="Background" 
            crossOrigin="anonymous"
            className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#0c0514_100%)] opacity-90" />
        </div>

        {/* Massive Fun Background Orbs */}
        <div className="absolute -top-40 -right-40 z-0 h-[500px] w-[500px] rounded-full bg-orange-600/30 blur-[100px] mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 z-0 h-[500px] w-[500px] rounded-full bg-purple-600/30 blur-[100px] mix-blend-screen pointer-events-none" />

        <div className="relative z-10 flex flex-col p-6 sm:p-8 bg-black/40 backdrop-blur-sm">
          {/* ── Header ── */}
          <div className="mb-6 flex items-start gap-5">
            {/* Big Score Circle */}
            <div className="relative flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/10 bg-[#0c0514]/50 shadow-inner">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="4" />
                <motion.circle
                  cx="50" cy="50" r="46" fill="none"
                  stroke={roast.score >= 70 ? "#10b981" : roast.score >= 40 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - roast.score / 100) }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                />
              </svg>
              <span className="z-10 text-4xl font-black text-white">{roast.score}</span>
              <span className="z-10 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">/ 100</span>
            </div>

            <div className="flex-1 pt-1">
              <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-orange-400/80">Score Breakdown</p>
              <h2 className="text-xl font-black leading-tight text-white">
                Where You Lost{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">{totalLost} Points</span>
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {roast.burns.length} critical flaws in {breakdown.length} sections
              </p>

              {/* Mini legend */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> High Impact
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Medium Impact
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Low Impact
                </span>
              </div>
            </div>
          </div>

          {/* ── Breakdown Rows ── */}
          <div className="space-y-3">
            {breakdown.map((item, index) => {
              const colors = getSeverityColors(item.severity);
              const barWidth = Math.round((item.pointsLost / totalLost) * 100);

              return (
                <motion.div
                  key={item.section}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.08 }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                >
                  {/* Subtle section glow */}
                  <div className={cn("absolute inset-y-0 left-0 w-1 rounded-l-2xl", colors.bar)} />

                  <div className="pl-3">
                    {/* Section header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingDown className={cn("h-4 w-4", colors.icon)} />
                        <span className="text-sm font-black text-white uppercase tracking-tight">
                          {item.section}
                        </span>
                        <span className={cn(
                          "rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                          colors.badge
                        )}>
                          {item.severity}
                        </span>
                      </div>
                      <span className="text-xl font-black text-white">
                        −{item.pointsLost}
                        <span className="text-xs font-bold text-gray-500 ml-1">pts</span>
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className={cn("h-full rounded-full", colors.bar)}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.8, ease: "circOut", delay: 0.3 + index * 0.08 }}
                      />
                    </div>

                    {/* Issues from burns */}
                    <div className="space-y-1">
                      {item.burns.map((burn, bi) => (
                        <div key={bi} className="flex items-center gap-2">
                          <Flame className="h-3 w-3 shrink-0 text-red-500/60" />
                          <p className="text-[10px] text-gray-400 italic truncate">
                            &ldquo;{burn.quote}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── What a Perfect Score Needs ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-5 shadow-[inset_0_1px_1px_rgba(16,185,129,0.2)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-emerald-500" />
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Path to a Perfect Score
              </h4>
            </div>
            <div className="space-y-2">
              {roast.fixed_bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <p className="text-[11px] text-emerald-400/90 leading-snug">{bullet}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Footer ── */}
          <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1 backdrop-blur-sm border border-white/10">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/50">AI Powered</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
              hiredorroasted.online
            </p>
          </div>
        </div>
        </div>
      </motion.div>
      </div>
    </motion.div>,
    document.body
  );
}
