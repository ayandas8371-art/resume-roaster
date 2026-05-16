"use client";

import { motion } from "framer-motion";
import { History, Flame, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from "lucide-react";
import { useHistory } from "@/hooks/use-history";
import { formatDate, getScoreColor, truncate } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { RoastResult } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoastCard } from "@/components/roast-card";

export default function HistoryPage() {
  const { roasts, total, page, hasMore, isLoading, nextPage, prevPage } = useHistory();
  const [selectedRoast, setSelectedRoast] = useState<RoastResult | null>(null);
  const router = useRouter();

  if (selectedRoast) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedRoast(null)} className="rounded-lg bg-bg-secondary px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary">
          ← Back to History
        </button>
        <RoastCard roast={selectedRoast} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Generation History</h1>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Relive the pain. {total} roast{total !== 1 ? "s" : ""} total.</p>
        <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-red-500 mt-4 rounded-full" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-bg-secondary p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-bg-tertiary" />
                  <div className="h-3 w-24 rounded bg-bg-tertiary" />
                </div>
                <div className="h-8 w-12 rounded bg-bg-tertiary" />
              </div>
            </div>
          ))}
        </div>
      ) : roasts.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <History className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white">No roasts found</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
            Upload a resume from the dashboard to start your collection of career burns.
          </p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-xl bg-white px-6 py-2 text-sm font-black text-black hover:bg-gray-200 transition-all"
          >
            Start Roasting
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {roasts.map((roast, i) => {
              const roastData = roast.roast_json as RoastResult;
              return (
                <motion.button
                  key={roast.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => router.push(`/dashboard/roast/${roast.id}`)}
                  className="w-full rounded-xl border border-white/5 bg-white/[0.02] p-6 text-left transition-all hover:bg-white/[0.05] hover:scale-[1.01] hover:border-white/10 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{roast.resume_name}</p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 bg-white/5 px-2 py-0.5 rounded">PDF</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{formatDate(roast.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className={cn("text-lg font-black tracking-tighter", getScoreColor(roast.score))}>{roast.score}</p>
                        <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Score</p>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <button onClick={prevPage} disabled={page <= 1} className="flex items-center gap-1 rounded-lg bg-bg-secondary px-4 py-2 text-sm text-text-secondary disabled:opacity-30 hover:bg-bg-tertiary">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-xs text-text-secondary">Page {page}</span>
            <button onClick={nextPage} disabled={!hasMore} className="flex items-center gap-1 rounded-lg bg-bg-secondary px-4 py-2 text-sm text-text-secondary disabled:opacity-30 hover:bg-bg-tertiary">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
