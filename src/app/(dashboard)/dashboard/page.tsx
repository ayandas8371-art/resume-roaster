import { Metadata } from "next";
import { UploadZone } from "@/components/upload-zone";
import { QuotaMeter } from "@/components/quota-meter";
import { RoastHistory } from "@/components/roast-history";
import { ReferFriendCard } from "@/components/refer-friend-card";
import { auth } from "@clerk/nextjs/server";
import { getUserUsage } from "@/lib/quota";
import { Plan, PLAN_CONFIGS } from "@/types";
import { Zap, History, Sparkles, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — RoastMyResume",
  description: "Upload your resume and get roasted.",
};

export default async function DashboardPage() {
  const { userId } = auth();
  const usage = userId ? await getUserUsage(userId) : null;

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1">
            <Sparkles className="h-3 w-3 text-orange-400" />
            <span className="text-[11px] font-black uppercase tracking-widest text-orange-400">
              {usage ? `${PLAN_CONFIGS[usage.plan as Plan].displayName} Active` : "Free Plan"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">Center</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Upload your resume. Get brutally roasted. Actually get hired.
          </p>
        </div>
        {usage && (
          <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-bold text-white">{usage.roastsRemaining ?? 0} roasts remaining</span>
          </div>
        )}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Upload Card */}
          <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-5 sm:p-8 backdrop-blur-xl transition-all hover:border-orange-500/20">
            {/* Corner gradient glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-orange-500/20 blur-[60px] transition-all group-hover:bg-orange-500/30" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-purple-600/10 blur-[60px]" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-purple-600/20 border border-orange-500/20">
                    <Zap className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Start New Roast</h2>
                    <p className="text-xs text-gray-500">Upload PDF or paste text</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-orange-400">
                    {usage?.plan === "pro" ? "Pro AI" : "AI Powered"}
                  </span>
                </div>
              </div>
              <UploadZone usage={usage} />
            </div>
          </section>

          {/* Recent Roasts */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-5 sm:p-8 backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-purple-600/10 blur-[60px]" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-red-500/20">
                  <History className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Recent Roasts</h2>
                  <p className="text-xs text-gray-500">Your roast history & reports</p>
                </div>
              </div>
              <RoastHistory />
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">

          {/* Plan & Quota */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-purple-600/20 blur-[60px]" />
            <div className="relative">
              <h2 className="mb-4 text-base font-black text-white">Your Plan</h2>
              <QuotaMeter />
            </div>
          </section>

          {/* Refer Friend */}
          <section className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-black/40 to-purple-600/10 p-6 backdrop-blur-xl">
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-orange-600/20 blur-[60px]" />
            <div className="relative">
              <ReferFriendCard />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
