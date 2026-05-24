"use client";

import { motion } from "framer-motion";
import { Crown, Zap, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { useUsage } from "@/hooks/use-usage";
import { Plan, PLAN_CONFIGS } from "@/types";
import { PricingCard } from "@/components/pricing-card";
import { QuotaMeter } from "@/components/quota-meter";
import { formatPlanName } from "@/utils/format";
import { useRevenueCat } from "@/components/providers/revenuecat-provider";
import { useAuth } from "@clerk/nextjs";

const PLAN_PERKS: Record<string, { icon: React.ReactNode; text: string }[]> = {
  free: [
    { icon: <Zap className="h-4 w-4 text-gray-400" />, text: "2 roasts / month" },
    { icon: <Shield className="h-4 w-4 text-gray-400" />, text: "Basic resume scoring" },
  ],
  starter: [
    { icon: <Zap className="h-4 w-4 text-orange-400" />, text: "30 roasts / month" },
    { icon: <Sparkles className="h-4 w-4 text-orange-400" />, text: "Shareable roast cards" },
    { icon: <CheckCircle2 className="h-4 w-4 text-orange-400" />, text: "Priority processing" },
  ],
  pro: [
    { icon: <Zap className="h-4 w-4 text-purple-400" />, text: "30 roasts / month" },
    { icon: <Sparkles className="h-4 w-4 text-purple-400" />, text: "Shareable roast cards" },
    { icon: <CheckCircle2 className="h-4 w-4 text-purple-400" />, text: "Priority processing" },
  ],
};

export default function BillingPage() {
  const { usage, isLoading } = useUsage();
  const { showCustomerCenter } = useRevenueCat();
  const { userId } = useAuth();

  const planKey = usage?.plan ?? "free";
  const perks = PLAN_PERKS[planKey] ?? PLAN_PERKS.free;
  const isPaid = planKey !== "free";

  const handleSelect = async (plan: Plan) => {
    if (plan !== Plan.FREE) {
      if (userId) {
        window.location.href = `https://pay.rev.cat/xfrmazoqasqrwiti?app_user_id=${userId}`;
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* ── Page Header ── */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1">
          <Crown className="h-3 w-3 text-orange-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-orange-400">Subscription</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Billing <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">&amp; Plans</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">Manage your subscription and monitor your usage.</p>
      </div>

      {/* ── Current Plan Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl"
      >
        {/* Brand glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-600/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-600/10 blur-[80px]" />

        <div className="relative p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Plan Info */}
            <div className="flex items-center gap-5">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                isPaid
                  ? "border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-purple-600/20"
                  : "border-white/10 bg-white/5"
              }`}>
                <Crown className={`h-7 w-7 ${isPaid ? "text-orange-400" : "text-gray-500"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">
                    {isLoading ? "—" : `${PLAN_CONFIGS[planKey as Plan].displayName} Plan`}
                  </h2>
                  {isPaid && (
                    <span className="rounded-full bg-gradient-to-r from-orange-500 to-purple-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-gray-400">
                  {isPaid ? "Renews monthly · cancel anytime" : "2 free roasts every month"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isPaid ? (
                <button
                  onClick={() => showCustomerCenter()}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20"
                >
                  Manage Billing
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (userId) window.location.href = `https://pay.rev.cat/xfrmazoqasqrwiti?app_user_id=${userId}`;
                  }}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-[1.02]"
                >
                  Upgrade Now →
                </button>
              )}
            </div>
          </div>

          {/* Perks */}
          <div className="mt-6 flex flex-wrap gap-3">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2">
                {perk.icon}
                <span className="text-xs font-semibold text-gray-300">{perk.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Quota Meter ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/10 blur-[60px]" />
        <h2 className="mb-4 text-base font-black text-white">Usage This Period</h2>
        <QuotaMeter usage={usage} isLoading={isLoading} />
      </div>

      {/* ── Plan Comparison ── */}
      <div>
        <h2 className="mb-2 text-xl font-black text-white">Available Plans</h2>
        <p className="mb-6 text-sm text-gray-400">Choose the plan that fits your hustle.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {([Plan.FREE, Plan.STARTER, Plan.PRO] as Plan[]).map((plan, i) => (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex h-full"
            >
              <PricingCard
                plan={plan}
                isCurrentPlan={usage?.plan === plan}
                onSelect={handleSelect}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
