"use client";

import { useState, useEffect, useCallback } from "react";
import type { UsageStats } from "@/types";
import { Plan } from "@/types";

export function useUsage() {
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/usage");
      if (!response.ok) {
        throw new Error("Failed to fetch usage");
      }
      const data = await response.json();
      setUsage(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch usage");
      // Set default usage on error
      setUsage({
        quota_used: 0,
        quota_limit: 2,
        roasts_remaining: 2,
        plan: Plan.FREE,
        is_lifetime_limit: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setUsage(e.detail);
      }
    };

    window.addEventListener("quota-updated", handleUpdate);
    window.addEventListener("refresh-quota", fetchUsage);
    
    return () => {
      window.removeEventListener("quota-updated", handleUpdate);
      window.removeEventListener("refresh-quota", fetchUsage);
    };
  }, [fetchUsage]);

  return { usage, isLoading, error, refetch: fetchUsage };
}
