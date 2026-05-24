"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN_CONFIGS, Plan } from "@/types";

interface PricingCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  disabled?: boolean;
  onSelect?: (plan: Plan) => void;
}

export function PricingCard({ plan, isCurrentPlan, disabled, onSelect }: PricingCardProps) {
  const config = PLAN_CONFIGS[plan];

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative flex h-full w-full flex-col rounded-[2rem] p-6 sm:p-8 transition-all duration-500",
        config.popular
          ? "bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_60px_-15px_rgba(168,85,247,0.4)]"
          : "border border-white/[0.08] bg-white/[0.01] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-white/[0.03] hover:border-white/[0.15] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_40px_-15px_rgba(255,255,255,0.05)]"
      )}
    >
      {/* ── Premium Glowing Gradient Border (Popular Plan Only) ── */}
      {config.popular && (
        <div 
          className="pointer-events-none absolute inset-0 z-20 rounded-[2rem]"
          style={{
            padding: "2px",
            background: "linear-gradient(135deg, #a855f7 0%, #f97316 40%, rgba(168,85,247,0.2) 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }}
        />
      )}
      {/* ── Glass Backdrop Blur & Overflow Container ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2rem] backdrop-blur-[40px] transition-all duration-500">
        {/* ── Ambient Background Glows ── */}
        {config.popular ? (
          <>
            <div className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-purple-600/30 blur-[100px] transition-opacity duration-500 group-hover:opacity-100 opacity-80" />
            <div className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-red-600/20 blur-[100px] transition-opacity duration-500 group-hover:opacity-100 opacity-80" />
          </>
        ) : (
          <div className="absolute top-0 left-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        )}

        {/* ── Glass Reflection Highlight ── */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.08] opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      
      {/* ── Content Container ── */}
      <div className="relative z-30 flex flex-col h-full">
        {config.popular && (
          <div className="absolute -top-[42px] sm:-top-[50px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-4 py-1 text-[10px] sm:text-xs font-black tracking-widest text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-white/20 uppercase">
            Most Popular
          </div>
        )}

        <div className="mb-6">
          <h3 className={cn(
            "text-lg font-black tracking-[0.2em] uppercase mb-4",
            config.popular ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400 drop-shadow-sm" : "text-gray-400"
          )}>
            {config.displayName}
          </h3>
          
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-white drop-shadow-md tracking-tighter">
              {config.price === 0 ? "Free" : `$${config.price}`}
            </span>
            {config.price > 0 && <span className="text-lg font-bold text-gray-400">{config.priceSuffix || "/mo"}</span>}
          </div>
          
          {config.discountBadge && (
            <div className="mt-3 inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(16,185,129,0.2)] backdrop-blur-md">
              {config.discountBadge}
            </div>
          )}

          <p className={cn("text-sm font-medium text-gray-400", config.discountBadge ? "mt-4" : "mt-3")}>
            {config.isLifetime ? "Lifetime limit" : config.billedAnnually ? config.billedAnnually : "Resets monthly"}
          </p>
        </div>

        <ul className="mb-8 flex-1 space-y-4">
          {config.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-semibold text-gray-300">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/5 bg-gradient-to-br from-purple-500 to-red-500">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </div>
              <span className="leading-tight drop-shadow-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSelect?.(plan)}
          disabled={isCurrentPlan || disabled}
          className={cn(
            "w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-md",
            (isCurrentPlan || disabled)
              ? "cursor-default bg-white/5 text-gray-500 border border-white/5"
              : config.popular
                ? "bg-white text-black hover:bg-gray-200 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] active:scale-95"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95"
          )}
        >
          {disabled && !isCurrentPlan ? "Loading..." : isCurrentPlan ? "Current Plan" : plan === Plan.FREE ? "Get Started" : "Upgrade Now"}
        </button>
      </div>
    </motion.div>
  );
}
