"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface RemainingRoastsBadgeProps {
  initialUsage: {
    roasts_remaining?: number;
    remaining?: number;
  } | null;
}

export function RemainingRoastsBadge({ initialUsage }: RemainingRoastsBadgeProps) {
  const [usage, setUsage] = useState<any>(initialUsage);

  useEffect(() => {
    // 1. Initial client-side sync: fetch latest quota immediately on mount to bypass Next.js page caching
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/usage");
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } catch (err) {
        console.error("Failed to sync remaining roasts:", err);
      }
    };
    fetchLatest();

    // 2. Event-driven sync: listen for updates from other components
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setUsage(e.detail);
      }
    };

    window.addEventListener("quota-updated", handleUpdate);
    return () => {
      window.removeEventListener("quota-updated", handleUpdate);
    };
  }, []);

  if (!usage) return null;

  const remaining = typeof usage.roasts_remaining === "number" 
    ? usage.roasts_remaining 
    : (typeof usage.remaining === "number" ? usage.remaining : 2);

  return (
    <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
      <TrendingUp className="h-4 w-4 text-orange-400" />
      <span className="text-sm font-bold text-white">
        {remaining} roast{remaining !== 1 ? "s" : ""} remaining
      </span>
    </div>
  );
}
