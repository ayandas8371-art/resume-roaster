"use client";

import { useEffect, useState } from "react";
import { Plan, PLAN_CONFIGS } from "@/types";
import { Zap, Calendar, ArrowRight, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/utils/format";
import { useRevenueCat } from "@/components/providers/revenuecat-provider";

interface UsageData {
  quota_used: number;
  quota_limit: number;
  roasts_remaining: number;
  quota_reset_at?: string;
  resetDate?: string;
  plan: string;
}

export function QuotaMeter({ 
  usage: externalUsage, 
  isLoading: externalLoading 
}: { 
  usage?: any; 
  isLoading?: boolean; 
} = {}) {
  const [internalUsage, setInternalUsage] = useState<UsageData | null>(null);
  const [internalLoading, setInternalLoading] = useState(true);
  const { showPaywall } = useRevenueCat();

  const usage = externalUsage !== undefined ? externalUsage : internalUsage;
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  useEffect(() => {
    // Only fetch internally if no external usage is provided
    if (externalUsage !== undefined) return;

    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/usage");
        const data = await res.json();
        setInternalUsage(data);
        window.dispatchEvent(new CustomEvent('quota-updated', { detail: data }));
      } catch (err) {
        console.error("Failed to fetch quota:", err);
      } finally {
        setInternalLoading(false);
      }
    };

    fetchUsage();
    window.addEventListener('refresh-quota', fetchUsage);
    return () => window.removeEventListener('refresh-quota', fetchUsage);
  }, [externalUsage]);

  if (isLoading) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-white/5 bg-white/5 animate-pulse">
        <span className="text-xs text-gray-600 uppercase tracking-widest font-bold">Loading Plan...</span>
      </div>
    );
  }

  if (!usage) return null;

  const percentage = usage.quota_limit > 0 ? (usage.quota_used / usage.quota_limit) * 100 : 0;
  const isFree = usage.plan === "free";
  
  // Color logic: green < 50%, amber 50-90%, red 90%+
  const getBarColor = () => {
    if (usage.roasts_remaining === 0) return "bg-red-500";
    if (percentage < 50) return "bg-emerald-500";
    if (percentage < 90) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-white">
            {usage.quota_used} of {usage.quota_limit} reports used this month
          </p>
        </div>
        
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className={`h-full rounded-full transition-colors ${getBarColor()}`}
          />
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
            {usage.roasts_remaining === 0
              ? (() => {
                  const resetVal = usage.quota_reset_at || usage.resetDate;
                  if (!resetVal) return "Quota exhausted";
                  const resetDate = new Date(resetVal);
                  const now = new Date();
                  const daysUntilReset = Math.ceil(
                    (resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const dateStr = resetDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  return daysUntilReset <= 0
                    ? "Resetting now..."
                    : `Resets in ${daysUntilReset} day${daysUntilReset !== 1 ? "s" : ""} · ${dateStr}`;
                })()
              : (() => {
                  const resetVal = usage.quota_reset_at || usage.resetDate;
                  if (!resetVal) return `${usage.roasts_remaining} remaining`;
                  const resetDate = new Date(resetVal);
                  const dateStr = resetDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  return `${usage.roasts_remaining} remaining · resets ${dateStr}`;
                })()
            }
          </p>
        </div>
      </div>

      {/* Free Plan Warnings & CTA */}
      {isFree && usage.remaining === 1 && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 border border-amber-500/20">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] font-medium text-amber-200/80 leading-relaxed">
            1 report remaining this month — upgrade for 30/mo
          </p>
        </div>
      )}

      {isFree && usage.remaining === 0 && (
        <div className="space-y-4">
          <button
            onClick={showPaywall}
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-red-600 p-4 text-sm font-black text-white hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-purple-600/20 group"
          >
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 fill-white" />
              <span>Upgrade to Pro — 30 reports/mo</span>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
